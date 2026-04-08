import type { ReactNode } from "react"
import type { UseSplitViewReturn } from "use-split-view"
import { ZoomToolbar } from "./ZoomToolbar"

export function DemoSection({
  title,
  description,
  sv,
  toolbar,
  children,
}: {
  title: string
  description: string
  sv: UseSplitViewReturn
  toolbar?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-zinc-500 text-sm">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          {toolbar}
          <ZoomToolbar sv={sv} />
        </div>
      </div>
      {children}
    </section>
  )
}
