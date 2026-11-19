# Operating ${projectName}

This file is for the AI agent that helps you run this project. Give it this file, or tell your agent to download and read it.

| | |
|---|---|
| Project | ${projectName} |
| Project id | `${projectId}` |
| Made from template | OpenSpec project (`@zerobias-org/project-template-zerobias-openspec`) |
| Method | [OpenSpec](https://github.com/Fission-AI/OpenSpec), templates from release v2.1.1 |
| Skill that operates it | `openspec-project`, in the Documents folder `Skills` as `openspec-project-SKILL.md` |

## How the project follows OpenSpec

OpenSpec keeps one living spec of the system in `Specs/`. Each change goes through propose, apply and archive.

| OpenSpec step | Board | Activity | Document |
|---|---|---|---|
| Baseline spec | Changes (the default board) | `pmSpec` | `Specs/<capability>/spec.md` |
| Propose | Changes | `pmSpec`, one per change | `Changes/<change-name>/proposal.md`, `specs/<capability>/spec.md` (deltas), `design.md`, `tasks.md` |
| Questions and decisions | Changes | `pmQuestion`, `pmDecision`, research as `pmResearch` | |
| Apply | Tasks | `task`, one per `tasks.md` group or line | `Changes/<change-name>/tasks.md` |
| Archive | Changes | close the change task | the deltas merge into `Specs/`, the change folder moves to `Archive/<YYYY-MM-DD>-<change-name>/` |
| Release | Tasks | `pmRelease` | |

- **Notes notebooks:** Meeting notes, Status updates.
- **Documents folders:** Specs, Changes, Archive, Templates, Skills. This file is in the Documents root.
- **Templates:** the four OpenSpec templates (`proposal-template.md`, `spec-template.md`, `design-template.md`, `tasks-template.md`) and their license, `LICENSE-openspec.txt` (MIT, Fission AI Inc.).
- **Starter tasks:** `Baseline spec: ${projectName}` and `Propose the first change`.

People can change the boards, notebooks and folders after the project exists. Read the live project before you act. Do not trust this list.

## 1. Give your agent ZeroBias access

The skill uses the ZeroBias API through the ZeroBias MCP server.

1. Get an API key in ZeroBias: open your user menu and select **Manage My API Keys**.
2. Put the key in your shell profile, for example `~/.zshrc`:

   ```bash
   export ZB_TOKEN="<your API key>"
   ```

3. Add the ZeroBias package registry to `~/.npmrc`:

   ```ini
   @zerobias-com:registry=https://pkg.zerobias.org
   @zerobias-org:registry=https://pkg.zerobias.org
   //pkg.zerobias.org/:_authToken=${ZB_TOKEN}
   ```

4. Install the server and set it up:

   ```bash
   npm install -g @zerobias-com/zerobias-mcp
   zb setup        # URL, API key, org, profile name
   zb status       # check the connection
   ```

5. Register the server with Claude Code:

   ```bash
   claude mcp add -s user zerobias zb
   ```

The server runs on Linux, macOS, and Windows through WSL.

## 2. Install the skill

1. In this project's Documents, open the folder `Skills`.
2. Download `openspec-project-SKILL.md`.
3. Save it as `.claude/skills/openspec-project/SKILL.md` in your working folder.

The skill is a copy made when the project was created. A newer copy is at
https://github.com/zerobias-org/project-template/blob/main/package/zerobias/openspec/files/skills/openspec-project/SKILL.md

## 3. Start

Ask your agent, for example:

- "Write the baseline spec for ${projectName} from the current code in <repository>."
- "Propose a change: add CSV export."
- "Make the tasks for change add-csv-export and put them on the Tasks board."
- "Archive change add-csv-export."

The agent uses the project id above. It acts with your API key, so it can do only what your ZeroBias role allows.
