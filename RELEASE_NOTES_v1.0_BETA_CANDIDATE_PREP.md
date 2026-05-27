# UniPlan v1.0 Beta Candidate Prep

## Scope

This build consolidates the scattered Alpha public patch requests into one Beta Candidate preparation package.

## Included updates

- Student ID parser corrected: `414730209` is parsed as 114 entry year, department code 73, identity code 0, department sequence 20, check digit 9.
- Transfer student rules added: identity code 7 starts from sophomore level; identity code 8 starts from junior level.
- Backend and frontend student parsers now expose transfer/start-grade fields.
- Manual course IDs now use `manual_` prefix and remain isolated from official course ids.
- Manual courses count toward graduation/program only when the user explicitly enables those flags.
- Program progress excludes failed courses and manual courses not marked as program-applicable.
- Course and program cards use the same blue card material.
- Program course blocks are arranged in a 4-column desktop grid.
- Graduation category progress is shown as left-aligned progress rows without surrounding cards.
- Feedback page is split into an independent form panel and recent-report panel.
- Admin statistics were simplified to overview + anomaly center.
- Admin anomaly details continue to show academic year, course/program name, and missing fields.
- API base now follows the current host by default, improving LAN testing with phone/another device.
- Course card overlap was addressed with reserved top/bottom lanes and final CSS overrides.

## Build

`npm run build` passed.
