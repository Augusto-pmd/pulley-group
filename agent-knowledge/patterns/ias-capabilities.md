# IAS Capabilities - Pulley Group Workspace

## Overview

This document lists all tools and capabilities available to the IAS (Intelligent Assistant System) for code manipulation and execution in this workspace.

**CRITICAL RULES:**
- All tools are MANUAL ONLY
- No automatic execution on save
- No Git hooks
- No auto-fix without explicit user request
- All operations require explicit command execution

---

## 1. Code Formatting

### Prettier

**Status:** Installed and configured  
**Type:** Formatter  
**Activation:** Manual only  
**Command:** `npx prettier --write <files>` or `npx prettier --check <files>`

**Configuration:**
- File: `.prettierrc.json`
- Conservative settings (80 chars, semicolons, double quotes)

**Rules:**
- ✅ CAN format files when explicitly requested
- ❌ MUST NOT run automatically on save
- ❌ MUST NOT be configured in `.vscode/settings.json`
- ❌ MUST NOT be integrated into Git hooks

**Usage:**
```bash
# Format specific files
npx prettier --write "**/*.{ts,tsx,js,jsx,json}"

# Check formatting without modifying
npx prettier --check "**/*.{ts,tsx,js,jsx,json}"
```

---

## 2. Code Linting

### ESLint (via Next.js)

**Status:** Available through Next.js  
**Type:** Linter  
**Activation:** Manual only  
**Commands:**
- `npm run lint` - Run linting (read-only)
- `npx next lint --fix` - Run linting with auto-fix

**Configuration:**
- Integrated in Next.js
- No separate `.eslintrc` file
- Uses Next.js default ESLint configuration

**Rules:**
- ✅ CAN run `npm run lint` to check code
- ✅ CAN run `npx next lint --fix` when user explicitly requests fixes
- ❌ MUST NOT run automatically
- ❌ MUST NOT fix errors without user confirmation
- ❌ MUST NOT configure auto-fix on save

**Usage:**
```bash
# Check for linting errors (read-only)
npm run lint

# Fix auto-fixable linting errors (requires explicit request)
npx next lint --fix
```

---

## 3. NPM Scripts

### Available Scripts

All scripts in `package.json` are manual runners only.

| Script | Command | Purpose | Type |
|--------|---------|---------|------|
| `dev` | `next dev` | Start development server | Runner |
| `build` | `next build` | Build production bundle | Runner |
| `start` | `next start` | Start production server | Runner |
| `lint` | `next lint` | Run ESLint (read-only) | Observer |

**Rules:**
- ✅ CAN execute scripts when user explicitly requests
- ❌ MUST NOT add new scripts without justification
- ❌ MUST NOT configure scripts to run automatically
- ❌ MUST NOT add pre/post lifecycle hooks

---

## 4. Database Operations

### Prisma CLI

**Status:** Installed  
**Type:** ORM / Database Tool  
**Activation:** Manual only  
**Commands:** `npx prisma <command>`

**Critical Commands:**
- `npx prisma migrate dev` - Create/modify database schema
- `npx prisma db push` - Sync schema without migrations
- `npx prisma generate` - Regenerate Prisma Client
- `npx prisma studio` - Open database UI
- `npx prisma db seed` - Execute seed script

**Rules:**
- ⚠️ HIGH RISK - Can modify database schema and data
- ✅ CAN execute when user explicitly requests
- ❌ MUST NOT execute migrate/push/seed without explicit user confirmation
- ❌ MUST NOT run automatically

---

## 5. Type Checking

### TypeScript Compiler

**Status:** Installed  
**Type:** Compiler  
**Activation:** Manual or during build  
**Command:** `npx tsc --noEmit`

**Rules:**
- ✅ CAN run type checking when requested
- ✅ Runs automatically during `npm run build`
- ❌ MUST NOT modify source code (only checks)
- ❌ MUST NOT run automatically on file changes

---

## Prohibitions

### ❌ NEVER Configure:

1. **Auto-format on save**
   - No `formatOnSave` in `.vscode/settings.json`
   - No editor integrations that auto-format

2. **Auto-fix on save**
   - No `codeActionsOnSave` with `source.fixAll.eslint`
   - No auto-fix hooks

3. **Git Hooks**
   - No Husky
   - No lint-staged
   - No lefthook
   - No pre-commit hooks

4. **Automatic Scripts**
   - No `prepare` scripts in package.json
   - No `postinstall` scripts
   - No file watchers that trigger actions

5. **Editor Auto-actions**
   - No `.vscode/settings.json` with auto-actions
   - No `.cursor/` configuration files
   - No workspace-level automation

---

## Usage Pattern for IAS

When user requests code formatting or linting fixes:

1. **Formatting Request:**
   ```
   User: "Format this file"
   IAS Action: Run `npx prettier --write <file>`
   ```

2. **Linting Fix Request:**
   ```
   User: "Fix linting errors"
   IAS Action: Run `npx next lint --fix`
   ```

3. **Database Operation Request:**
   ```
   User: "Run migration"
   IAS Action: Confirm intent, then run `npx prisma migrate dev`
   ```

All operations must be:
- Explicitly requested by user
- Confirmed before execution (for high-risk operations)
- Documented in response to user

---

## Summary

**Manual Tools Available:**
- ✅ Prettier (formatting)
- ✅ ESLint (linting + fix)
- ✅ TypeScript (type checking)
- ✅ NPM Scripts (runners)
- ⚠️ Prisma CLI (database operations - high risk)

**Automatic Tools:**
- None (by design)

**Governance:**
- All tools require explicit user command
- No automatic execution
- No hooks or save-triggers
- Manual and explicit only

