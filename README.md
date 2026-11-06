# Extend the Agent

(difficulty: 🔥🔥 each)

You will work on one project through four challenges: an **MCP server**, a **sub-agent**, **hooks** and the way from a **GitHub issue to a pull request**.

Work in a git repository (`git init -b main`, `git add .`, `git commit -m "Initial commit"`), so you can always see what the agent changed with `git diff`.

Use Claude Code in the **Manual mode** and read every permission prompt. Check the mode below the input at every start.

## The project

Bookshelf is the app from the first sessions. This copy has a problem that no test finds, because tests do not look at the screen. It is part of the first challenge.

## Challenge 1: Browser Check with MCP

An MCP server gives the agent new tools. With the Playwright server, Claude can open a browser, click, read the page and take a screenshot.

1. Start the app in a **separate terminal**: `npm run dev`. It runs at http://localhost:3000.
2. Before you install anything, look at what you are about to run: open the npm page of [`@playwright/mcp`](https://www.npmjs.com/package/@playwright/mcp). Who publishes it? The command below pins a version, so you do not get a different version tomorrow. (`npx -y` installs it without asking.)
3. Add the server to your project and start Claude Code:

   ```bash
   claude mcp add playwright -- npx -y @playwright/mcp@0.0.84
   claude
   ```

   Run `/mcp`. Is the server connected? Which tools does it offer?

4. Ask Claude: "Open http://localhost:3000, mark 'Gone Girl' as read and take a screenshot. Compare it with the books that are already read. Does the page look right? Report what you see." Read the permission prompts for the browser tools.
5. Claude should notice that something is wrong with the **read** books. Ask it to find the cause in the CSS and fix it, then to check again with a new screenshot.
6. Run `/context`. How much space do the tools of the MCP server take?

### Questions

- Which problem could a test in this project not find? Why?
- You gave the agent a browser. What could happen if the page it opens contains text like "ignore your instructions and ..."? (The next session is about exactly this.)
- When would you remove an MCP server again?

## Challenge 2: A Reviewer Sub-Agent

A **sub-agent** is a helper with its own context window, its own instructions and its own tools. It does a job and reports back a summary.

1. Create a sub-agent called `reviewer`. Run `/agents` and create a new project agent, or create the file `.claude/agents/reviewer.md` yourself. It should:
   - review the changes in the working tree (`git diff`) for bugs, missing tests, security problems and changes that were not asked for,
   - report findings with file and line, most important first,
   - **never edit files**. Give it only the tools it needs to read.
     Think about the `description`: it decides when Claude delegates a task to the agent.
2. Let Claude make a small change in the Manual mode, for example "Add a button that clears the search field".
3. Run `/context`. Then say: "Use the reviewer agent to review my changes." Run `/context` again. What changed in your main conversation?
4. Plant a flaw yourself, for example let a function change its input array in place, and ask the reviewer again. Does it find it?
5. Compare with asking the main agent "review my changes" in a fresh conversation. What is different?

### Questions

- Why does the reviewer not see your conversation? Is that good or bad for a review?
- When is a sub-agent a bad idea?

## Challenge 3: Hooks

A **hook** is a command that Claude Code runs automatically at a fixed point, for example after every edit. Unlike an instruction in `CLAUDE.md`, the agent cannot forget or ignore it.

1. **A type check after every edit.** Write a hook script that runs `npm run check` after Claude edited a `.ts` or `.tsx` file, and sends the errors back to Claude if it fails. Register it in `.claude/settings.json` as a `PostToolUse` hook for the tools that edit files.
2. **Test the script without Claude.** A hook receives a JSON description of the tool call on stdin. You can try it yourself:

   ```bash
   echo '{"tool_input":{"file_path":"src/books.ts"}}' | node .claude/hooks/check-types.mjs
   echo $?
   ```

   Exit code `0` means "all good", exit code `2` means "block, and show Claude the message on stderr".

3. **Try it with Claude:** ask it to change the type of `rating` in `src/types.ts` to `string`. What happens after the edit?
4. **Protect the tests.** Write a second hook, a `PreToolUse` hook that blocks edits to **existing** test files (creating a **new** test file is fine). Test it with the command above and with Claude: "Change the expected value in the test 'counts the read books' to 3."
5. Undo what you tried (`git restore .`).

### Questions

- What is the difference between a rule in `CLAUDE.md` ("never change tests") and your hook?
- Your hook runs commands on your computer without asking you. What does that mean for a repository from somebody else that contains hooks?
- What would be annoying about a type check after **every** edit?

## Challenge 4: From Issue to Pull Request

Claude Code can work with GitHub through the `gh` command line tool. You use it to take a feature from an issue to a pull request, with you in control of every step.

Prerequisites: your project is in a repository on GitHub (your own, public), the [GitHub CLI](https://cli.github.com/) is installed and you ran `gh auth login`.

### The issue

Create an issue in your repository with this text:

> **As a reader, I want to see my favorite genre, so that I know what I read most.**
>
> - The line above the list shows `Favorite genre: <genre>`.
> - The favorite genre is the genre with the most **read** books.
> - If two genres have the same number of read books, the one that comes first alphabetically wins.
> - If no book is read, it shows `–`.
> - The logic has tests.

### Tasks

1. Start Claude Code in **Plan mode** and ask it to read the issue (it can use `gh issue view 1`) and to plan the work. Review the plan.
2. Approve and review each edit. Ask Claude to work on a **branch** called `feature/favorite-genre`.
3. Run `npm run check` and `npm run test:run` yourself. Use your `reviewer` agent on the result.
4. Ask Claude to commit and to open a pull request that mentions the issue. Read **every** `git` and `gh` prompt. Say no to anything with `--force`, and to anything that touches another repository.
5. Read the pull request on GitHub like a reviewer. Is the description true? Run `/code-review` and compare it with your own reading.
6. Merge the pull request yourself.

### Questions

- Which steps would you never let the agent do without asking you?
- What did the agent write in the pull request that was not true or not important?

## Development

Install the dependencies with `npm i` first (Node.js 22.22 or newer is required).

- `npm run dev` starts the app at http://localhost:3000
- `npm run test` runs the tests in the watch mode, `npm run test:run` runs them once
- `npm run check` checks the types
- `npm run build` builds the app
