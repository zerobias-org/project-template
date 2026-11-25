# OpenSpec project

Spec-driven development with [OpenSpec](https://github.com/Fission-AI/OpenSpec). The project keeps one living spec of the system. Each change is a proposal with delta specs, a design and tasks. When the change ships, its deltas merge into the living spec and the change moves to the archive.

A project made from it is `standard` with an `evergreen` lifecycle: the spec lives as long as the system.

## What the project starts with

| Part | What you get |
|---|---|
| Boards | **Changes** (the default board): `pmSpec`, `pmQuestion`, `pmDecision`, `pmResearch`. **Tasks**: `task`, `pmRelease`. |
| Notes | The notebooks Meeting notes and Status updates |
| Documents | The folders Specs, Changes, Archive, Templates and Skills |
| Starter files | `OPERATING.md` in the Documents root; the four OpenSpec templates and their license in `Templates`; `Skills/openspec-project-SKILL.md` (the `openspec-project` skill) |
| Starter tasks | `Baseline spec: <project name>`; `Propose the first change` |

Each capability gets its own folder, `Specs/<capability>/`, and each change its own folder, `Changes/<change-name>/`. A template cannot make these folders, so the skill makes them. The skill also does the archive step, which merges the delta specs into the living spec.

You can change the boards, notebooks and folders after the project exists. The project type and lifecycle never
change.

## Working with an AI agent

`OPERATING.md` tells your AI agent which template made the project, how the project is organized, and how to reach it
through the ZeroBias MCP server. The `openspec-project` skill lets the agent do the work through the ZeroBias API. To use it,
copy `Documents/Skills/openspec-project-SKILL.md` to `.claude/skills/openspec-project/SKILL.md` in your working folder.

## Requirements

The boards use the activities `pmDecision`, `pmQuestion`, `pmRelease`, `pmResearch`, `pmSpec`, `task`. The Product Management activities and `task`
are on every environment.

## License

The OpenSpec templates are from OpenSpec release v2.1.1 (`schemas/spec-driven/templates`), unchanged, under the MIT license,
Copyright (c) 2025 Fission AI Inc. The project gets `Templates/LICENSE-openspec.txt` next to them.
