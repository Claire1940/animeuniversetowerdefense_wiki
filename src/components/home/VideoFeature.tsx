"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

/**
 * 视频特性区：IntersectionObserver 监测进入视口时懒加载并自动播放
 * （autoplay=1&mute=1&loop=1），进入前展示缩略图 + 点击播放按钮作为后备。
 */
export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  // 进入视口即懒加载播放（autoplay + mute + loop）
  useEffect(() => {
    if (active) return;
    if (typeof IntersectionObserver === "undefined") {
      // SSR / 无 IO 支持时直接激活（点击后备仍可用）
      setActive(true);
      return;
    }
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  const watchUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${videoId}`,
    [videoId],
  );

  const embedUrl = useMemo(
    () =>
      `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`,
    [videoId],
  );

  const thumbUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackThumbUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {active ? (
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 flex h-full w-full items-center justify-center"
          >
            {/* 缩略图（maxres 失败回退 hq） */}
            <img
              src={thumbUrl}
              onError={(e) => {
                const img = e.currentTarget;
                if (img.src !== fallbackThumbUrl) img.src = fallbackThumbUrl;
              }}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <span className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/30" />
            <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] shadow-lg transition-transform group-hover:scale-110">
              <Play className="ml-1 h-7 w-7 fill-white text-white" />
            </span>
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
