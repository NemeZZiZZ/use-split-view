import type { ReactNode } from "react"
import type { SplitPaneState } from "use-split-view"

export function SplitViewPane({
  pane,
  label,
  labelPosition = "left",
  zIndex,
  children,
}: {
  pane: SplitPaneState
  label?: string
  labelPosition?: "left" | "right"
  zIndex?: number
  children: ReactNode
}) {
  return (
    <div className="absolute inset-0" style={{ clipPath: pane.clipPath, zIndex }}>
      <div
        className="grid h-full w-full origin-top-left place-items-center transition-transform duration-100 ease-in-out"
        style={{ transform: pane.transform }}
      >
        <div className="relative" style={pane.contentStyle}>
          {children}
        </div>
      </div>
      {label && (
        <div
          className={`absolute bottom-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm ${
            labelPosition === "left" ? "left-3" : "right-3"
          }`}
        >
          {label}
        </div>
      )}
    </div>
  )
}
