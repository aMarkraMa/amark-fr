const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/

function parseSimpleYaml(yaml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const line of yaml.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const colonIndex = trimmed.indexOf(":")
    if (colonIndex === -1) continue

    const key = trimmed.slice(0, colonIndex).trim()
    const rawValue = trimmed.slice(colonIndex + 1).trim()

    if (
      (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
      (rawValue.startsWith("'") && rawValue.endsWith("'"))
    ) {
      result[key] = rawValue.slice(1, -1)
      continue
    }

    if (rawValue === "true") {
      result[key] = true
      continue
    }

    if (rawValue === "false") {
      result[key] = false
      continue
    }

    result[key] = rawValue
  }

  return result
}

export function parseFrontmatter(rawContent: string) {
  const match = FRONTMATTER_RE.exec(rawContent)

  if (!match) {
    return { metadata: {}, content: rawContent }
  }

  return {
    metadata: parseSimpleYaml(match[1]),
    content: match[2],
  }
}
