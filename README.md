# zerobias-org/{REPO_NAME}

Zerobias {ARTIFACT_TYPE} artifacts.

## Setup

```bash
# 1. Create repo from this template on GitHub
# 2. Clone it
git clone git@github.com:zerobias-org/{REPO_NAME}.git
cd {REPO_NAME}

# 3. Global find-and-replace these placeholders:
#    {REPO_NAME}       → your repo name (e.g., benchmark)
#    {ARTIFACT_TYPE}   → your artifact type (e.g., benchmark)
#
# Files to update:
#    package.json              → name, description, repository, homepage, bugs
#    .github/workflows/*.yml   → github.repository checks
#    scripts/validate.ts       → ARTIFACT_TYPE constant
#    templates/package.json    → name pattern, import-artifact, package pattern
#
# 4. Install dependencies
npm install

# 5. Verify setup
npm run validate
```

## Creating New Packages

```bash
# 3-level structure (vendor/suite/version)
./scripts/createNew.sh <vendor> <suite> <version>

# Example:
./scripts/createNew.sh nist 800-53 v5
# Creates: package/nist/800-53/v5/
```

Then fill in the placeholders in the generated `index.yml` and `package.json`.

## Package Structure

```
package/{vendor}/{suite}/{version}/
├── index.yml          # Artifact metadata
├── package.json       # NPM package config
├── .npmrc             # Registry config
├── elements/          # Content elements (if applicable)
└── baselines/         # Baselines (if applicable)
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run validate` | Validate all packages |
| `npm run clean` | Reset Nx cache |
| `npm run clean:full` | Reset Nx cache + remove node_modules |
| `npm run reset` | Full clean + reinstall |
| `npm run lerna:dry-run` | Preview version bumps |
| `npm run lerna:version` | Apply version bumps |

## Package Naming

- **NPM package**: `@zerobias-org/{ARTIFACT_TYPE}-{vendor}-{suite}-{version}` (dashes)
- **Metadata code**: `{vendor}_{suite}_{version}` (underscores)
- **Metadata package**: `{vendor}.{suite}.{version}.{ARTIFACT_TYPE}` (dots)

## CI/CD

- **PRs** target `dev` branch → validated by `pull-request-target.yml`
- **Merges to dev/qa** → published by `publish-pull-request.yml`
- **Merges to main** → published by `publish.yml`
