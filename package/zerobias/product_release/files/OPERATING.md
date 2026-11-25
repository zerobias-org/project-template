# Operating ${projectName}

This file is for the AI agent that helps you run this project. Give it this file, or tell your agent to download and read it.

| | |
|---|---|
| Project | ${projectName} |
| Project id | `${projectId}` |
| Made from template | Product release (`@zerobias-org/project-template-zerobias-product_release`) |
| Skill that operates it | `product-release`, in the Documents folder `Skills` as `product-release-SKILL.md` |

## How the release works

| Work | Board | Activity | Document |
|---|---|---|---|
| The release itself | Release (the default board) | `pmRelease` | |
| A story in the release | Release | `pmStory`, a subtask of the release task | |
| Build, test and fix work | Release | `task` | `Test Results/` |
| Launch work | Launch | `task` | `Launch/` |
| Questions and decisions | Decisions & Questions | `pmQuestion`, `pmDecision` | |
| Release notes | Release | `task` | `Release Notes/CHANGELOG.md` |

- **Parent project:** this release is a `phase` under its product's project. The product's specs and backlog stay there.
- **Notes notebooks:** Release meetings, Status updates.
- **Documents folders:** Release Notes, Test Results, Launch, Archive, Skills. This file is in the Documents root.
- **Starter files:** `Release Notes/CHANGELOG.md`.
- **Starter tasks:** `Release: ${projectName}`, `Freeze the release scope`, `Write the release notes`, `Launch review`.

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
2. Download `product-release-SKILL.md`.
3. Save it as `.claude/skills/product-release/SKILL.md` in your working folder.

The skill is a copy made when the project was created. A newer copy is at
https://github.com/zerobias-org/project-template/blob/main/package/zerobias/product_release/files/skills/product-release/SKILL.md

## 3. Start

Ask your agent, for example:

- "Pull the stories for ${projectName} from the product project and add them to the release."
- "What is still open before the scope freeze?"
- "Write the release notes from the closed stories."
- "Run the launch review checklist."

The agent uses the project id above. It acts with your API key, so it can do only what your ZeroBias role allows.
