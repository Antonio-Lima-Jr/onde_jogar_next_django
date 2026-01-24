---
name: mvp-scope-analyzer
description: Evaluates whether a proposed feature or technical decision should be included in the MVP scope, postponed, or rejected.
---

# MVP Scope Analyzer Skill

Use this skill when deciding if an idea, feature, or technical decision belongs in the MVP.

## Evaluation criteria

1. **User-visible value**  
   Does this proposal deliver clear and immediate value to end users?

2. **Complexity**  
   Does it introduce new infrastructure, integrations, or irreversible decisions?

3. **Risk**  
   Could this decision block future changes or slow down iteration?

4. **Timing**  
   Is this necessary now, or can it safely be delayed?

## Decision rules

- Favor features that unlock core product value quickly.
- Penalize external dependencies and operational overhead.
- Penalize irreversible architectural commitments.
- Favor simple, synchronous, and manual solutions suitable for early-stage products.
- Favor performance improvements and optimizations, unless they block basic functionality or become too complex and time-consuming to implement.

## Output expectations

- Return a single decision: **IN_MVP**, **POSTPONE**, or **REJECT**.
- Provide a short justification.
- Identify the primary risk of including the proposal now.
