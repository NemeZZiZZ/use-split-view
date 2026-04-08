import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/use-split-view/",
  optimizeDeps: {
    exclude: ["use-split-view"],
  },
  server: {
    watch: {
      // un-ignore the linked library so changes to its dist are picked up
      ignored: ["**/node_modules/!(.cache|use-split-view)/**"],
    },
  },
})
