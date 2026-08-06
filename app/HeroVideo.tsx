"use client";

import { useRef, useState } from "react";

type HeroVideoProps = {
  src: string;
  poster: string;
};

export function HeroVideo({ src, poster }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
    } else {
      void video.play().catch(() => undefined);
    }
    setPlaying(!playing);
  }

  return (
    <>
      <video ref={videoRef} className="hero-film" src={src} poster={poster} muted autoPlay loop playsInline preload="metadata" />
      <button type="button" className="hero-media-toggle" onClick={toggle} aria-pressed={!playing}>
        {playing ? "Pause background video" : "Play background video"}
      </button>
    </>
  );
}
