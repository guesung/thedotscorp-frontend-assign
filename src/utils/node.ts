import type { ReactNode } from "react";

export function nodeToString(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(nodeToString).join("");
  }
  if (node && typeof node === "object") {
    if ("props" in node) {
      const props = node.props as { children?: ReactNode };
      if (props.children) {
        return nodeToString(props.children);
      }
    }
  }
  return "";
}
