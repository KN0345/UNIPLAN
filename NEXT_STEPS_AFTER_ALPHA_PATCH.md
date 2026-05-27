# Next Steps After v1.0 Alpha Patch

1. Extract remaining UI components from `App.jsx`:
   - `CourseInfoDrawer`
   - `CoursePopover`
   - `AppearanceModal`
   - `SnapshotPage`

2. Reduce prop passing between `App.jsx`, `PlannerPage`, and `CourseSearchPage` by introducing small hooks:
   - `usePlannerState`
   - `useCourseSearch`
   - `useLocalAccount`

3. Continue student-side UI reduction:
   - Keep teacher names.
   - Hide teacher IDs, serial IDs, internal rule keys, and technical tags by default.

4. Prepare Beta testing package:
   - 3–5 students test search/planner/program chooser on mobile.
   - Collect broken course data, missing program rules, and layout issues.
