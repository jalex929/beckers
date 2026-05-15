# Becker's Healthcare Take-Home
## Repository Context & Implementation Guide for AI-Assisted Development

This document provides high-level repository context, architecture guidance, implementation priorities, and strategic framing for AI-assisted development workflows using Claude Code, ChatGPT, and Bolt.new.

The goal is to reduce unnecessary token usage by giving AI systems structured repository awareness without requiring repeated full-project scans.

---

# Project Overview

This project is a UX Engineering + Product Thinking take-home assignment for the UX Engineer (Growth & Experimentation) role at Becker's Healthcare.

The assignment focuses on:
- frontend craft
- UX thinking
- conversion optimization
- experimentation mindset
- structured implementation
- product reasoning
- editorial UX
- scalable frontend systems

The assignment requires building:
1. Homepage
2. Asset Listing Page
3. Asset Signup Page

The backend API is already provided and functional.

This project should demonstrate:
- UX engineering capability
- experimentation thinking
- analytics awareness
- scalable frontend architecture
- conversion-focused UX
- accessibility
- structured product reasoning
- AI-assisted workflow orchestration

---

# Strategic Implementation Philosophy

This project intentionally prioritizes:
- depth over breadth
- experimentation thinking over feature quantity
- conversion UX over flashy interactions
- editorial hierarchy over decorative UI
- measurable thinking over arbitrary polish
- scalable systems over one-off screens

The repo and documentation should feel like the work of someone already operating inside a modern growth experimentation team.

---

# High-Level Technical Stack

## Frontend
- React
- TypeScript
- Modern CSS
- Component-driven architecture

## Backend
- Existing Express API
- Local API server
- REST endpoints

## Tooling
- Vite
- Jest
- Node.js

## AI Workflow
- Claude Code → implementation/debugging/refactoring
- ChatGPT → systems thinking/documentation/strategy
- Bolt.new → rapid UI scaffolding + iteration
- GitHub → shared source of truth

---

# Repository Structure Overview

```txt
/.bolt
/design_system
/src
.env.example
.gitignore
CLAUDE.md
README.md
jest.config.ts
package.json
package-lock.json
tsconfig.json
ux-design-dev-interview-challenge.html
```

---

# File & Folder Context

# /.bolt

Contains Bolt.new-related project configuration.

Purpose:
- rapid UI prototyping
- scaffolding workflows
- frontend acceleration

Generally not important for day-to-day feature implementation unless modifying Bolt integration behavior.

---

# /design_system

Most important non-src folder.

Contains:
- Becker's editorial design system
- typography guidance
- color tokens
- spacing system
- component references
- visual direction
- UI kits
- brand guidance
- newsletter examples
- editorial styling patterns

This folder should be treated as:
> the visual and interaction source of truth.

Do NOT create generic SaaS UI patterns that conflict with this system.

Important themes:
- editorial hierarchy
- professional healthcare tone
- strong readability
- restrained visual design
- minimal decorative effects
- typography-first layout
- trust-oriented UX

Important typography direction:
- serif editorial headlines
- sans-serif UI/body copy
- structured hierarchy
- strong scannability

---

# /src

Primary application implementation folder.

Contains:
- routes/pages
- components
- API integration
- frontend state management
- styling
- interaction logic

This is the main implementation area.

Claude should prioritize reading only relevant subfolders/files before making modifications.

Avoid unnecessary full-project scans.

---

# .env.example

Environment variable template.

Likely includes:
- API URLs
- runtime configuration

Use as reference for environment setup.

Do not hardcode environment-sensitive values.

---

# .gitignore

Standard git exclusion configuration.

Usually irrelevant unless adding:
- generated assets
- logs
- deployment artifacts

---

# CLAUDE.md

Important AI workflow file.

Should act as:
- Claude-specific implementation guidance
- repository context
- workflow rules
- architectural constraints
- coding standards
- implementation philosophy

This should be maintained and expanded throughout development.

High priority file.

---

# README.md

Public-facing repository documentation.

Should communicate:
- project purpose
- setup instructions
- architectural decisions
- tradeoffs
- experimentation thinking
- implementation rationale
- AI-assisted workflow explanation
- future improvements

This is part of the evaluation.

Treat as a product artifact, not merely technical documentation.

---

# jest.config.ts

Testing configuration.

Indicates:
- testing setup exists
- test infrastructure is available

Testing does not appear to be the primary evaluation focus, but lightweight coverage for:
- utility logic
- filtering behavior
- state handling
may strengthen the project.

Avoid over-investing in testing complexity.

---

# package.json

Primary dependency + scripts file.

Important for:
- installed libraries
- available scripts
- project architecture understanding
- runtime tooling

Likely includes:
- React
- TypeScript
- Vite
- Jest
- frontend tooling

Claude should check this before:
- adding dependencies
- restructuring tooling
- changing architecture

---

# package-lock.json

Dependency lockfile.

Generally should not be manually modified.

---

# tsconfig.json

TypeScript configuration.

Defines:
- path aliases
- compiler settings
- strictness
- module behavior

Reference before:
- changing import structure
- adding aliases
- altering build behavior

---

# ux-design-dev-interview-challenge.html

Critical project brief file.

Contains:
- assignment requirements
- UX expectations
- evaluation criteria
- API documentation
- bonus opportunities
- submission checklist
- strategic hints

This is effectively:
> the assignment source of truth.

Claude should reference this before implementing major features.

---

# Assignment Requirements Summary

## Required Pages

### Homepage

Purpose:
- establish brand identity
- introduce value proposition
- drive users into asset discovery

Required:
- hero section
- navigation
- featured assets
- footer
- CTA to listing page

Potential differentiation:
- editorial hierarchy
- trust-building
- content strategy
- recently viewed personalization

---

### Asset Listing Page

Purpose:
- content discovery
- filtering
- browsing
- conversion entry point

Required:
- asset cards
- filtering
- loading states
- empty states
- result counts
- pagination or infinite scroll

Potential differentiation:
- search UX
- editorial scanning
- behavioral instrumentation
- recommendation systems
- experimentation opportunities

Most strategically important page.

---

### Signup Page

Purpose:
- conversion optimization
- trust
- lead generation UX

Required:
- asset detail
- validation
- API submission
- confirmation state
- error handling

Potential differentiation:
- progressive disclosure
- friction reduction
- recommendation engine
- inline confirmation UX
- trust patterns
- analytics instrumentation

Second most strategically important page.

---

# Backend API Context

Base URL:

```txt
http://localhost:3000
```

---

## GET /assets

Returns:
- all assets
- content catalog
- metadata
- sponsor information
- dates
- speakers

Used for:
- homepage previews
- listing page
- recommendations
- personalization

Important fields:
- id
- name
- description
- assetType
- sponsorName
- executionDate
- expirationDate
- speakers[]
- lastModifiedDate

---

## GET /assets/:id

Returns:
- individual asset detail

Used for:
- signup page
- detailed asset display

Must handle:
- 404 states
- loading states
- invalid routes

---

## POST /assets/:id/signup

Handles:
- lead generation signup

Required fields:
- firstName
- lastName
- email
- jobTitle
- companyName

Important:
- returns signupDate
- idempotent behavior
- inline success state required
- inline error handling required

---

# Strategic UX Direction

The UX should feel:
- editorial
- trustworthy
- healthcare-professional
- information-dense but readable
- conversion-aware
- polished
- intentional

Avoid:
- overly trendy startup aesthetics
- excessive gradients
- noisy animation
- over-engineered interaction patterns
- generic SaaS templates

Strong focus areas:
- typography
- hierarchy
- spacing rhythm
- scannability
- conversion clarity
- reduced cognitive load

---

# Important Product Thinking Areas

## Experimentation Thinking

The project should demonstrate:
- hypothesis-driven UX
- measurable interaction points
- conversion thinking
- behavioral optimization

Potential experiment areas:
- CTA placement
- card hierarchy
- social proof
- sticky signup modules
- recommendation positioning
- form reduction
- urgency messaging

Document these even if not fully implemented.

---

# Analytics & Instrumentation Strategy

Important opportunity area.

Potential tracked events:
- asset_card_clicked
- filter_applied
- search_used
- signup_started
- signup_completed
- recommendation_clicked
- asset_viewed
- scroll_depth_reached

Potential funnel:

```txt
Homepage
→ Asset Listing
→ Asset Detail
→ Signup Started
→ Signup Completed
```

Instrumentation thinking is likely a major differentiator.

---

# Accessibility Expectations

High priority.

Important areas:
- semantic HTML
- keyboard accessibility
- color contrast
- focus states
- responsive readability
- accessible forms
- reduced cognitive load
- ARIA labels where appropriate

Accessibility should feel integrated into the system architecture.

---

# AI Workflow Documentation Strategy

This project intentionally uses:
- Claude Code
- ChatGPT
- Bolt.new

The workflow should be framed as:
> AI-assisted product development within structured human-led systems.

NOT:
> AI-generated implementation.

Important themes:
- orchestration
- validation
- structured reasoning
- rapid iteration
- debugging acceleration
- architectural oversight

---

# Recommended Documentation Structure

```txt
/docs
    /requirements
    /architecture
    /implementation
    /experiments
    /brand
    /showcase
```

---

# Recommended High-Priority Documentation Files

## project-brief.md

Tracks:
- assignment requirements
- constraints
- acceptance criteria

---

## technical-architecture.md

Tracks:
- frontend structure
- state management
- routing
- API architecture
- scaling considerations

---

## analytics-plan.md

Tracks:
- KPIs
- instrumentation
- funnel tracking
- experimentation metrics

---

## decision-log.md

Tracks:
- tradeoffs
- prioritization
- deferred ideas
- rationale

Very important file.

---

## what-i-prioritized.md

Explains:
- why certain features were emphasized
- why others were intentionally deferred
- alignment to role expectations

This is strategically valuable.

---

# Recommended Implementation Priorities

## Highest Priority
- listing page polish
- signup flow UX
- responsive implementation
- loading/error states
- editorial hierarchy
- analytics thinking
- experimentation framing
- accessibility
- README quality

---

## Medium Priority
- personalization
- recommendation systems
- search UX
- advanced filtering
- animation polish

---

## Lower Priority
- over-engineered architecture
- excessive state complexity
- flashy interactions
- unnecessary abstractions

---

# Core Evaluation Framing

This project should communicate:

> “This candidate already thinks like a modern UX Engineer focused on experimentation, conversion optimization, editorial UX, scalable systems, and measurable product outcomes.”

Not:

> “This candidate completed a frontend coding exercise.”