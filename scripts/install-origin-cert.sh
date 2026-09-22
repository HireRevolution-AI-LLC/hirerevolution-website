#!/usr/bin/env bash
# Install the Cloudflare Origin CA certificate for hirerevolution.ai on the
# website droplet.
#
#   scripts/install-origin-cert.sh ~/Downloads/origin.pem
#
# The private key and the CSR were generated on the droplet and the key has
# never left it, so this only ever moves a certificate -- public data.
#
# Everything is checked before anything is replaced, and the old certificate
# is restored automatically if nginx will not take the new one. Do not do
# this with `ssh host 'cat > origin.crt'`: the redirect truncates the file
# the moment it opens, so an interrupted paste leaves an empty certificate
# and an nginx that cannot reload.
set -euo pipefail

CERT="${1:-}"
HOST="${ORIGIN_HOST:-159.89.242.172}"
KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519_infra}"
D=/etc/ssl/hirerevolution
EXPECTED_ISSUER="CloudFlare Origin SSL Certificate Authority"

[ -n "$CERT" ] || { echo "usage: $0 <path-to-origin-cert.pem>" >&2; exit 2; }
[ -f "$CERT" ] || { echo "no such file: $CERT" >&2; exit 1; }

echo "== checking the file locally =="
openssl x509 -in "$CERT" -noout >/dev/null 2>&1 || {
  echo "not a PEM certificate: $CERT" >&2
  echo "Download 'Origin Certificate' from Cloudflare (PEM), not the private key." >&2
  exit 1
}
issuer=$(openssl x509 -in "$CERT" -noout -issuer)
echo "   subject: $(openssl x509 -in "$CERT" -noout -subject)"
echo "   issuer:  $issuer"
echo "   expires: $(openssl x509 -in "$CERT" -noout -enddate | cut -d= -f2)"
echo "   names:   $(openssl x509 -in "$CERT" -noout -ext subjectAltName 2>/dev/null | tail -1 | xargs)"

if ! grep -qF "$EXPECTED_ISSUER" <<<"$issuer"; then
  echo >&2
  echo "REFUSING: issuer is not '$EXPECTED_ISSUER'." >&2
  echo "A self-signed or Let's Encrypt certificate here makes Cloudflare" >&2
  echo "Full (Strict) answer 526 for every visitor. Set FORCE=1 to override." >&2
  [ "${FORCE:-}" = "1" ] || exit 1
fi

echo "== uploading to a temp path (nothing replaced yet) =="
scp -q -i "$KEY" "$CERT" "root@$HOST:/tmp/origin-new.crt"

ssh -i "$KEY" "root@$HOST" "bash -s" <<'REMOTE'
set -euo pipefail
D=/etc/ssl/hirerevolution
NEW=/tmp/origin-new.crt

echo "== does it match the private key on this box? =="
c=$(openssl x509 -in "$NEW" -noout -pubkey | openssl sha256)
k=$(openssl pkey -in "$D/origin.key" -pubout | openssl sha256)
if [ "$c" != "$k" ]; then
  echo "REFUSING: this certificate was not issued for $D/origin.csr." >&2
  echo "Re-issue it in Cloudflare from that CSR." >&2
  rm -f "$NEW"; exit 1
fi
echo "   public key matches origin.key"

echo "== installing =="
cp -a "$D/origin.crt" "$D/origin.crt.previous"
install -m 644 "$NEW" "$D/origin.crt"
rm -f "$NEW"

if nginx -t 2>&1 | tail -2 && systemctl reload nginx; then
  rm -f "$D/PLACEHOLDER-REPLACE-BEFORE-DNS-CUTOVER"
  echo "   installed and nginx reloaded"
else
  echo "nginx rejected it -- rolling back" >&2
  mv "$D/origin.crt.previous" "$D/origin.crt"
  nginx -t && systemctl reload nginx
  exit 1
fi

echo "== now serving =="
openssl x509 -in "$D/origin.crt" -noout -issuer -enddate
REMOTE

echo "== end-to-end through the apex =="
for n in hirerevolution.ai www.hirerevolution.ai; do
  printf "   %-26s %s\n" "$n" \
    "$(curl -k -s -o /dev/null -w '%{http_code}' --resolve "$n:443:$HOST" "https://$n/")"
done
echo
echo "Cloudflare SSL/TLS must be Full (Strict), and both names proxied (orange)."
