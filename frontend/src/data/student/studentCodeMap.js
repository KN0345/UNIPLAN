// UniPlan student-number reference map.
// TKU student id structure used by the local parser:
// 414730209 => 114 entry year, 73 department, 0 identity, 20 department sequence, 9 check digit.
export const STUDENT_ID_STRUCTURE = [
  { key: 'programCode', range: [0, 1], label: '學制代碼' },
  { key: 'entryYear', range: [1, 3], label: '入學年度後兩碼' },
  { key: 'departmentCode', range: [3, 5], label: '系所代碼' },
  { key: 'identityCode', range: [5, 6], label: '身分別' },
  { key: 'departmentSequence', range: [6, 8], label: '進入系所序號' },
  { key: 'checkDigit', range: [8, 9], label: '防呆碼' },
]

export const TRANSFER_IDENTITY_RULES = {
  7: { transfer: true, startGrade: '大二', label: '大二轉學生' },
  8: { transfer: true, startGrade: '大三', label: '大三轉學生' },
}
