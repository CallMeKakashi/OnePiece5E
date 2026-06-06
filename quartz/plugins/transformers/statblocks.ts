import { QuartzTransformerPlugin } from "../types"
import { Code, Root } from "mdast"
import { visit } from "unist-util-visit"
import { renderStatblockHtml } from "../../util/statblock"
// @ts-ignore
import statblockStyle from "../../styles/statblocks.scss"

export const Statblocks: QuartzTransformerPlugin = () => ({
  name: "Statblocks",
  markdownPlugins() {
    return [
      () => (tree: Root) => {
        visit(tree, "code", (node: Code, index, parent) => {
          if (node.lang !== "statblock" || parent == null || index == null) {
            return
          }

          try {
            parent.children[index] = {
              type: "html",
              value: renderStatblockHtml(node.value),
            }
          } catch (error) {
            const message = error instanceof Error ? error.message : "unknown error"
            parent.children[index] = {
              type: "html",
              value: `<div class="statblock-error">Failed to render statblock: ${message}</div>`,
            }
          }
        })
      },
    ]
  },
  externalResources() {
    return {
      css: [{ content: statblockStyle, inline: true }],
    }
  },
})
