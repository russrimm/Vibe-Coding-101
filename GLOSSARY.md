# Beginner glossary

You do not need to memorize these terms. Return to [the course](README.md) and look one up when you need it.

In the portal, dotted-underlined words also have definitions on hover, keyboard focus, or tap. Press Escape to close a definition; **Hide word explanations** returns to plain prose. The searchable **Glossary** stays available either way.

## The three places you work

- **GitHub Copilot desktop app:** the AI coding app used for this course. You create a local project session, send prompts, review changes, and inspect results. Use the [official download page](https://github.com/features/ai/github-app) and follow your organization's installation policy. It is not GitHub Desktop, Copilot CLI, or the VS Code extension.
- **Chat:** the conversation where you give Copilot plain-English instructions. Do not paste terminal commands into chat unless you are asking Copilot to run or explain them.
- **Terminal:** a text window that runs commands on your computer. Use PowerShell on Windows, Terminal on macOS, or `/terminal` in an active Copilot desktop session; no editor is required.
- **Browser:** the app that displays websites. Its address bar is where you open the generated app's preview URL.

## Working with AI

- **Vibe coding:** a development approach where AI agents handle much of the coding while you guide, review, and verify.
- **Prompt:** a request to the AI. A useful one says what should change, what must not change, and how to test it.
- **Agent:** an AI assistant that can use tools to read/write files and run commands within its permissions. Its output can be wrong.
- **Plan:** a description of proposed work. Approving a plan is a separate decision from granting unrestricted tool access.
- **Permission:** authorization for an action. Read its target path, command, network destination, and potential cost before allowing it.
- **Acceptance criterion:** an observable result used to decide whether a feature works.
- **Evidence:** the result you actually saw, such as an error message, a browser behavior, an exit code, or a commit ID.
- **Synthetic data:** completely made-up data used for practice. Removing a real person's name does not necessarily make a record safe to share.

## Files and workspaces

- **Folder / directory:** a place containing files.
- **Path:** the address of a file or folder on a computer.
- **Project:** a set of related files for an app.
- **Session:** a conversation plus its working context in the desktop app.
- **Workspace / working directory:** the location where this session reads files and runs commands. Check it before making changes.
- **Worktree:** a separate checkout of a Git repository, often used to isolate a session's work. It can have a different path from the original project.
- **Scaffold:** the smallest initial set of files and settings needed to run an app.
- **Package:** reusable code installed from a package source.
- **Dependency:** a package your app or its development tools need.
- **Lockfile:** a record of resolved dependency versions (`package-lock.json` for npm). Keep it so later installs can reproduce that dependency tree.
- **Instruction file:** project guidance an AI may read. Instructions for the learning portal are not automatically appropriate for your small learner app.
- **Markdown:** plain text with formatting marks, such as `#` for a heading. Files end in `.md`, not `.md.txt`.
- **YAML frontmatter:** a short settings block between `---` lines at the beginning of a Markdown file. A skill uses it to declare its name and description.
- **JSON:** structured text used for data and settings. Use double quotes around names/text; ordinary JSON does not allow comments or trailing commas.
- **PATH:** a list of folders searched by the terminal to find a command. Reopening a terminal after installation helps it see updated PATH settings.

## The local web app

- **Node.js:** runs JavaScript on your computer and powers tools such as Vite. This lab uses Node.js 24 LTS as its baseline.
- **LTS:** long-term support, a release support policy used by Node.js. Not every package has an LTS release.
- **npm:** Node.js's package manager and script runner. `npm run dev` runs the project's `dev` script.
- **React:** a library for building a user interface from components.
- **Component:** a reusable part of an interface, such as a list or a labeled form.
- **TypeScript:** JavaScript with type checks that catch some mistakes before running code. It does not replace runtime validation.
- **Vite:** provides a local dev server and builds browser files from source.
- **CSS / Tailwind CSS:** CSS controls appearance; Tailwind supplies small CSS utility classes. The core learner app can use plain CSS.
- **State:** values that can change while the app runs, such as the current records or search text.
- **Validation:** checking data before accepting it, such as rejecting a name made only of spaces.
- **Localhost:** an address referring to the computer making the request. It is not a public sharing URL.
- **Port:** the number after the colon in a local URL. Use the exact port printed by the dev server; another app may already occupy its first choice.
- **Origin:** the combination of scheme, host, and port. `localhost` and `127.0.0.1` are different hosts for browser storage.
- **localStorage / persistence:** browser storage can keep records after refresh at the same origin. Clearing site data, private browsing, or changing browser/origin may lose or separate it. It is not a secure database, cross-device sync, or backup.
- **Build:** checking/transforming source into files such as `dist`. A successful build does not prove the interface behaves correctly.
- **Lint / ESLint:** checks code against configured rules for common mistakes. The portal and pinned learner starter already include ESLint; run each project's existing `npm run lint` rather than installing another tool. A passing lint check does not prove an app is bug-free.
- **Exit code:** the number a finished command returns. Usually `0` means success and a nonzero value means failure.
- **Accessibility:** making the app usable by people with different abilities and input methods. A few keyboard tests are not a full conformance audit.

## Saving code

- **Git:** tracks file changes and saved snapshots locally.
- **Repository / repo:** a project with Git history. It does not have to be hosted online.
- **Diff:** a view of what changed. Newly created, untracked files also need review.
- **Stage:** select particular changes for the next commit.
- **Commit:** a named snapshot in local Git history. It is not a push, deployment, or off-device backup.
- **Branch:** a named line of work in Git.
- **Merge:** combine work from branches after reviewing the changes.
- **GitHub:** an online service for hosting repositories and collaboration.
- **Two-factor authentication:** a second proof of identity at sign-in, such as an authenticator code. Recovery codes belong in safe storage, never in chat or evidence notes.
- **Clone:** make a local copy of a Git repository and its history.
- **Fork:** create a separate copy of a repository on GitHub. Not required for this local lab.
- **Push / pull:** send commits to, or fetch and integrate work from, a remote repository. Neither happens just because you made a local commit.
- **Pull request:** a proposal to review and merge changes on a repository hosting service.

## Optional advanced terms—not prerequisites

- **API:** a defined way for programs to exchange requests and data.
- **Backend:** server-side code and storage, separate from browser code.
- **Authentication / authorization:** proving identity / checking which actions that identity may take.
- **Cloud / Azure:** remotely hosted computing services; use requires separate permission, cost, and privacy planning.
- **Deployment:** publishing or running an app in a target environment. It is not required for core completion.
- **MCP:** a protocol for connecting AI clients to external tools. A tool connection does not automatically connect the generated app to data.
- **Agent skill:** a folder containing `SKILL.md`, and optionally resources or scripts. Copilot loads it for a matching task. Skills are not guaranteed to be used or correct; [Lab 06](docs/lab-06-instructions-and-skills.md) teaches discovery and evidence checks with a script-free local example.
- **Plugin:** an installable bundle of customizations that can include skills, agents, hooks, or MCP tools. Review all included capabilities, not only its name.
- **Streamable HTTP:** a network transport used by remote MCP servers. [Lab 07](docs/lab-07-mcp.md) uses a public documentation endpoint, not a local server process.
- **Read-only tool:** a tool intended to retrieve rather than change data. Its provider still receives your query, so do not send private content.
- **Citation:** a source link supporting a claim. Open it and compare the actual text; a real link does not make every claim true.
- **Hallucination:** a plausible AI statement that lacks support or is wrong. Ask for actual results and leave missing evidence **NOT RUN** or **NOT VERIFIED**.
- **Microsoft Graph:** an API for Microsoft 365 data with endpoint-specific permissions and account support.
- **Environment variable:** configuration supplied to a program. It is not automatically secret. Values prefixed `VITE_` can be bundled into browser files; never store credentials there.
- **Custom agent / Beast Mode:** user-defined behavior or instructions, not a built-in guarantee of quality, security, or production readiness. Not required.
- **VS Code / CLI / WSL:** an editor / a text-command interface / a Windows Linux environment. None is the Copilot desktop app; none is required for this course.
- **CI/CD:** configured automation for checking and delivering changes. A successful pipeline does not replace app-specific acceptance testing.

## Intermediate and advanced terms (learning path Levels 2–3)

- **Spec:** short for specification. A short file that says what a feature must do, what is out of scope, and how to check it. [Lab 08](docs/lab-08-specs-and-context.md) writes one.
- **Context window:** the limited amount of text an AI model can consider at once, including your messages, attached files, and tool output. `/context` shows how full a session is; `/compact` summarizes older parts.
- **Unit test:** a small automated check of one function. [Lab 09](docs/lab-09-tests-as-guardrails.md) adds Vitest and practices red → green.
- **Red → green:** write a test, watch it fail for the right reason (red), then change the code until it passes (green).
- **Mutation testing:** breaking code on purpose to confirm a test notices. Lab 09 does a tiny manual version.
- **Refactor:** changing how code is organized without changing what the user sees.
- **Regression:** something that used to work and is now broken because of a recent change.
- **Stack trace:** the list of `at ...` lines under an error showing which code was running. Copy it into bug reports; start reading at the first red line.
- **Pull request (PR):** a GitHub page proposing to merge one branch into another, with review comments and automated checks. [Lab 11](docs/lab-11-branches-prs-and-review.md) opens one.
- **Merge conflict:** two branches changed the same lines differently. A person must decide the result; ask Copilot to explain both sides before resolving it.
- **Autopilot:** a session mode where the agent works without waiting for you between steps. Use it only with tests, a spec, and a saved commit. [Lab 12](docs/lab-12-autopilot-and-parallel-sessions.md) covers it.
- **Local sandbox:** an operating-system boundary that limits which files, networks, and credentials agent-run commands can reach. In public preview in the Copilot app; off by default.
- **Cloud sandbox:** a session that runs entirely on GitHub-hosted computers. Billed based on usage.
- **Fork (session):** `/fork` copies the current Copilot session so you can try another approach. This is different from forking a GitHub repository.
- **Agent profile (`.agent.md`):** the Markdown file that defines a custom agent: a description, instructions, and an optional `tools` list. [Lab 13](docs/lab-13-custom-agents-and-automations.md) creates a read-only one.
- **Automation:** a saved prompt in the Copilot app that runs manually, on a schedule, or when issues or pull requests change. Each run uses your plan's allowance.

**Next:** [Start Lab 00](docs/lab-00-prerequisites.md).
