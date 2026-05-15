# Essential Repository Context To Read Before Making Changes

Before making implementation decisions, please read and understand the following files and folders in order of importance.

The goal is to minimize unnecessary token usage while still understanding the architecture, requirements, and design direction of the project.

---

# Highest Priority Files

These files contain the most important project context and should always be reviewed first.

## 1. `ux-design-dev-interview-challenge.html`

Purpose:
- Primary assignment brief
- Source of truth for requirements
- API expectations
- UX expectations
- Evaluation criteria
- Required pages
- Bonus opportunities
- Submission expectations

Read this first before implementing any feature.

---

## 2. `CLAUDE.md`

Purpose:
- Repository-specific implementation guidance
- AI workflow expectations
- Architecture notes
- Coding standards
- Project philosophy
- Strategic priorities

This should guide implementation behavior throughout the project.

---

## 3. `README.md`

Purpose:
- High-level project overview
- Setup instructions
- Architecture rationale
- Product direction
- Current implementation status
- Tradeoffs and priorities

Use this to understand overall project goals before modifying architecture.

---

# High Priority Folders

## 4. `/design_system`

Purpose:
- Visual source of truth
- Editorial design direction
- Typography hierarchy
- Spacing system
- Component styling
- Brand voice
- UI patterns
- Existing Becker's-inspired design language

Important:
This project should NOT look like a generic SaaS dashboard.

Prioritize:
- editorial hierarchy
- readability
- professional healthcare tone
- restrained UI patterns
- conversion-focused layouts
- typography-first design

Review all major files before implementing UI changes.

---

## 5. `/src`

Purpose:
- Main application implementation
- Components
- Pages/routes
- API integration
- State management
- Styling
- Interaction logic

Important:
Do NOT scan the entire folder recursively unless necessary.

Instead:
- identify the specific feature area being modified
- read only relevant files/components
- preserve existing architecture patterns

---

# Important Technical Context Files

## 6. `package.json`

Purpose:
- Installed dependencies
- Available scripts
- Runtime tooling
- Existing libraries
- Project architecture clues

Check before:
- adding dependencies
- restructuring tooling
- introducing new frameworks/libraries

---

## 7. `tsconfig.json`

Purpose:
- TypeScript configuration
- Path aliases
- Compiler settings
- Module resolution

Check before:
- changing imports
- restructuring architecture
- adding aliases

---

## 8. `jest.config.ts`

Purpose:
- Existing test setup
- Testing architecture
- Test environment configuration

Review only if:
- adding tests
- modifying test structure
- debugging test failures

---

# Lower Priority Files

These files usually do NOT need to be read unless directly relevant.

## `.env.example`
Read only when:
- configuring environment variables
- debugging runtime config

---

## `.gitignore`
Read only when:
- adding generated files
- debugging git tracking issues

---

## `package-lock.json`
Do not manually review unless debugging dependency conflicts.

---

# Reading Strategy

## Preferred Workflow

1. Read assignment brief first
2. Read repository guidance files
3. Review design system
4. Identify implementation target
5. Read only relevant `/src` files
6. Preserve existing architecture patterns
7. Avoid unnecessary recursive scans

---

# Implementation Priorities

When making decisions, prioritize:

1. UX clarity
2. Editorial hierarchy
3. Conversion optimization
4. Accessibility
5. Structured component architecture
6. Maintainability
7. Experimentation readiness
8. Analytics/instrumentation opportunities

Do NOT prioritize:
- flashy animations
- unnecessary abstractions
- over-engineering
- excessive state complexity
- generic SaaS UI patterns

---

# Project Positioning

This project should feel like:
- a modern editorial growth platform
- an experimentation-ready media product
- a scalable conversion-focused UX system

NOT:
- a generic frontend coding exercise
- a dashboard template
- a startup landing page clone

---

# Important UX Themes

The experience should emphasize:
- trust
- readability
- hierarchy
- editorial polish
- conversion flow clarity
- structured discovery
- professional healthcare tone
- measurable interaction thinking

---

# Important Engineering Themes

The implementation should emphasize:
- scalable components
- maintainable architecture
- thoughtful state management
- clean API integration
- structured routing
- instrumentation readiness
- responsive behavior
- accessibility-first implementation

---

# AI Workflow Expectations

AI tools are being used intentionally as part of the workflow.

Tool roles:

- Claude Code → implementation, debugging, refactoring
- ChatGPT → systems thinking, documentation, product strategy
- Bolt.new → rapid UI iteration and scaffolding
- GitHub → shared source of truth

The workflow should remain:
- human-directed
- structured
- intentional
- measurable
- maintainable

Avoid:
- unnecessary rewrites
- architecture churn
- replacing existing patterns without justification
- overcomplicated abstractions