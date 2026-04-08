import { useSplitView } from "use-split-view"
import { DemoSection } from "../components/DemoSection"
import { SplitViewShell } from "../components/SplitViewShell"

const PALETTES = {
  warm: {
    colors: ["#ef4444", "#f97316", "#eab308", "#f59e0b", "#dc2626"],
    bg: "#1c1917",
    label: "Warm Palette",
  },
  cool: {
    colors: ["#3b82f6", "#8b5cf6", "#06b6d4", "#6366f1", "#0ea5e9"],
    bg: "#0f172a",
    label: "Cool Palette",
  },
} as const

function SvgArt({ palette }: { palette: "warm" | "cool" }) {
  const { colors, bg, label } = PALETTES[palette]

  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" style={{ backgroundColor: bg }}>
      {colors.map((c, i) => (
        <g key={i}>
          <circle cx={80 + i * 65} cy={150} r={40 - i * 3} fill={c} opacity={0.8} />
          <circle
            cx={80 + i * 65}
            cy={150}
            r={20 - i * 2}
            fill={c}
            opacity={0.4}
            stroke={c}
            strokeWidth={1}
          />
          <rect
            x={60 + i * 65}
            y={200}
            width={40}
            height={40 + i * 8}
            rx={6}
            fill={c}
            opacity={0.3}
          />
        </g>
      ))}
      <text
        x="200"
        y="40"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontFamily="system-ui"
        opacity={0.7}
      >
        {label}
      </text>
    </svg>
  )
}

export function SvgDemo() {
  const sv = useSplitView({ direction: "vertical" })

  return (
    <DemoSection
      title="SVG / Canvas Art"
      description="Vertical split comparing two color palettes"
      sv={sv}
    >
      <SplitViewShell
        sv={sv}
        className="grow"
        bgStyle={{ backgroundColor: "#000" }}
        startLabel="Warm"
        endLabel="Cool"
        startContent={
          <div
            className="h-full w-full"
            ref={(el) => {
              if (el && !sv.naturalSize) sv.setNaturalSize(400, 300)
            }}
          >
            <SvgArt palette="warm" />
          </div>
        }
        endContent={
          <div className="h-full w-full">
            <SvgArt palette="cool" />
          </div>
        }
      />
    </DemoSection>
  )
}
