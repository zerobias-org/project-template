# Create Artifact Skill

Create content packages from ZeroBias tasks with automatic dependency resolution and proper task management.

## Trigger

```
/create-artifact [task-id]
```

**Arguments:**
- `task-id` (optional): ZeroBias task UUID or task name. If not provided, will prompt for input.

## Examples

```
/create-artifact bbd73958-f3f6-4ec7-a2ed-79cb105c9c19
/create-artifact AIUC-1
/create-artifact
```

---

## Workflow

### Step 1: Get Task Details

| Input | Method | Notes |
|-------|--------|-------|
| **UUID** | `platform.Task.get({ id: uuid })` | Direct lookup, fastest |
| **Task name** | `portal.Task.search({ searchTaskBody: { search: "name" }})` | Searches name & description |

```javascript
// If UUID provided (contains dashes, 36 chars)
if (input.match(/^[0-9a-f-]{36}$/i)) {
  const task = zerobias_execute("platform.Task.get", { id: input })
}
// If task name provided (search)
else {
  const results = zerobias_execute("portal.Task.search", {
    searchTaskBody: { search: input }
  })
  const task = results.items.find(t => t.name === input) || results.items[0]
}
```

### Step 2: Extract Task Information

| Field | Source | Example |
|-------|--------|---------|
| **Task ID** | `task.id` | UUID |
| **Task Code** | `task.code` | `contextDev-12` |
| **Name** | `task.name` | `AIUC-1` |
| **Description** | `task.description` | Contains source URL |
| **Branch Name** | `task.customFields.branchName` | `feature/{ARTIFACT_TYPE}-aiuc-1` |
| **Repository URL** | `task.customFields.repoUrl` | GitHub repo URL |
| **Artifact Type** | `task.customFields.artifactType` | `{ARTIFACT_TYPE}` |
| **Vendor** | `task.customFields.vendor` | Vendor code |
| **Suite** | `task.customFields.suite` | Suite code |
| **Version** | `task.customFields.version` | Version string |

### Step 3: Update Task to In Progress

```javascript
const startTransition = task.nextTransitions.find(t => t.status === "in_progress")

zerobias_execute("platform.Task.update", {
  id: task.id,
  updateTask: { transitionId: startTransition.id }
})

zerobias_execute("platform.Task.addComment", {
  id: task.id,
  newTaskComment: {
    commentMarkdown: `**Started:** Beginning artifact creation.\n\n**Task:** ${task.code}\n**Type:** ${task.customFields.artifactType}\n**Branch:** ${task.customFields.branchName}`
  }
})
```

### Step 4: Check Dependencies (MANDATORY)

**Dependency chain:**
```
vendor → suite → {ARTIFACT_TYPE}
```

```javascript
// 1. Check vendor exists
const vendors = zerobias_execute("portal.Vendor.search", {
  searchVendorBody: { search: vendorCode }
})
const vendorExists = vendors.items.some(v => v.code?.toLowerCase() === vendorCode.toLowerCase())

// 2. Check suite exists
const suites = zerobias_execute("portal.Suite.search", {
  searchSuiteBody: { search: `${vendorCode} ${suiteCode}` }
})
const suiteExists = suites.items.some(s =>
  s.vendorCode?.toLowerCase() === vendorCode.toLowerCase() &&
  s.code?.toLowerCase() === suiteCode.toLowerCase()
)

// 3. If dependencies missing, create subtasks first
```

### Step 5: Create Branch

```bash
git checkout main
git pull origin main
git checkout -b {task.customFields.branchName}
```

### Step 6: Create Package

Use the creation script:

```bash
./scripts/createNew.sh <vendor> <suite> <version>
```

Or manually create `package/{vendor}/{suite}/{version}/` with:
- `package.json` from templates
- `index.yml` from templates
- `.npmrc` from templates

### Step 7: Populate Content

1. Fetch source documentation from URL in `task.description`
2. Parse structure into artifact-specific format
3. Fill in `index.yml` metadata
4. Add content files as needed

### Step 8: Validate

```bash
cd package/{vendor}/{suite}/{version}/
npm run validate
```

### Step 9: Commit and Push

```bash
git add .
git commit -m "feat({vendor}-{suite}): ${task.name}

Task: ${task.code}
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

git push origin {task.customFields.branchName}
```

### Step 10: Create Pull Request

```bash
gh pr create --base dev \
  --title "feat({vendor}-{suite}): ${task.name}" \
  --body "## Summary
- **Task:** ${task.code} - ${task.name}
- **Type:** {ARTIFACT_TYPE}
- **Package:** @zerobias-org/{ARTIFACT_TYPE}-${name}

## Validation
- [x] \`npm run validate\` passes

🤖 Generated with Claude Code"
```

### Step 11: Update Task

```javascript
zerobias_execute("platform.Task.addComment", {
  id: task.id,
  newTaskComment: {
    commentMarkdown: `## Artifact Created\n\n**Package:** @zerobias-org/{ARTIFACT_TYPE}-${name}\n**PR:** ${prUrl}\n\nPR needs review and merge.`
  }
})

const reviewTransition = task.nextTransitions.find(t => t.status === "awaiting_approval")
zerobias_execute("platform.Task.update", {
  id: task.id,
  updateTask: { transitionId: reviewTransition.id }
})
```

---

## Error Handling

### Validation Fails
1. Read errors from `npm run validate` output
2. Fix issues in `index.yml` or `package.json`
3. Re-validate before committing

### Missing Dependencies
1. Create subtasks for missing vendor/suite
2. Add blocking comment to parent task
3. Complete dependencies first, then resume

---

## References

- **CLAUDE.md** — Repository overview and commands
- **templates/** — Package templates
- **scripts/validate.ts** — Validation logic
