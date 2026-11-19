---
name: requirements-program
description: Run a requirements program in ZeroBias — write requirements, decide exceptions, measure projects against them. Use when the user asks to read, add or update work in a ZeroBias project made from the Requirements program template.
---

# Run a requirements program in ZeroBias

A Requirements program project is a ZeroBias project made from the Requirements program template. Use the ZeroBias MCP tools for every step: `zerobias_search`, `zerobias_describe` and `zerobias_execute`.

## Before you start

1. Make sure the ZeroBias MCP tools are available. If they are not, tell the user to follow `OPERATING.md` in the project's Documents root. It says how to set up the ZeroBias MCP server. Then stop.
2. Get the project id. `OPERATING.md` contains it. Otherwise call `platform.Project.list` and match the project name.
3. Read the project: `platform.Project.get` with `projectId`.
4. Run `zerobias_describe` on an operation before its first use in a session. Parameter names change between versions.

## What the project contains

Read the live project. People change boards, notebooks and folders after the project is created.

| Part | Template default | Use |
|---|---|---|
| Requirements board (default) | `pmSpec`, `pmQuestion`, `task` | One `pmSpec` per requirement, as a subtask of the baseline task |
| Decisions & Questions board | `pmQuestion`, `pmDecision`, `pmResearch`, `task` | Charter, new requirement versions, exceptions, research |
| Conformance board | `task`, `pmQuestion` | One `task` per measured project |
| Notes notebooks | Program meetings, Status updates | Meeting notes and status updates |
| Documents folders | Requirements, Guidance, Conformance Reports, Exceptions, Archive, Skills | `Requirements/requirements.md` is the register. `Skills` holds this skill |

## The work

### Charter

1. Ask the user for the area, the owner of the requirements, and the projects in scope.
2. Write the charter at the top of `Requirements/requirements.md`.
3. Comment on the `Charter: <program name>` task. Close it when the user agrees.

### Requirements

1. Read `Requirements/requirements.md`. Give each new requirement the next id: `REQ-001`, `REQ-002`, and so on. Never reuse or change an id.
2. Write each requirement as one testable statement with SHALL. Add the rationale, the source, what it applies to, and how to measure it.
3. Create a `pmSpec` subtask of the `Requirements baseline: <program name>` task for each requirement. Name it `REQ-<nnn>: <short name>`.
4. To change a requirement, create a `pmDecision` task on Decisions & Questions. After the decision, update the register. Increase the requirement's version and add the date. Do not delete a requirement. Mark it retired.

### Conformance

1. Create one `task` on Conformance for each measured project. Name it `Conformance: <project name>`. Link the measured project in the description.
2. Read the measured project: `platform.Project.get`, its boards and its Documents. Ask its owner when the evidence is not in ZeroBias.
3. Make `Conformance Reports/<project>-<YYYY-MM-DD>.md` from `Conformance Reports/conformance-report-template.md`. For each requirement, record met, partly met, not met or not applicable, with the evidence.
4. Comment on the conformance task with the result counts. Create a `pmQuestion` for each unclear result.

### Exceptions

1. An exception is a `pmDecision` on Decisions & Questions. Name it `Exception: <project> <REQ-id>`. Put the reason, the compensating control and the end date in the description.
2. Write `Exceptions/<project>-<REQ-id>.md` with the same content.
3. In the next conformance report, mark the requirement as an exception until the end date.

### Program meetings and status updates

- Meeting notes go in the `Program meetings` notebook as `YYYY-MM-DD <meeting name>.md`. Create a `pmDecision` for each decision and a `pmQuestion` for each open question.
- A status update goes in the `Status updates` notebook as `YYYY-MM-DD status.md`. Give the requirement count, the conformance results per project, the open exceptions and their end dates.

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
