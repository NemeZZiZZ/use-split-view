// @ts-check
import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"
import react from "@astrojs/react"

// https://astro.build/config
export default defineConfig({
  site: "https://nemezzizz.github.io",
  base: "/use-split-view",
  integrations: [
    react(),
    starlight({
      title: "useSplitView",
      description:
        "Headless React hook for split-view side-by-side comparison with synchronized zoom, pan, and pinch.",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/NemeZZiZZ/use-split-view",
        },
      ],
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        { label: "Getting Started", slug: "getting-started" },
        {
          label: "Guides",
          items: [
            { label: "Anatomy of a Split View", slug: "guides/anatomy" },
            { label: "Horizontal & Vertical", slug: "guides/direction" },
            { label: "Natural Size & Fit", slug: "guides/natural-size" },
            { label: "The Drag Handle", slug: "guides/drag-handle" },
            { label: "Controlled View State", slug: "guides/controlled-mode" },
            { label: "Zoom Controls", slug: "guides/zoom-controls" },
            { label: "Locking Zoom/Pan", slug: "guides/locking" },
            { label: "Animated Transitions", slug: "guides/animated-transitions" },
          ],
        },
        {
          label: "Examples",
          items: [
            { label: "Image Comparison", slug: "examples/image-comparison" },
            { label: "Video Comparison", slug: "examples/video-comparison" },
            { label: "Before/After Maps", slug: "examples/before-after-maps" },
          ],
        },
        {
          label: "Reference",
          items: [
            { label: "API Reference", slug: "reference/api" },
            { label: "Types", slug: "reference/types" },
          ],
        },
      ],
    }),
  ],
})
