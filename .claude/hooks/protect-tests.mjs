#!/usr/bin/env node
// PreToolUse hook: block changes to EXISTING test files.
// Creating a NEW test file is allowed.
// Exit 0 = allow. Exit 2 = block; stderr is shown to Claude.

import { existsSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";

let raw = "";
for await (const chunk of process.stdin) raw += chunk;

let input;
try {
  input = JSON.parse(raw || "{}");
} catch {
  process.exit(0);
}

const filePath = input.tool_input?.file_path ?? "";
const isTestFile = /\.(test|spec)\.[cm]?[jt]sx?$/.test(filePath);

if (!isTestFile) {
  process.exit(0);
}

const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const absolutePath = isAbsolute(filePath) ? filePath : resolve(projectDir, filePath);

if (!existsSync(absolutePath)) {
  process.exit(0); // a new test file is fine
}

process.stderr.write(
  `Blocked: ${filePath} is an existing test file and must not be changed. ` +
    `If a test fails, fix the code under test instead. ` +
    `If you believe the test itself is wrong, stop and ask the user.\n`
);
process.exit(2);
