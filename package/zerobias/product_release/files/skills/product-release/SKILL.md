---
name: product-release
description: Run one product release in ZeroBias — release scope, stories, test results, release notes and launch. Use when the user asks to read, add or update work in a ZeroBias project made from the Product release template.
---

# Run one product release in ZeroBias

A Product release project is a ZeroBias project made from the Product release template. Use the ZeroBias MCP tools for every step: `zerobias_search`, `zerobias_describe` and `zerobias_execute`.

## Before you start

1. Make sure the ZeroBias MCP tools are available. If they are not, tell the user to follow `OPERATING.md` in the project's Documents root. It says how to set up the ZeroBias MCP server. Then stop.
2. Get the project id. `OPERATING.md` contains it. Otherwise call `platform.Project.list` and match the project name.
3. Read the project: `platform.Project.get` with `projectId`.
4. Run `zerobias_describe` on an operation before its first use in a session. Parameter names change between versions.

## What the project contains

Read the live project. People change boards, notebooks and folders after the project is created.

| Part | Template default | Use |
|---|---|---|
| Release board (default) | `pmRelease`, `pmStory`, `task` | The release task, its stories as subtasks, and build and test work |
| Launch board | `task` | Launch work |
| Decisions & Questions board | `pmQuestion`, `pmDecision`, `task` | Scope questions and decisions |
| Notes notebooks | Release meetings, Status updates | Meeting notes and status updates |
| Documents folders | Release Notes, Test Results, Launch, Archive, Skills | `Release Notes/CHANGELOG.md` is the release notes. `Skills` holds this skill |

## The work

The release project is a `phase` under the product's project. Read the parent with `platform.Project.get` (`parentId`). The product's specs and backlog stay in the product's project.

### Scope

1. Read the product project's boards. Ask the user which stories go in the release.
2. Create a `pmStory` subtask of `Release: <project name>` for each story. Put the product task's code in the description. Do not move or close the product's own tasks.
3. Record each scope question as a `pmQuestion` and each answer as a `pmDecision` on Decisions & Questions.
4. When the user agrees the scope, close `Freeze the release scope`. After that, ask the user before you add a story.

### Build and test

1. Create a `task` on Release for each piece of build, test or fix work the user names.
2. Put test results in `Test Results/`, one file per test run, named with the date.

### Release notes

1. Read the closed stories of the release.
2. Write `Release Notes/CHANGELOG.md` in the Keep a Changelog format: a `## [<version>] - <YYYY-MM-DD>` section with `### Added`, `### Changed`, `### Deprecated`, `### Removed`, `### Fixed` and `### Security`. Leave out the empty headings.
3. Close `Write the release notes` when the user agrees.

### Launch

1. Create a `task` on Launch for each launch step the user names, for example announcement, documentation and support briefing.
2. For `Launch review`, check: every story is closed or moved out, the test results are in place, the release notes are agreed, and every launch task is closed. Report what is missing.
3. Close the `Release: <project name>` task when the release ships.

### Meetings and status updates

- Release meetings go in the `Release meetings` notebook as `YYYY-MM-DD <meeting name>.md`.
- A status update goes in the `Status updates` notebook as `YYYY-MM-DD status.md`. Give stories done and open, blocked items and the launch date.

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
