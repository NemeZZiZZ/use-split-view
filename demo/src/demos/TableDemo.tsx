import { useSplitView } from "use-split-view"
import { DemoSection } from "../components/DemoSection"
import { SplitViewShell } from "../components/SplitViewShell"

const ROWS = [
  { name: "Alice Johnson", role: "Engineer", status: "Active", revenue: "$12,400" },
  { name: "Bob Smith", role: "Designer", status: "Active", revenue: "$9,800" },
  { name: "Carol White", role: "PM", status: "On Leave", revenue: "$15,200" },
  { name: "David Brown", role: "Engineer", status: "Active", revenue: "$11,600" },
  { name: "Eva Martinez", role: "Designer", status: "Inactive", revenue: "$7,300" },
  { name: "Frank Lee", role: "Engineer", status: "Active", revenue: "$13,900" },
  { name: "Grace Kim", role: "PM", status: "Active", revenue: "$16,500" },
  { name: "Henry Wilson", role: "Designer", status: "Active", revenue: "$8,700" },
]

const STATUS_DOT: Record<string, string> = {
  Active: "bg-blue-400",
  "On Leave": "bg-amber-400",
  Inactive: "bg-zinc-500",
}

const STATUS_BG: Record<string, string> = {
  Active: "bg-blue-500/10",
  "On Leave": "bg-amber-500/10",
  Inactive: "bg-zinc-500/10",
}

function TableContent({ variant }: { variant: "a" | "b" }) {
  const isA = variant === "a"
  const py = isA ? "py-1.5" : "py-3"
  const scheme = isA
    ? {
        bg: "bg-zinc-900",
        text: "text-zinc-100",
        muted: "text-zinc-400",
        border: "border-zinc-800",
        headerText: "text-zinc-500",
        rowBorder: "border-zinc-800/50",
        rowText: "text-zinc-300",
        rowHover: "hover:bg-zinc-800/40",
        badgeBg: "bg-zinc-800",
        badgeText: "text-zinc-400",
      }
    : {
        bg: "bg-slate-900",
        text: "text-slate-100",
        muted: "text-slate-400",
        border: "border-slate-700",
        headerText: "text-slate-400",
        rowBorder: "border-slate-800/50",
        rowText: "text-slate-200",
        rowHover: "hover:bg-slate-800/40",
        badgeBg: "bg-slate-800",
        badgeText: "text-slate-400",
      }

  const statusColor = (s: string) => {
    if (s === "Active") return isA ? "text-emerald-400" : "text-blue-400"
    if (s === "On Leave") return "text-amber-400"
    return "text-zinc-500"
  }

  return (
    <div className={`w-full h-full ${scheme.bg} p-4 overflow-auto`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`text-sm font-semibold ${scheme.text}`}>
          {isA ? "Design A — Compact" : "Design B — Spacious"}
        </h3>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${scheme.badgeBg} ${scheme.badgeText}`}
        >
          {ROWS.length} members
        </span>
      </div>
      <table className="w-full text-left text-xs">
        <thead>
          <tr className={`border-b ${scheme.border} ${scheme.headerText}`}>
            <th className={`${py} font-medium`}>Name</th>
            <th className={`${py} font-medium`}>Role</th>
            <th className={`${py} font-medium`}>Status</th>
            <th className={`${py} font-medium text-right`}>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r, i) => (
            <tr
              key={i}
              className={`border-b ${scheme.rowBorder} ${scheme.rowText} ${scheme.rowHover} transition-colors`}
            >
              <td className={`${py} font-medium`}>{r.name}</td>
              <td className={`${py} ${scheme.muted}`}>{r.role}</td>
              <td className={`${py} ${statusColor(r.status)}`}>
                {isA ? (
                  r.status
                ) : (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${STATUS_BG[r.status]}`}
                  >
                    <span className={`size-1.5 rounded-full ${STATUS_DOT[r.status]}`} />
                    {r.status}
                  </span>
                )}
              </td>
              <td className={`${py} text-right tabular-nums`}>{r.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function TableDemo() {
  const sv = useSplitView({ direction: "horizontal" })

  return (
    <DemoSection
      title="UI / Table Comparison"
      description="Compare two design variants of the same table"
      sv={sv}
    >
      <SplitViewShell
        sv={sv}
        className="grow"
        bgStyle={{ backgroundColor: "#09090b" }}
        startLabel="Design A"
        endLabel="Design B"
        startContent={
          <div
            className="h-full w-full"
            ref={(el) => {
              if (el && !sv.naturalSize) sv.setNaturalSize(800, 500)
            }}
          >
            <TableContent variant="a" />
          </div>
        }
        endContent={
          <div className="h-full w-full">
            <TableContent variant="b" />
          </div>
        }
      />
    </DemoSection>
  )
}
