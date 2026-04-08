import { ImageDemo } from "./demos/ImageDemo"
import { VideoDemo } from "./demos/VideoDemo"
import { TableDemo } from "./demos/TableDemo"
import { SvgDemo } from "./demos/SvgDemo"

export function App() {
  return (
    <div className="bg-zinc-950 text-zinc-100 flex min-h-screen flex-col">
      <header className="border-zinc-800 flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">use-split-view</h1>
          <p className="text-zinc-500 text-sm">Headless React hook for split-view comparison</p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://www.npmjs.com/package/use-split-view"
            className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors"
            target="_blank"
            rel="noopener"
          >
            npm
          </a>
          <a
            href="https://github.com/NemeZZiZZ/use-split-view"
            className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors"
            target="_blank"
            rel="noopener"
          >
            GitHub
          </a>
        </div>
      </header>

      <div className="grid grow gap-4 px-6 py-8 max-sm:grid-cols-1 lg:grid-cols-2">
        <ImageDemo />
        <VideoDemo />
        <TableDemo />
        <SvgDemo />
      </div>

      <footer className="border-zinc-800 text-zinc-500 border-t px-6 py-4 text-center text-xs">
        Built with use-split-view + use-zoom-pinch. Scroll to pan, pinch/ctrl+scroll to zoom, drag
        the handle to split.
      </footer>
    </div>
  )
}
