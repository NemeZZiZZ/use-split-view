import type { ReactNode } from "react"
import type { UseSplitViewReturn } from "use-split-view"
import { SplitViewPane } from "./SplitViewPane"
import { SplitViewHandle } from "./SplitViewHandle"

export function SplitViewShell({
  sv,
  startContent,
  endContent,
  startLabel,
  endLabel,
  bgStyle,
  className = "",
}: {
  sv: UseSplitViewReturn
  startContent: ReactNode
  endContent: ReactNode
  startLabel?: string
  endLabel?: string
  bgStyle?: React.CSSProperties
  className?: string
}) {
  const startPane = sv.getPaneState("start")
  const endPane = sv.getPaneState("end")

  return (
    <div
      ref={sv.containerRef}
      className={`relative w-full overflow-hidden rounded-xl touch-none select-none min-h-80 ${className}`}
      style={bgStyle}
    >
      <SplitViewPane pane={startPane} label={startLabel} labelPosition="left" zIndex={1}>
        {startContent}
      </SplitViewPane>

      <SplitViewPane pane={endPane} label={endLabel} labelPosition="right">
        {endContent}
      </SplitViewPane>

      <SplitViewHandle sv={sv} />
    </div>
  )
}
