import { getImageProps, type ImageProps } from "next/image";
import { preload } from "react-dom";

/**
 * next/image, minus the inline style attribute. Use this instead of importing
 * next/image directly.
 *
 * next/image writes `style="color:transparent"` on every image, and for `fill`
 * the absolute positioning as well. Style attributes can only be allowed by
 * `style-src 'unsafe-inline'` -- a nonce covers <style> elements, never
 * attributes -- so they were the one thing keeping that in the CSP
 * (lib/csp.ts). This renders the same optimized <img> from getImageProps and
 * expresses those styles as classes instead.
 */
export default function Image({ className, ...rest }: ImageProps) {
  const { props } = getImageProps(rest);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { style, ...img } = props;

  // getImageProps only returns the <img> props; the preload <link> that
  // next/image would have added for `preload`/`priority` is ours to make.
  if (rest.preload || rest.priority) {
    preload(img.src, {
      as: "image",
      imageSrcSet: img.srcSet,
      imageSizes: img.sizes,
      fetchPriority: "high",
    });
  }

  const classes = [rest.fill ? "absolute inset-0 h-full w-full" : "", "text-transparent", className]
    .filter(Boolean)
    .join(" ");
  // The <img> *is* next/image's output, optimized srcset and all.
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...img} className={classes} />;
}
