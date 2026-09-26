# Lab 00: Set up your workspace

**Time:** 30–60 minutes for a first installation, before the 60–90 minute core lab. Downloads and account approval may take longer. You can stop after any numbered step and return later.

## What you will learn

- Tell the Copilot desktop app, a terminal, and your browser apart.
- Check the tools your computer needs.
- Keep your practice app separate from this learning portal.
- Review permissions before Copilot acts.

## Before you start

You need a computer, internet access, permission to install software, a GitHub account, and a Copilot plan. Follow your organization's software and account policies. Check your plan's usage limits before a workshop; this lab does not require a particular paid tier or a separate model-provider API key.

**Starting from zero is welcome.** You do not need these tools installed yet: this module walks through them. A phone or tablet can read the guide, but use a supported Windows or Mac computer to build. Keep about 2 GB of disk space available as a practical starting allowance for this small exercise; actual tool and package sizes vary.

**This course uses the GitHub Copilot desktop app**—the app hosting the lab's coding sessions. It does **not** use GitHub Desktop (a Git tool), Copilot CLI (a terminal tool), or the VS Code extension. You do not need VS Code, WSL, custom agents, MCP servers, a Microsoft 365 tenant, or an Azure subscription.

The app is generally available for Windows, macOS, and Linux. This lab gives Windows/macOS setup steps; Linux installation and OS-specific requirements should be checked against the [official quickstart](https://docs.github.com/en/copilot/get-started/quickstart-copilot-app). Minimum OS versions and installation privileges vary; do not bypass an organizational restriction.

**Vibe coding** means AI handles much of the coding while you guide it and verify the result. AI can make mistakes. A confident answer is not proof that an app works.

**Your route:** understand the three windows → install/check Node.js and Git → create/sign in to GitHub and Copilot → open one safe folder → plan, build, test, and save. After that, two optional guided modules teach instruction files, skills, and MCP. They are not a barrier to your first working app.

In the portal, dotted-underlined words have explanations on hover, keyboard focus, or tap. **Glossary** opens a searchable dictionary without losing your lesson. **Find your next small step** jumps within a lesson. Reading ahead never completes a checkpoint.

Want a shorter page? Choose **Read one step at a time** above the lesson. Start with the overview, then use **Next section** after trying the current step's check. **Choose a section** lets you return to a specific step, and **Show full lesson** makes all the instructions and troubleshooting visible again. Your selected section is saved in this browser when storage is available. A reading position is not proof that a tool is installed or a check passed.

## Step 1: Understand the three places you will work

| Place | What goes there | How to recognize it |
| --- | --- | --- |
| Copilot desktop chat | Plain-English prompts | A message box with Copilot's replies |
| Terminal | Commands such as `node --version` | A text window with a command prompt and output |
| Browser | The generated app's preview URL | An address bar and the page you are testing |

A **terminal** runs commands on your computer. Copilot can run commands through its tools; its output is not the same as you opening the app in a browser.

1. On Windows, open **Start**, search for **PowerShell**, and open it. On macOS, open **Applications → Utilities → Terminal**.
2. Later, in an active Copilot desktop session, type `/terminal` in the prompt box and press Enter to open a terminal in the right panel. Check its folder before running project commands.
3. Keep the learning portal in one browser tab and your generated app in a second tab. They are different apps.

### First command, with no risk to your files

1. Click inside the terminal. Its last line might start with `PS C:\Users\YourName>` on Windows or end with `%` on a Mac. That prefix is the **command prompt**. Do not copy or type the prefix.
2. Type the following line and press **Enter** once:

   ```terminal
   echo "Hello, future builder"
   ```

3. **Expected output:** `Hello, future builder`, followed by a new command prompt. This prints a message; it does not create files.
4. In later code boxes, **Terminal** means run each line separately and wait for the prompt to return. **Copilot chat** means send the whole request in the chat message box. **File content** means save text into a file, not execute it.
5. Copy with the code box's **Copy** button, then paste using **Ctrl+V** on Windows or **Command+V** on macOS. Do not paste the surrounding Markdown backticks. If Copy fails, select the text and copy manually.
6. **Later, when a preview server is running** (you start one in Lab 02), that terminal intentionally does not return to the prompt. Keep it open. **Ctrl+C** in that terminal stops that command on Windows or macOS; it is not the Mac copy shortcut. Do not close someone else's terminal or process.

**Checkpoint:** you can say which window gets a command, a prompt, or a URL before pasting anything.

## Step 2: Check Node.js, npm, and Git

Git is a prerequisite for the desktop app. Node.js and npm run the web-development tools.

1. **Terminal commands — run one line at a time:**

   ```terminal
   node --version
   npm --version
   git --version
   ```

2. **Expected output:** Node shows `v24.x.x` (the lab's Node.js 24 LTS baseline); npm shows a version number; Git shows `git version` followed by a version number. The `x` characters mean your installed patch numbers, not text to type. A newer Node LTS may work, but rehearse it with the chosen scaffold first.
3. If Node or npm is missing, follow the Node.js instructions for **your operating system only** below. npm comes with Node.js; do not search for a separate npm installer.
4. If Git is missing, follow the Git instructions below. Git and GitHub are different: installing Git does not create a GitHub account.
5. Close and reopen the terminal after installing tools. If Copilot desktop is already open, restart it too. Run all three commands again.
6. Write down the three actual versions. Do not mark this checkpoint while a command still fails.

**Troubleshooting:** “command not found” or “not recognized” usually means a tool is missing or the app still has its old environment. On Windows, if policy blocks `npm.ps1`, try `npm.cmd --version` and use `npm.cmd` in later commands. Do not weaken machine-wide execution policies or run random repair scripts. Ask your facilitator or IT support if approved installs are blocked.

### Windows: install Node.js and Git

1. Open [Node.js downloads](https://nodejs.org/en/download) in your browser. Select the **24.x LTS** release and **Windows**. Choose the Windows installer (`.msi`), not source code or a Docker image. If the page starts with a command-line installation method, find the prebuilt installer option.
2. Choose your computer's architecture: check **Settings → System → About → System type**. Most Intel/AMD PCs use x64; ARM-based PCs need a supported ARM build. Ask IT if unsure; do not guess based on the computer's brand.
3. Open the downloaded `.msi` from **Downloads**. Read the installer screens and keep npm and PATH integration enabled. **PATH** is the list of folders your terminal searches for commands. Accept only a trusted installer you intentionally downloaded.
4. You do not need the optional tools for compiling native modules for this starter. Do not install extra toolchains or package managers just because an optional checkbox offers them.
5. Open [Git's Windows download page](https://git-scm.com/downloads/win). Follow its link to the official Git for Windows installer for your architecture.
6. Open the installer. Follow your organization's approved defaults. Keep the option that makes Git available from the command line and third-party software. You do not need GitHub Desktop, WSL, or Git Bash to follow this PowerShell route.
7. Close and reopen PowerShell. Run the three version commands again. Save the actual output, not the example versions. If an installer requires permission you do not have, stop and ask IT.

### macOS: install Node.js and Git

1. Open [Node.js downloads](https://nodejs.org/en/download). Select **24.x LTS** and **macOS**, then the prebuilt installer (`.pkg`) rather than source code or Docker instructions. If architecture is requested, **Apple menu → About This Mac** shows an Apple chip or an Intel processor.
2. Open the `.pkg` from **Downloads** and follow the installer prompts through completion. npm is included. Use the approved installer route; you do not need Homebrew or a version manager for this exercise.
3. Open **Applications → Utilities → Terminal** and run `git --version`. If macOS offers **Command Line Tools**, select **Install**, read the terms, and let the installation finish. These tools include Git; you do not need the full Xcode app for this lab.
4. If no prompt appears and Git is missing, use Apple's documented installer request in Terminal:

   ```bash
   xcode-select --install
   ```

5. **Expected:** a system installation dialog, not a Git version. If it reports the tools are already installed, do not repeatedly reinstall them; retry `git --version` and ask IT if it still fails.
6. Quit and reopen Terminal and any already-running Copilot app. Run all three version commands again. See the [Git installation guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) for other approved options.

**Stuck reading the output?** The portal's optional tool-output helper below this module explains pasted version strings. It does not run anything or inspect your computer. Do not paste access tokens, passwords, or entire diagnostic logs.

## Step 3: Install, sign in, and check Copilot

### Create your GitHub account first

1. If your employer supplies an account, use that approved account and ask about Copilot access. Do not create a personal account to bypass a work policy.
2. Otherwise open [GitHub signup](https://github.com/signup) in your browser. Follow the account prompts, choose a username and a unique password, and verify your email when asked. Already have an account? Sign in instead of making another.
3. Follow any required two-factor authentication setup. It adds a second proof of identity, such as an authenticator code. Keep recovery codes in a safe place **outside this lab and chat**.
4. **Verify:** you can open your GitHub profile while signed in. You do not need to create a repository, enter payment details, or upload code for this check.
5. Follow the [Copilot access guidance](https://docs.github.com/en/copilot/get-started/what-is-github-copilot#get-access) to check the plan available to your account. Copilot Free, where eligible, has usage limits; do not promise a whole workshop will fit within them. A work account may need an assigned seat and app policy approval. Do not purchase an upgrade without reviewing its current price and terms.

### Install the AI coding app, not a similarly named product

1. Open the [official GitHub Copilot app download page](https://github.com/features/ai/github-app). Download the installer for your operating system; official versioned packages are also available from [GitHub's app releases](https://github.com/github/app/releases).
2. Open the downloaded installer and follow your operating system's installation prompts. Use your organization's approved software process if required. If you already have the app, open it and check the installed version instead.
3. Click **Sign in to GitHub**. Complete sign-in on the expected service's sign-in page and return to the app. Use **Use GitHub Enterprise** only if your organization uses that option. Never paste a password, access token, recovery code, or secret into chat.
4. Confirm you have a Copilot plan, then finish onboarding. You can skip connecting recent repositories—we will add an empty local folder next. Bring-your-own-provider credentials are an alternative supported by the app, but are outside this beginner route.
5. For a Business/Enterprise account, an administrator may need to check the separate **GitHub Copilot app** policy. The current app policy is separate from the CLI policy; installing the CLI does not resolve disabled app access.
6. Open **Chats** in the sidebar and start a conversation. **Chat prompt — paste into Copilot, not a terminal:**

   ```prompt
   In one sentence, explain what a local web app is. Do not create files or run commands.
   ```

7. **Verify:** you receive a meaningful reply. Record the desktop app version. An access, quota, or policy error is a setup blocker, not something to bypass.

**Before you move on:** Git tracks your files; GitHub is the account/hosting service; GitHub Copilot is the AI helper. A GitHub sign-in alone does not prove Copilot works. The reply above is your check.

> These labels were checked against the official documentation on 2026-09-26. Placement may differ in another app build. Consult the [current quickstart](https://docs.github.com/en/copilot/get-started/quickstart-copilot-app) if labels differ; do not switch to a similarly named Copilot product.

## Step 4: Make a dedicated learner folder and local session

1. In Windows File Explorer or macOS Finder, create a new folder named **VibeProjects** inside your personal Documents folder.
2. Inside it, create an **empty** folder named **my-first-vibe-app**. If that name already contains files, choose a new name; do not delete existing work.
3. In the **Copilot desktop app** sidebar, click **+** next to **Projects**. Under **Add project from**, choose **Local folder or repository**. Select your new empty folder—not this `Vibe-Coding-101` portal repository.
4. Under **Projects** in the sidebar, find your new learner project and click the **+** next to it to start a session.
5. In the dropdown below the prompt box, choose a **local** execution location, not a cloud sandbox. The app may offer a new working tree or the local repository, depending on the project. Use one local session for this lab. Each session gets its own workspace, but a local-repository session edits your folder directly—so always check the actual workspace path the next prompt reports.
6. Choose **Interactive** from the mode dropdown below the prompt field. **Chat prompt:**

   ```prompt
   Before changing anything, report this session's actual working directory,
   its project root, and whether it uses a separate Git worktree.
   List the existing files, including hidden project instructions.
   Run node --version, npm --version, and git --version here and show their output.
   Do not create, overwrite, delete, install, or deploy anything.
   ```

7. **Verify:** the reported project is your new learner project, and all three commands succeed inside the session too. An empty folder may contain Git metadata created by the app; it must not contain another app or private files.
8. Record the **actual session working directory**. A **worktree** is a separate checkout used by a session; its path may differ from the original folder. All later commands, file reviews, and commits must use this same session workspace.
9. Try `/terminal` in the active session. It opens a right-panel terminal. Keep terminal commands there and plain-English requests in chat.

10. In that terminal, check the folder yourself. On Windows run `Get-Location`; on macOS run `pwd`. **Expected:** the same actual session workspace Copilot reported. A **path** is simply a folder's address. If it differs, stop before running the scaffold; reopen the terminal for the correct session.

> Never scaffold inside the portal or copy the portal's enterprise instruction files into your beginner app. They describe a different project. If a session path or existing instruction is unexpected, pause and inspect it with your facilitator.

## Step 5: Agree on safe permissions

1. Stay in **Interactive** mode for the build steps. Use **Plan** for the next module's planning task; do not select **Autopilot** for this beginner exercise.
2. Before allowing an action, read its command, target path, and network destination. Ask “What will change, and can I undo it?”
3. Allow only actions needed for the current small step. Package installation downloads and runs code, so review the package names and source first.
4. Pause requests to delete files, read unrelated folders, reveal credentials, add accounts, publish a repository, expose a dev server to the network, or deploy cloud resources.
5. Do not enable blanket approval to make the lab faster. If you previously enabled tool auto-approval, `/reset-allowed-tools` in an active session clears session approvals and turns auto-approval off. Review the resulting permissions before continuing.
6. **Chat prompt if unsure:**

   ```prompt
   Pause. Explain this permission request in plain language: which files,
   commands, network destinations, and costs are involved? Offer the smallest
   local-only alternative. Do not proceed until I explicitly approve it.
   ```

## Verify and continue

In the portal's checklist, confirm only what you personally observed: a Copilot reply, three successful version checks, the correct local workspace, and a reviewed permissions boundary. These are learner-reported checks; the portal cannot inspect your computer or generated app.

**Summary:** you have an AI conversation, working tools, and an isolated place to learn.

**Official references:** [quickstart](https://docs.github.com/en/copilot/get-started/quickstart-copilot-app), [session modes and locations](https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions), [slash commands](https://docs.github.com/en/copilot/reference/github-copilot-app-reference/slash-commands), [Node.js downloads](https://nodejs.org/en/download), [Git installation](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [creating a GitHub account](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github), [Apple Command Line Tools](https://developer.apple.com/documentation/xcode/installing-the-command-line-tools/).

**Next:** [Lab 01: Make a small plan](lab-01-plan.md).
