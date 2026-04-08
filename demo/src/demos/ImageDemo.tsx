import { useState } from "react"
import { useSplitView, type SplitViewDirection } from "use-split-view"
import { DemoSection } from "../components/DemoSection"
import { SplitViewShell } from "../components/SplitViewShell"

const IMAGE_URL = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"

function DirectionToggle({
  value,
  onChange,
}: {
  value: SplitViewDirection
  onChange: (d: SplitViewDirection) => void
}) {
  return (
    <div className="bg-zinc-900 inline-flex rounded-lg p-0.5">
      {(["horizontal", "vertical"] as const).map((d) => (
        <button
          key={d}
          onClick={() => onChange(d)}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            value === d ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          {d === "horizontal" ? "H" : "V"}
        </button>
      ))}
    </div>
  )
}

export function ImageDemo() {
  const [direction, setDirection] = useState<SplitViewDirection>("horizontal")
  const sv = useSplitView({ direction })

  return (
    <DemoSection
      title="Image Comparison"
      description="Compare before/after with zoom and pan"
      sv={sv}
      toolbar={<DirectionToggle value={direction} onChange={setDirection} />}
    >
      <SplitViewShell
        sv={sv}
        className="grow"
        bgStyle={{
          backgroundImage: "repeating-conic-gradient(#27272a 0% 25%, transparent 0% 50%)",
          backgroundSize: "24px 24px",
        }}
        startLabel="Original"
        endLabel="Grayscale"
        startContent={
          <img
            src={IMAGE_URL}
            alt="Original"
            draggable={false}
            className="block h-full w-full object-fill"
            crossOrigin="anonymous"
            onLoad={(e) => {
              sv.setNaturalSize(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)
            }}
          />
        }
        endContent={
          <img
            src={IMAGE_URL}
            alt="Grayscale"
            draggable={false}
            className="block h-full w-full object-fill grayscale"
            crossOrigin="anonymous"
          />
        }
      />
    </DemoSection>
  )
}
