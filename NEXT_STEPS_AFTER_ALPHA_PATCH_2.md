# UniPlan v1.0 Alpha Patch 2 後續建議

## 下一步建議：Alpha Patch 3：狀態與 hooks 拆分版

優先拆：

1. usePlannerState
   - plan
   - candidates
   - history / future
   - snapshots

2. useCourseSearchState
   - query
   - filters
   - sortedFilteredCourses
   - searchLoading / searchError

3. useAccountState
   - user
   - profile
   - login/register/logout

4. useBackupSync
   - 匯入 JSON
   - 匯出 JSON
   - localStorage 同步

完成後 App.jsx 目標可降到 500～700 行，只保留頁面組合與全域配置。
