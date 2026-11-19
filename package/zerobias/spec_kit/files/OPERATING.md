# Operating ${projectName}

This file is for the AI agent that helps you run this project. Give it this file, or tell your agent to download and read it.

| | |
|---|---|
| Project | ${projectName} |
| Project id | `${projectId}` |
| Made from template | Spec Kit project (`@zerobias-org/project-template-zerobias-spec_kit`) |
| Method | [GitHub Spec Kit](https://github.com/github/spec-kit) spec-driven development, templates from release v1.4.2 |
| Skill that operates it | `spec-kit-project`, in the Documents folder `Skills` as `spec-kit-project-SKILL.md` |

## How the project follows Spec Kit

Spec Kit has one constitution per project. Then each feature goes through the same steps: specify, clarify, plan, tasks, implement, converge.

| Spec Kit step | Board | Activity | Document |
|---|---|---|---|
| Constitution | Constitution | `task`, `pmDecision` | `Constitution/constitution.md` |
| Specify | Specs (the default board) | `pmSpec`, stories as `pmStory` | `Specs/<NNN-feature>/spec.md` |
| Clarify | Specs | `pmQuestion`, `pmDecision` | the Clarifications notebook |
| Plan | Plans | `task`, research as `pmResearch` | `Specs/<NNN-feature>/plan.md` |
| Tasks, implement | Tasks | `task` | `Specs/<NNN-feature>/tasks.md` |
| Release | Tasks | `pmRelease` | |

- **Notes notebooks:** Clarifications, Meeting notes, Status updates.
- **Documents folders:** Constitution, Specs (one folder per feature, for example `001-photo-albums`), Templates, Archive, Skills. This file is in the Documents root.
- **Templates:** the five Spec Kit templates (`spec-template.md`, `plan-template.md`, `tasks-template.md`, `checklist-template.md`, `constitution-template.md`) and their license, `LICENSE-spec-kit.txt` (MIT, GitHub, Inc.).
- **Starter tasks:** `Constitution: ${projectName}` on Constitution, and `Spec: first feature` on Specs.

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
2. Download `spec-kit-project-SKILL.md`.
3. Save it as `.claude/skills/spec-kit-project/SKILL.md` in your working folder.

The skill is a copy made when the project was created. A newer copy is at
https://github.com/zerobias-org/project-template/blob/main/package/zerobias/spec_kit/files/skills/spec-kit-project/SKILL.md

The skill keeps the Spec Kit documents in this project. It does not need the Spec Kit CLI. If your code repository also uses the Spec Kit CLI, the skill can copy a feature's `spec.md`, `plan.md` and `tasks.md` between the repository and the project.

## 3. Start

Ask your agent, for example:

- "Write the constitution for ${projectName}. Our principles are ..."
- "Specify a feature: ..."
- "Clarify the open questions in spec 001."
- "Make the plan for spec 001. We use ..."
- "Make the tasks for spec 001 and put them on the Tasks board."

The agent uses the project id above. It acts with your API key, so it can do only what your ZeroBias role allows.
