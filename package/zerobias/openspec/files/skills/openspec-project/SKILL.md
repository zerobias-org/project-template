---
name: openspec-project
description: Run OpenSpec in ZeroBias — living specs, change proposals, delta specs, tasks and archive. Use when the user asks to read, add or update work in a ZeroBias project made from the OpenSpec project template.
---

# Run OpenSpec in ZeroBias

A OpenSpec project project is a ZeroBias project made from the OpenSpec project template. Use the ZeroBias MCP tools for every step: `zerobias_search`, `zerobias_describe` and `zerobias_execute`.

## Before you start

1. Make sure the ZeroBias MCP tools are available. If they are not, tell the user to follow `OPERATING.md` in the project's Documents root. It says how to set up the ZeroBias MCP server. Then stop.
2. Get the project id. `OPERATING.md` contains it. Otherwise call `platform.Project.list` and match the project name.
3. Read the project: `platform.Project.get` with `projectId`.
4. Run `zerobias_describe` on an operation before its first use in a session. Parameter names change between versions.

## What the project contains

Read the live project. People change boards, notebooks and folders after the project is created.

| Part | Template default | Use |
|---|---|---|
| Changes board (default) | `pmSpec`, `pmQuestion`, `pmDecision`, `pmResearch` | One `pmSpec` per change, plus the baseline spec task |
| Tasks board | `task`, `pmRelease` | The work of each change, and releases |
| Notes notebooks | Meeting notes, Status updates | Meeting notes and status updates |
| Documents folders | Specs, Changes, Archive, Templates, Skills | `Specs/` is the living spec. `Changes/` holds open changes. `Archive/` holds finished ones. `Skills` holds this skill |

## The steps

The templates are in `Templates`: `proposal-template.md`, `spec-template.md`, `design-template.md` and `tasks-template.md`. They come from Fission-AI/OpenSpec under the MIT license in `Templates/LICENSE-openspec.txt`. Keep that file with any copy of the templates.

### Baseline spec

1. Ask the user which capabilities the system has. Name each one in kebab-case, for example `user-auth`.
2. For each capability, write `Specs/<capability>/spec.md`. Start with `## Purpose`, then `## Requirements`.
3. Write each requirement as `### Requirement: <name>` with SHALL or MUST. Give it at least one `#### Scenario: <name>` with WHEN and THEN lines. Use exactly four `#` for a scenario.
4. Comment on `Baseline spec: <project name>`. Close it when the user agrees.

### Propose

1. Name the change in kebab-case with a verb, for example `add-csv-export`.
2. Make the folder `Changes/<change-name>/`.
3. Make `proposal.md` from the proposal template: Why, What Changes, Capabilities (new and modified) and Impact. Read the matching specs in `Specs/` first. Reuse an existing capability name.
4. For each capability in the proposal, make `Changes/<change-name>/specs/<capability>/spec.md`. Use `## ADDED Requirements`, `## MODIFIED Requirements`, `## REMOVED Requirements` or `## RENAMED Requirements`. A MODIFIED requirement holds the full new text. A REMOVED requirement gives a Reason and a Migration.
5. Make `design.md` when the change needs design decisions.
6. Make `tasks.md`: numbered groups, and one checkbox per task, `- [ ] 1.1 <task>`. Each task says how to check it.
7. Create a `pmSpec` task on Changes named `Change: <change-name>`. Put the folder path in the description. Record open questions as `pmQuestion` subtasks and answers as `pmDecision` subtasks.

### Apply

1. Ask the user before you create board tasks. Then create one `task` on Tasks per group or per line of `tasks.md`. Put the task number at the start of the name.
2. When a task is done, mark it `[x]` in `tasks.md` and close its board task.

### Archive

1. Check that every line in `tasks.md` is done. Ask the user before you archive.
2. Merge each delta into `Specs/<capability>/spec.md`: add the ADDED requirements, replace the MODIFIED ones, delete the REMOVED ones, and rename the RENAMED ones.
3. Move the change folder to `Archive/<YYYY-MM-DD>-<change-name>/`. Make the new folder, copy each file, then delete the old files and folder.
4. Comment on the change task with the specs that changed. Close it.

### Status updates

1. Read the open tasks on each board.
2. Make a note in the `Status updates` notebook named `YYYY-MM-DD status.md`.
3. For each open change, give its step (proposed, applying, ready to archive) and the blocked items. Give task codes.

## ZeroBias API

### Boards and tasks

- **List the boards:** `platform.Board.list` with `projectId`.
- **List the tasks on a board:** `platform.Board.listTasks` with `boardId`. This call does not return subtasks. Use `platform.Task.listSubtasks` with the parent task `id`.
- **Find the activity id:** `platform.Board.listActivities` with `boardId`. A task needs the activity `id`, not the code. Use only an activity that the board allows.
- **Create a task:** `platform.Task.create`.
  - Set `boardId`, `activityId`, `name` and `description`.
  - Set `approvers`, `notified` and `links`. They are required. Use `[]` when there are none.
  - Set `priority`: 100 Low, 200 Normal, 500 High. If you omit it, the task gets Critical.
  - For a subtask, set `parentId`. A subtask uses its parent's board. You cannot change the parent later.
- **Change status:** call `platform.Task.get` and read `nextTransitions`. Then call `platform.Task.update` with `id` and `updateTask: { transitionId }`. Some status changes need two transitions. If no transition goes to the status, tell the user.
- **Add a comment:** `platform.Task.addComment`.
- **Move a task to another board:** `platform.Task.moveToBoard`. The target board must allow the task's activity.

### Notes and Documents

Each project has one root folder named `Project-<projectId>` in the ZeroBias file service. It has two folders: `NOTES` and `DOCUMENTS`. Each notebook is a folder in `NOTES`, and each note is a `.md` file in it. The Documents folders are in `DOCUMENTS`.

- **Find the root folder:** `hydra.Resource.resourceSearch`. Search for type `folder` with the condition `remoteTarget` equal to the project id. Pick the result named `Project-<projectId>`.
- **List a folder:** `fileservice.Folder.listChildren` with the folder `id`.
- **Read a file:** `fileservice.File.download` with the file `id`.
- **Write a file:** call `fileservice.File.create` with `name` and `folderId`. Then call `fileservice.File.upload` with the new file `id` and the content. Use the content type `text/markdown` for `.md` files.
- **Change a file:** upload new content to the same file `id`. The file service keeps the old version.
- **Make a folder:** `fileservice.Folder.create` with `name` and `folderId` (the parent).

## Rules

- Read before you write. Make sure the board, notebook or folder exists before you add to it.
- Ask the user before you delete anything, close a task, or create many tasks.
- Never assign a person, or add an approver or a notified party, unless the user names that person.
- Use task codes and names when you report to the user.
- Never put an API key or a secret in a task, note or document.
