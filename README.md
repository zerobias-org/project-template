# ZeroBias Project Templates

Public **project template** content artifacts under `@zerobias-org`.

## What a project template is

A user creates a project from a template in the Projects App. The new project
starts with what the template defines:

- the project type and lifecycle
- the boards, and the activities each board allows
- the Notes notebooks
- the Documents folders, and starter files in them
- the starter tasks
- the name of an agent skill that operates projects made from it

The user names the project. Everything else comes from the template, and the
user can change it after the project exists (except the type and lifecycle,
which never change).

## Status

**In development** (ZeroBias task: backendFeat-187, "Project templates: choose a
template when a project is created"). Templates load only after the hydra and
platform releases for this feature are on an environment. Until then the gate
stops at the data loader with
`No catalog.artifact_type found for import-artifact: project_template`.

The feature spans four repos that merge in order: hydra, platform, this repo,
then the UI. See the merge order in
[PR 1](https://github.com/zerobias-org/project-template/pull/1).

## How a template gets to users

```
package/<vendor>/<name>/*.yml
    │  merge to main → the publish workflow releases the npm package
    ▼
platform data loader           import-artifact: project_template
    │  writes the template, and one version of it per package version, to the catalog;
    │  stores the starter files and the README in the shared catalog, and links the README as the version's documentation
    ▼
Create Project dialog          the user picks the template
    ▼
new project                    linked is_instance_of → the template version
```

## Repo layout

```
package/
└── zerobias/
    └── product_management/          # one package per template group: package/<vendor>/<name>/
        ├── package.json             #   @zerobias-org/project-template-zerobias-product_management
        │                            #   zerobias.package = zerobias.product_management.project_template
        │                            #   zerobias.import-artifact = project_template
        ├── .npmrc                   #   byte-identical copy of the repo-root .npmrc
        ├── build.gradle.kts         #   plugins { id("zb.content") }
        ├── product_management.yml   #   one template per *.yml file in the package folder
        ├── README.md                #   documents the templates (zerobias.documentation)
        └── files/                   #   starter files (zerobias.catalog-files); product_management.yml names each in documents.files
            ├── OPERATING.md         #     goes to the Documents root
            └── skills/product-management-project/SKILL.md   # the product-management-project skill; goes to Documents/Skills
templates/starter/                   # the starter package; never published (see "Add a template")
scripts/new-template.sh              # copies the starter into package/<vendor>/<name>/
bundle/                              # @zerobias-org/project-template-bundle (workflow-managed)
```

- Every `*.yml` file directly in a package folder is one template. The loader
  ignores subfolders and dotfiles.
- The package must sit at least two levels under `package/`. The publish
  workflow skips the folder literally named `package`.

## Templates

| Package | Template | Source |
|---|---|---|
| `zerobias/product_management` | Product Management project | the product management recipe: a `product`, four boards (Specs & Stories, Decisions & Questions, Mockups, Risks & Dependencies), three notebooks, seven Documents folders, `OPERATING.md` in the Documents root, the `product-management-project` skill in the Skills folder, a starter spec task |
| `zerobias/spec_kit` | Spec Kit project | [GitHub Spec Kit](https://github.com/github/spec-kit) v1.4.2 (MIT): a `standard` evergreen project, boards Constitution, Specs (default), Plans, Tasks, three notebooks, five Documents folders, the five Spec Kit templates with their MIT license, `OPERATING.md`, the `spec-kit-project` skill, and two starter tasks |
| `zerobias/requirements_program` | Requirements program | a `program` (evergreen, shows in the Programs App) that defines the requirements for one area and measures projects against them: boards Requirements (default), Decisions & Questions, Conformance, two notebooks, six Documents folders, a requirement register and a conformance report template, `OPERATING.md`, the `requirements-program` skill, and three starter tasks |

The Product Management template uses the Product Management activities (`pmSpec`, `pmStory`,
`pmRelease`, `pmQuestion`, `pmDecision`, `pmResearch`). The platform's workflow
content (`zerobias.zerobias.platform.workflow`) provides them on every
environment. A load fails on an environment that lacks an activity a template
names.

## Field reference

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | The template's stable UUID, lowercase. Unique across the repo. Never changes after release |
| `name` | yes | Display name in the Create Project dialog |
| `description` | yes | What the template is for |
| `imageUrl` | no | Image for the template. Defaults to the resource type's icon |
| `keywords` | no | List of strings. Catalog search matches them |
| `projectType` | yes | The project type. See the type and lifecycle pairs below |
| `lifecycle` | yes | `fixed-term` or `evergreen` |
| `boards` | yes | List of boards. At least one |
| `boards[].key` | yes | Local name for the board, unique in the file. Tasks use it |
| `boards[].name` | yes | Board name |
| `boards[].isDefault` | one board | `true` on exactly one board. The project's default board gets this board's name |
| `boards[].activities` | yes | List of activity codes that the board allows |
| `notes.notebooks` | no | List of Notes notebooks |
| `notes.notebooks[].name` | yes | Notebook name |
| `documents.folders` | no | List of Documents folder names |
| `documents.files` | no | List of starter files. The project gets a copy of each in its folder |
| `documents.files[].folder` | no | A name from `documents.folders`. Leave it out (or `''`) for the Documents root |
| `documents.files[].name` | yes | File name in the project. Unique in its folder |
| `documents.files[].path` | yes | Path of the file in the package. `zerobias.catalog-files` must match it. In a text file, `${projectName}` and `${projectId}` are filled in; any other `${...}` stays as written |
| `skill` | no | The agent skill that operates projects made from this template. The Create Project dialog shows it. The platform does not install it |
| `skill.name` | yes | The `name` in the skill's `SKILL.md` front matter |
| `skill.description` | no | One line: what the skill does |
| `skill.url` | no | Link to the skill's `SKILL.md` in this repo on `main` |
| `skill.install` | no | One line that tells the user how to install the skill from the project |
| `documentation` | no | Path of the file that documents this template, relative to the yml. It takes the place of the package's `zerobias.documentation` |
| `tasks` | no | List of starter tasks |
| `tasks[].board` | yes | The `key` of the task's board |
| `tasks[].name` | yes | Task name. `${projectName}` and `${projectId}` are allowed |
| `tasks[].activity` | yes | Activity code. Must be one of its board's activities |
| `tasks[].description` | no | Task description. `${projectName}` and `${projectId}` are allowed |

### Type and lifecycle pairs

From `zerobias-com/platform` `api/src/api/schemas/project/newProject.yml`:

| `projectType` | `fixed-term` | `evergreen` | Notes |
|---|:---:|:---:|---|
| `standard` | yes | yes | |
| `program` | no | yes | |
| `coordination_program` | no | yes | |
| `product` | no | yes | can have a `product` parent |
| `portfolio` | no | yes | |
| `phase` | yes | no | needs a `coordination_program` or `product` ancestor |
| `assessment` | yes | no | |
| `engagement`, `rfp`, `pilot` | yes | yes | |

## Rules

1. Give each new template a new lowercase UUID as `id`. Never copy an `id`. Never change the `id` of a released template.
2. `projectType` and `lifecycle` must be a valid pair (table above). They cannot change after a project exists.
3. Exactly one board has `isDefault: true`.
4. Board keys are unique in the file. Each task's `board` is one of those keys.
5. Activities are codes, never ids. Each code must be loaded on the target environment, or the load fails. A private template can also use activity codes that its own org owns.
6. Each task's `activity` is one of the activities of its board.
7. The only placeholders are `${projectName}` and `${projectId}`. Quote a yml value that contains one.
8. No secrets in a template or a starter file.
9. Each `documents.files[].path` is a file in the package that `zerobias.catalog-files` matches, and each `folder` is left out or in `documents.folders`. No two files share a folder and name.
10. Run `zbb validateContent` before each push.

## Starter files and the skill

A template can create files in the new project's Documents folders. Put each
file under `files/` in the package, and list it in `documents.files`. In
`package.json`, `files` must include `files/**`, or the file is not published,
and `zerobias.catalog-files` must include `files/**`, or the loader refuses the
template. The loader stores each file in the shared catalog; the template
version keeps only its path. At create, the platform copies the file into the
project, filling in `${projectName}` and `${projectId}` in a text file. Any file
type works; only text files get the placeholders filled in.

A template can name an agent skill in `skill`. The skill lets the customer's
AI agent operate a project made from the template through the ZeroBias API.
The skill ships as a starter file. Write it in
`files/skills/<name>/SKILL.md` in the package. Add a `Skills` folder to
`documents.folders`, and list the skill in `documents.files` with folder
`Skills` and name `<name>-SKILL.md`. Keep one copy of each skill. The user
copies the file to `.claude/skills/<name>/SKILL.md`. The project keeps the copy
made at create, so a later template version does not change it.
Give each template with a skill a starter file such as `OPERATING.md` that
names the template and the skill, and says how to install the skill and how to
get ZeroBias MCP or API access.

## Documentation

Each package has a `README.md` that documents its templates, and
`"documentation": "README.md"` in the `zerobias` section of `package.json`.
The loader stores the README in the shared catalog and links each template
version it writes to it (`documented_by`), as pipeline templates are
documented. The catalog serves it as the version's `documentation`, and the UI
opens it from the template. A template can name its own file with
`documentation:` in its yml.

## Public and private templates

No `orgId` in `package.json` means the templates are public. With `orgId`, they
are private to that org. A private package keeps its files out of the shared
catalog, so its projects get no starter files and its versions no
documentation.

## Versions and changes

- To change a template, edit its yml, bump the package version, and merge. The
  loader writes a new version of the template.
- A new version does not change projects that already exist. A project keeps
  what it was created with.
- To retire one template, delete its yml. The next load removes it.
- A package must keep at least one template yml. A package with no `*.yml` at
  its root fails the load, and the load does not delete its templates. To
  retire the last template, use `"deprecated": true` instead.
- To retire every template in a package, set `"deprecated": true` in the
  `zerobias` section of `package.json`.

## Add a template

```bash
sh scripts/new-template.sh <vendor> <name>      # e.g. sh scripts/new-template.sh zerobias security_review
```

The script copies `templates/starter/` to `package/<vendor>/<name>/`, sets the
npm name and `zerobias.package` from the arguments, names the yml `<name>.yml`,
and writes a new UUID into its `id`. Then:

1. Replace every `REPLACE-…` value in the yml. Each line has a comment that
   says what the field does and which values are valid.
2. Run `unset ZB_SLOT`, then `zbb :<vendor>:<name>:validateContent`.
3. Commit, and open the PR as a draft.

To add a second template to an existing package, copy
`templates/starter/starter.yml` into the package folder and give it a new id.

## Build and validate

Use [`zbb`](https://github.com/zerobias-org/util/tree/main/packages/zbb) for
every build command. Do not run `./gradlew` directly: zbb selects Java 21, and
Gradle 8.10.2 fails on Java 25.

```bash
npm i -g @zerobias-org/zbb@latest @zerobias-com/platform-dataloader@latest

unset ZB_SLOT                            # a content repo has no slot or stack
zbb :<vendor>:<name>:validateContent     # file shape only, e.g. :zerobias:product_management:validateContent
zbb :<vendor>:<name>:gate                # full gate (writes gate-stamp.json)
zbb validateUniqueIds                    # no two templates share an id
```

The repo validator checks the package identity (folder, npm name and
`zerobias.package` agree), `import-artifact`, that at least one template yml
is in the package folder, and unique ids. The gate's data loader step checks
the rest. It uses `ZB_TOKEN`. If `ZB_TOKEN` is empty, that step is skipped and
the gate still writes a stamp, so check that `testDataloader` is `"passed"` in
`gate-stamp.json`. Commit the stamp with the package.

The `zb.*` gradle plugins need a GitHub token with `read:packages`:

```bash
gh auth refresh -s read:packages && export GITHUB_TOKEN=$(gh auth token)
```

## Publishing

`.github/workflows/publish.yml` runs
`zerobias-org/devops/.github/workflows/zbb-publish-reusable.yml@main` on push to
`main`, `qa`, `dev` and `uat`. Do not `npm publish` by hand.

## Commits and PRs

[Conventional Commits](https://www.conventionalcommits.org/), commitlint-enforced.
Scope: `project-template-<vendor>-<name>`. Open PRs as drafts. Put the line
`ZeroBias task: <code>` in the PR body.
