# UniPlan v1.0 Alpha Public Patch 11

## Main changes

- Reordered the planner right-side operation buttons into a 2-column, 9-button layout:
  1. 復原 / 重做
  2. 儲存 / 快照
  3. 匯入文字 / 匯出文字
  4. 匯出課表 / 匯出行事曆
  5. 新增自訂課程, spanning two columns
- Renamed JSON import/export to 匯入文字 / 匯出文字 while preserving the existing JSON backup format.
- Renamed the visible PNG export action to 匯出課表.
- Added a minimal custom course modal for 暑修、補修、抵免、跨校與其他手動課程.
- Custom courses receive unique manual IDs to avoid duplicate-key collisions.
- Build verified with `npm run build`.

## Notes

- 匯出 Excel still exists in the codebase but is removed from the visible right-side planner operation grid per the requested 9-button layout.
- 匯入文字/匯出文字 still use JSON internally; only the user-facing wording changed.
