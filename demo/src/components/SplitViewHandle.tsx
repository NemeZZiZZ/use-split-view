import type { UseSplitViewReturn } from "use-split-view"

export function SplitViewHandle({ sv }: { sv: UseSplitViewReturn }) {
  const isH = sv.direction === "horizontal"

  return (
    <div
      {...sv.handleProps}
      className={`group absolute z-20 ${
        isH
          ? "top-0 bottom-0 w-6 -translate-x-1/2 cursor-col-resize"
          : "right-0 left-0 h-6 -translate-y-1/2 cursor-row-resize"
      }`}
      style={isH ? { left: sv.splitCSSValue } : { top: sv.splitCSSValue }}
    >
      <div
        className={`bg-white drop-shadow-lg transition-all ${
          isH ? "mx-2.5 h-full w-0.5 group-hover:w-1" : "my-2.5 h-0.5 w-full group-hover:h-1"
        }`}
      />
      <div className="pointer-events-none absolute top-1/2 left-1/2 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/10 transition-transform group-hover:scale-110 group-active:scale-95">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className={`text-zinc-500 ${isH ? "" : "rotate-90"}`}
        >
          <path
            d="M4 3L1 7L4 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 3L13 7L10 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
