# Spec Kit project

A project template for spec-driven development with [GitHub Spec Kit](https://github.com/github/spec-kit). The project
has one constitution. Each feature then goes through Spec Kit's steps: specify, clarify, plan, tasks, implement and
converge, with its documents in Documents and its work on the boards.

A project made from it is `standard` with an `evergreen` lifecycle: it keeps one constitution and adds features over
time, so it has no end date.

## What the project starts with

| Part | What you get |
|---|---|
| Boards | **Constitution**: decisions, questions and tasks. **Specs** (the default board): specs, stories, questions and decisions. **Plans**: research, decisions, questions and tasks. **Tasks**: tasks and releases |
| Notes | The notebooks Clarifications, Meeting notes and Status updates |
| Documents | The folders Constitution, Specs, Templates, Archive and Skills |
| Starter files | `OPERATING.md` in the Documents root; `Constitution/constitution.md`; the five Spec Kit templates and their license in Templates; the `spec-kit-project` skill as `Skills/spec-kit-project-SKILL.md` |
| Starter tasks | `Constitution: <project name>` on Constitution, and `Spec: first feature` on Specs |

Each feature gets its own folder, `Specs/<NNN-feature>/`, which the skill makes at the specify step. You can change the
boards, notebooks and folders after the project exists. The project type and lifecycle never change.

## Working with an AI agent

`OPERATING.md` maps each Spec Kit step to a board, an activity and a document, and tells your AI agent how to reach
the project through the ZeroBias MCP server. The `spec-kit-project` skill runs each step through the ZeroBias API; it
does not need the Spec Kit CLI. To use it, copy `Documents/Skills/spec-kit-project-SKILL.md` to
`.claude/skills/spec-kit-project/SKILL.md` in your working folder.

## Requirements

The boards use the Product Management activities (`pmSpec`, `pmStory`, `pmRelease`, `pmQuestion`, `pmDecision`,
`pmResearch`) and `task`, which the platform's workflow content provides on every environment.

## License

The Spec Kit templates are from Spec Kit release v1.4.2, unchanged, under the MIT license, Copyright GitHub, Inc. The
project gets `Templates/LICENSE-spec-kit.txt` next to them.
