# UniPlan v1.0 Alpha Patch - App Split Evaluation

## Scope
This patch focuses on architecture cleanup only. It does not add school login, crawler, official academic-system integration, or new large features.

## Completed
- Extracted account/student-id/local-storage helpers into `frontend/src/utils/account.js`.
- Extracted graduation rule preview data and matching helpers into `frontend/src/data/graduation/graduationRulesPreview.js`.
- Extracted course planning utilities, export helpers, timetable helpers, conflict helpers, and credit helpers into `frontend/src/utils/coursePlanning.js`.
- Extracted course search UI into `frontend/src/pages/CourseSearchPage.jsx`.
- Extracted planner workspace UI into `frontend/src/pages/PlannerPage.jsx`.
- Kept Programs, Credits, and Admin pages already separated.
- Verified production build with `npm run build`.

## Result
`App.jsx` was reduced from about 5,351 lines in the original v1.0 Alpha package to about 1,549 lines in this patch. It is no longer carrying the large graduation-rule dataset or most course/timetable utility logic.

## Remaining technical debt
- `App.jsx` still contains several modal and detail components, including appearance settings, course info, popover logic, and some import/admin helpers.
- Course detail and appearance settings should be extracted in the next maintenance patch.
- Some helper props are still passed down explicitly; a later version can introduce lightweight hooks/context after the UI is stable.

## Build
- `npm run build`: passed.
