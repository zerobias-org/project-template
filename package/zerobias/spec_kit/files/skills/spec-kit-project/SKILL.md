---
name: spec-kit-project
description: Run GitHub Spec Kit spec-driven development in a ZeroBias project made from the Spec Kit project template — constitution, specify, clarify, plan, tasks, analyze, implement and converge, with documents in the project's Documents and work on its boards. Use when the user asks to write a constitution, specify, clarify, plan or break down a feature, or report progress in a Spec Kit project in ZeroBias.
---

# Run Spec Kit in a ZeroBias project

A Spec Kit project is a ZeroBias project made from the Spec Kit project template. It follows [GitHub Spec Kit](https://github.com/github/spec-kit) spec-driven development: one constitution for the project, then specify, clarify, plan, tasks, implement and converge for each feature.

The Spec Kit documents live in the project's Documents. The work lives on the project's boards. Use the ZeroBias MCP tools for every step: `zerobias_search`, `zerobias_describe` and `zerobias_execute`. This skill does not need the Spec Kit CLI.

## Before you start

1. Make sure the ZeroBias MCP tools are available. If they are not, tell the user to follow `OPERATING.md` in the project's Documents root. It says how to set up the ZeroBias MCP server. Then stop.
2. Get the project id. `OPERATING.md` contains it. Otherwise call `platform.Project.list` and match the project name.
3. Read the project: `platform.Project.get` with `projectId`.
4. Run `zerobias_describe` on an operation before its first use in a session. Parameter names change between versions.
5. Read `Constitution/constitution.md` before any step after the constitution. Every spec, plan and task list must agree with it.

## Where each step lives

| Step | Board | Activity | Document |
|---|---|---|---|
| Constitution | Constitution | `task`; a principle change as `pmDecision` | `Constitution/constitution.md` |
| Specify | Specs (default) | `pmSpec`, one per feature; user stories as `pmStory` subtasks | `Specs/<NNN-feature>/spec.md` |
| Clarify | Specs | `pmQuestion`, then `pmDecision` | `## Clarifications` in `spec.md`, and the Clarifications notebook |
| Plan | Plans | `task`; research as `pmResearch` | `Specs/<NNN-feature>/plan.md`, `research.md`, `data-model.md`, `quickstart.md`, `contracts/` |
| Tasks | Tasks | `task`, one per `tasks.md` line that a person or agent picks up | `Specs/<NNN-feature>/tasks.md` |
| Checklist | Specs | | `Specs/<NNN-feature>/checklists/<type>.md` |
| Release | Tasks | `pmRelease` | |

Read the live project. People change boards, notebooks and folders after the project is created.

The templates are in `Templates`: `spec-template.md`, `plan-template.md`, `tasks-template.md`, `checklist-template.md` and `constitution-template.md`. They come from github/spec-kit under the MIT license in `Templates/LICENSE-spec-kit.txt`. Keep that file with any copy of the templates.

## The steps

### Constitution

1. Read `Constitution/constitution.md`. At project create it is a copy of the constitution template.
2. Ask the user for the principles and the governance rules. Replace every `[PLACEHOLDER]`. Keep the template's sections.
3. Set the version and the ratification date in the file.
4. Upload the file. Comment on the `Constitution: <project name>` task. Close the task when the user agrees.
5. Later changes: create a `pmDecision` task on Constitution for each change. Increase the version in the file.

### Specify

1. Get the next feature number. List the folders in `Specs`. Use the next three-digit number: `001`, `002`, and so on.
2. Make the folder `Specs/<NNN>-<short-name>`. Use two to four lowercase words joined by `-`.
3. Make `spec.md` from `Templates/spec-template.md`. Describe what the users need and why. Do not describe how to build it.
4. Write user stories with priorities P1, P2, P3. Each story must be testable alone.
5. Mark an unclear point with `[NEEDS CLARIFICATION: <question>]`. Use three markers or fewer. Make an informed guess for the rest, and list it under Assumptions.
6. Create a `pmSpec` task on Specs named `Spec <NNN>: <feature name>`. Put the folder path in the description. Create a `pmStory` subtask for each user story.

### Clarify

1. Read `spec.md`. Find the gaps and the `[NEEDS CLARIFICATION]` markers.
2. Ask the user five questions or fewer, one at a time. Give a recommended answer with each.
3. After each answer, add it to `spec.md` under `## Clarifications`, `### Session YYYY-MM-DD`. Update the sections that the answer changes. Remove the marker.
4. Record each open question as a `pmQuestion` subtask of the spec task. Record each answer as a `pmDecision` subtask. Close the question.
5. Write a short note in the Clarifications notebook named `YYYY-MM-DD <NNN-feature>.md`.

### Plan

1. Read `spec.md` and the constitution. Do not start while a `[NEEDS CLARIFICATION]` marker is open, unless the user says so.
2. Make `plan.md` from `Templates/plan-template.md`. Fill in Technical Context from the user's stack and constraints.
3. Fill in the Constitution Check. If the plan breaks a principle, write the reason in Complexity Tracking, or change the plan.
4. Write `research.md` for each unknown. Create a `pmResearch` task on Plans for research that needs a person.
5. Write `data-model.md`, the files in `contracts/` and `quickstart.md` when the feature needs them.
6. Create a `task` on Plans named `Plan <NNN>: <feature name>`. Close it when the user agrees with the plan.

### Tasks

1. Read `plan.md`, `spec.md` and the other plan documents.
2. Make `tasks.md` from `Templates/tasks-template.md`. Use the template's phases: Setup, Foundational, one phase per user story in priority order, then Polish.
3. Write each line as `- [ ] T001 [P] [US1] <description with file path>`. `[P]` means it can run in parallel. `[US1]` names the user story.
4. Ask the user before you create board tasks. Then create one `task` on Tasks per line, or per phase if the user prefers. Put the task id (`T001`) at the start of the name. Make each one a subtask of a phase task when there are many.

### Analyze (optional)

Read `spec.md`, `plan.md` and `tasks.md` together. Find gaps, duplicates and conflicts with the constitution. Do not change files. Report the findings to the user. Add a comment to the spec task.

### Checklist (optional)

Make `Specs/<NNN-feature>/checklists/<type>.md` from `Templates/checklist-template.md`, for example `ux.md` or `security.md`. Each item checks the quality of the requirements, not the code.

### Implement and converge

Code is written in the user's repository, not in ZeroBias.
- When a `tasks.md` line is done, mark it `[X]` in `tasks.md`. Close its board task.
- To converge, compare the code with `spec.md`, `plan.md` and `tasks.md`. Add each missing piece of work as a new line in `tasks.md` and a new `task` on Tasks. When nothing is missing, tell the user that the feature has converged. Comment on the spec task.
- If the repository also uses the Spec Kit CLI, keep both copies the same. Copy `spec.md`, `plan.md` and `tasks.md` from the repository's `specs/<NNN-feature>/` into the project, or the other way, when the user asks.

### Release

Create a `pmRelease` task on Tasks for a release. List the features in its description. Close the feature's spec task when the feature ships.

### Status updates

1. Read the open tasks on each board.
2. Make a note in the `Status updates` notebook named `YYYY-MM-DD status.md`.
3. For each feature, give its step (specified, clarified, planned, tasks, implementing, converged) and the blocked items. Give task codes.

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
- Do one step at a time. Show the result to the user before the next step.
- Ask the user before you delete anything, close a task, or create many tasks.
- Never assign a person, or add an approver or a notified party, unless the user names that person.
- Use task codes and names when you report to the user.
- Never put an API key or a secret in a task, note or document.
