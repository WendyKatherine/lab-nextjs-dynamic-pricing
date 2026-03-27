# CLAUDE.md

## Project Overview
This repository is a technical demo called `lab-nextjs-dynamic-pricing`.

The goal is to demonstrate:
- simplified geolocation input (US/CA only)
- postal code validation
- backend-driven pricing as source of truth
- reproducible quote calculation with breakdown
- clean separation between domain, application, and infrastructure

This is NOT a full production e-commerce system.
It is a portfolio-grade engineering demo focused on pricing, quote calculation, and domain clarity.

---

## Scope
### In scope (v1)
- product selection
- selected print areas
- quantity input
- country + postal code input
- price book loaded from local JSON
- zone rule resolution
- quote calculation with breakdown
- frontend connected to backend route handlers

### Out of scope (v1)
- Stripe
- Cloudinary
- authentication
- real database
- real cart persistence
- external APIs in domain layer
- full checkout

---

## Architecture Style
Use a lightweight layered architecture:

- `src/core/domain` → pure business rules and domain logic
- `src/core/application` → use cases / orchestration
- `src/infrastructure` → JSON repositories, mock data providers
- `app/api` → route handlers / delivery layer

Avoid overengineering.
Do not introduce unnecessary abstractions, factories, or patterns unless they clearly improve readability.

---

## Coding Principles
- Prefer TypeScript everywhere
- Prefer pure functions in domain services
- Keep business logic framework-agnostic
- Use explicit types and small functions
- Favor readability over cleverness
- Follow SOLID only when it improves clarity, not as ceremony
- Keep functions deterministic
- No side effects inside domain services
- No fetch, file I/O, or framework code inside `domain`

---

## Domain Rules
Business scope is limited to US and CA.

Pricing is derived from:
- product pricing category
- quantity
- selected print areas
- number of unique print locations
- add-on cost per selected area
- price book version
- zone rate by country/postal code

Formula:
- Block1 = setupCost + (quantity * baseCost * volumeMultiplier) + (applicationPerUnit * quantity)
- ExtraLocations = (locations - 1) * (setupCost + applicationPerUnit * quantity)
- AddOns = addOnPerUnit * quantity
- PrePostal = Block1 + ExtraLocations + AddOns
- Multiplier = 1 + zoneRate / 100
- Total = PrePostal * Multiplier
- UnitPrice = Total / quantity

---

## Domain Constraints
- Country must be `US` or `CA`
- Quantity must be greater than 0
- Selected areas must belong to the selected product
- Zone resolution must be deterministic
- Frontend must not recalculate business pricing logic

---

## Testing Expectations
Use Vitest (or Jest if already configured).

Write tests for:
- volume tier resolution
- zone resolution
- quote breakdown correctness
- invalid input handling

Prefer test-first or test-alongside implementation.

---

## Implementation Guidance
When generating code:
- do not add random libraries
- do not invent unsupported business rules
- do not add UI unless requested
- do not move files unless necessary
- do not replace union types with loose strings
- keep imports clean
- keep modules small and focused

---

## Communication Style
When proposing code:
- explain the intention briefly
- keep implementation practical
- prefer incremental changes
- avoid rewriting unrelated files