# Operating ${projectName}

This file is for the AI agent that helps you run this project. Give it this file, or tell your agent to download and read it.

| | |
|---|---|
| Project | ${projectName} |
| Project id | `${projectId}` |
| Made from template | Requirements program (`@zerobias-org/project-template-zerobias-requirements_program`) |
| Skill that operates it | `requirements-program`, in the Documents folder `Skills` as `requirements-program-SKILL.md` |

## How the program works

| Work | Board | Activity | Document |
|---|---|---|---|
| A requirement or a set of requirements | Requirements (the default board) | `pmSpec`, one per requirement, under the baseline task | `Requirements/requirements.md` |
| An open question about a requirement | Requirements, or Decisions & Questions | `pmQuestion` | |
| A decision, such as a new requirement version or an exception | Decisions & Questions | `pmDecision` | `Exceptions/<project>-<REQ-id>.md` for an exception |
| Research for a requirement | Decisions & Questions | `pmResearch` | `Guidance/` |
| Measuring one project | Conformance | `task`, one per measured project | `Conformance Reports/<project>-<YYYY-MM-DD>.md` |

- **Notes notebooks:** Program meetings, Status updates.
- **Documents folders:** Requirements, Guidance, Conformance Reports, Exceptions, Archive, Skills. This file is in the Documents root.
- **Starter files:** `Requirements/requirements.md` (the requirement register), `Conformance Reports/conformance-report-template.md`.
- **Starter tasks:** `Charter: ${projectName}`, `Requirements baseline: ${projectName}`, `Choose the first projects to measure`.

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
2. Download `requirements-program-SKILL.md`.
3. Save it as `.claude/skills/requirements-program/SKILL.md` in your working folder.

The skill is a copy made when the project was created. A newer copy is at
https://github.com/zerobias-org/project-template/blob/main/package/zerobias/requirements_program/files/skills/requirements-program/SKILL.md

## 3. Start

Ask your agent, for example:

- "Write the charter for ${projectName}. The area is ..."
- "Add a requirement: every service SHALL ..."
- "Measure project <name> against the requirements and write the conformance report."
- "Record an exception for project <name> on REQ-003 until <date>."

The agent uses the project id above. It acts with your API key, so it can do only what your ZeroBias role allows.
