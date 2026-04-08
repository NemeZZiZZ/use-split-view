import { useSplitView } from "use-split-view"
import { DemoSection } from "../components/DemoSection"
import { SplitViewShell } from "../components/SplitViewShell"

const VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm"

export function VideoDemo() {
  const sv = useSplitView({ direction: "horizontal" })

  return (
    <DemoSection
      title="Video Comparison"
      description="Split-view works with any content, including video"
      sv={sv}
    >
      <SplitViewShell
        sv={sv}
        className="grow"
        bgStyle={{ backgroundColor: "#000" }}
        startLabel="Normal"
        endLabel="Sepia"
        startContent={
          <video
            src={VIDEO_URL}
            autoPlay
            loop
            muted
            playsInline
            crossOrigin="anonymous"
            className="block h-full w-full object-fill"
            onLoadedData={(e) => {
              sv.setNaturalSize(e.currentTarget.videoWidth, e.currentTarget.videoHeight)
            }}
          />
        }
        endContent={
          <video
            src={VIDEO_URL}
            autoPlay
            loop
            muted
            playsInline
            crossOrigin="anonymous"
            className="block h-full w-full object-fill sepia"
          />
        }
      />
    </DemoSection>
  )
}
