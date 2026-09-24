"use client";

import Image from "./Image";
import { useState } from "react";

/**
 * A YouTube video that loads nothing from YouTube until it's clicked: just the
 * thumbnail. Then it swaps in the privacy-enhanced (no-cookie) player.
 */
export default function YouTube({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure>
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 shadow-lg">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 w-full h-full" aria-label={`Play video: ${title}`}>
            <Image
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover opacity-90 group-hover:opacity-100 transition"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-blue-700 ml-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 text-center font-medium text-gray-800">{title}</figcaption>
    </figure>
  );
}
