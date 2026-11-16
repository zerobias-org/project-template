# AGENTS.md

Instructions for an agent that adds or changes a project template in this repo.
Read [`README.md`](README.md) first. It defines the fields and the package layout.

## Rules

- One template is one `*.yml` at the root of a package: `package/<owner>/<name>/<template>.yml`.
- A package can hold more than one template. Each template has its own `id`.
- Make a new `id` with `uuidgen`. Never copy an `id` from another template.
- Name each activity by its code. Never put an activity id in a template.
- Use `${projectName}` only. No other placeholder exists.
- Give exactly one board `isDefault: true`.
- Each task names a board by its `key`. The key must exist in `boards`.
- Do not set `orgId` in `package.json` for a public template.
- Do not add `deprecated.yml`. To retire a template, delete its yml.
- Use `zbb` for every build command. Never run `./gradlew`. Gradle fails on Java 25, and zbb selects Java 21.

## Add a template

1. Choose the package. Use an existing package, or make `package/<owner>/<name>/`.
2. For a new package, copy `package/zerobias/pmo/package.json`, `.npmrc` and `build.gradle.kts`.
3. In the new `package.json`, set `name` to `@zerobias-org/project-template-<owner>-<name>`.
4. Set `zerobias.package` to `<owner>.<name>.project_template`.
5. Write the template yml at the package root. Use the fields in `README.md`.
6. Run `unset ZB_SLOT`, then `zbb :<owner>:<name>:gate` from the repo root.
7. Fix each failure. Run the gate again until it passes.
8. Open `gate-stamp.json`. Make sure that `testDataloader` is `"passed"`.
9. Commit `gate-stamp.json` with the package.

## Change a template

1. Keep the `id`. The platform links each created project to the template version.
2. Edit the yml.
3. Run the gate on the package.
4. Commit the yml and the new `gate-stamp.json` together.

## Commits

- Use Conventional Commits. Scope: `project-template-<owner>-<name>`.
- Example: `feat(project-template-zerobias-pmo): add the PMO template`.

## Build token

Every `zbb` command needs a GitHub token with `read:packages`.

```bash
gh auth refresh -s read:packages && export GITHUB_TOKEN=$(gh auth token)
```

A 401 from `maven.pkg.github.com` or `Plugin [id: 'zb.workspace'] was not found` means the scope is missing.
Run the command above and retry. Do not skip the gate.
