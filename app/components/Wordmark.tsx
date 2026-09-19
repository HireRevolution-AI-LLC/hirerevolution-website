// The logo's wordmark, in its colors (Marketing/images/hirerevolution-logo-horizontal.png),
// as text so it stays sharp at any size.
export default function Wordmark({ className }: { className: string }) {
  return (
    <span className={`font-bold tracking-tight text-[#1D2E51] ${className}`}>
      Hire<span className="text-[#34579C]">Revolution</span>
      <span className="font-medium">.ai</span>
    </span>
  );
}
