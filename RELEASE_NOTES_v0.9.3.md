# UniPlan v0.9.3 Login Blue Screen Hotfix

## Fixes
- Added a React runtime recovery boundary to prevent the app from falling into a blank/blue screen after login.
- Added recovery actions for corrupted or incompatible local UniPlan storage:
  - keep account and clear runtime cache
  - full local UniPlan reset
- Hardened `effectiveCourses()` so invalid persisted plan data cannot crash rendering.
- Fixed offline register/login validation order so invalid student IDs do not partially enter the app before validation finishes.

## Checks
- Frontend production build passed.
- Python syntax compile check passed.
- Removed generated cache and dependency folders before packaging.
