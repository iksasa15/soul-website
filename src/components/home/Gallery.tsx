"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { galleryImages } from "@/data/projects";

type Caption = { alt: string; caption: string };
type Labels = { close: string; next: string; prev: string; of: string };

export function Gallery({ items, labels, rtl }: { items: Caption[]; labels: Labels; rtl: boolean }) {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const count = items.length;

  const close = useCallback(() => {
    setIndex(null);
    opener.current?.focus();
  }, []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + count) % count)), [count]);

  useEffect(() => {
    if (index === null) return;
    closeBtn.current?.focus();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(rtl ? -1 : 1);
      if (e.key === "ArrowLeft") step(rtl ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [index, close, step, rtl]);

  const Prev = rtl ? ChevronRight : ChevronLeft;
  const Next = rtl ? ChevronLeft : ChevronRight;

  return (
    <>
      <ul className="columns-2 gap-4 sm:gap-5 lg:columns-3">
        {galleryImages.map((img, i) => (
          <motion.li
            key={img.src}
            className="mb-4 break-inside-avoid sm:mb-5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setIndex(i);
              }}
              className="group relative block w-full overflow-hidden rounded-2xl border border-line text-start"
            >
              <Image
                src={img.src}
                alt={items[i].alt}
                width={img.width}
                height={img.height}
                sizes="(min-width: 1024px) 30vw, 48vw"
                className="h-auto w-full transition-transform duration-700 ease-out-expo group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-[#020a1a]/85 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-start text-xs font-medium text-white sm:p-4 sm:text-sm">
                <span className="line-clamp-2">{items[i].caption}</span>
                <Expand className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
              </span>
            </button>
          </motion.li>
        ))}
      </ul>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={items[index].caption}
            className="fixed inset-0 z-[90] flex flex-col bg-[#020a1a]/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <div className="flex items-center justify-between p-4 text-white/80">
              <span className="text-sm tabular-nums">
                {index + 1} {labels.of} {count}
              </span>
              <button
                ref={closeBtn}
                type="button"
                onClick={close}
                aria-label={labels.close}
                className="grid size-11 place-items-center rounded-full border border-white/20 text-white hover:bg-white/10"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-20" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.figure
                  key={index}
                  className="flex max-h-full flex-col items-center"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src={galleryImages[index].src}
                    alt={items[index].alt}
                    width={galleryImages[index].width}
                    height={galleryImages[index].height}
                    sizes="90vw"
                    className="max-h-[72vh] w-auto rounded-2xl object-contain shadow-2xl"
                  />
                  <figcaption className="mt-4 max-w-xl text-center text-sm text-white/85 sm:text-base">{items[index].caption}</figcaption>
                </motion.figure>
              </AnimatePresence>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={labels.prev}
                className="absolute start-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/15 sm:start-6"
              >
                <Prev className="size-6" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={labels.next}
                className="absolute end-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/15 sm:end-6"
              >
                <Next className="size-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
