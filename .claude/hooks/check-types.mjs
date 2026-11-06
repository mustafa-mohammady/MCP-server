#!/usr/bin/env node
// PostToolUse hook: after Claude edits a .ts/.tsx file, run `npm run check`.
// Exit 0 = all good (or not a TypeScript file).
// Exit 2 = type errors; stderr is sent back to Claude so it can fix them.

import { spawnSync } from "node:child_process";

let raw = "";
for await (const chunk of process.stdin) raw += chunk;

let input;
try {
  input = JSON.parse(raw || "{}");
} catch {
  process.exit(0); // not our business if the payload is unreadable
}

const filePath =
  input.tool_input?.file_path ?? input.tool_response?.filePath ?? "";

if (!/\.(ts|tsx)$/.test(filePath)) {
  process.exit(0);
}

const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();

const result = spawnSync("npm", ["run", "--silent", "check"], {
  cwd: projectDir,
  encoding: "utf8",
});

if (result.status === 0) {
  process.exit(0);
}

const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
process.stderr.write(
  `Type check failed after editing ${filePath}. Fix these errors:\n\n${output}\n`
);
process.exit(2);
