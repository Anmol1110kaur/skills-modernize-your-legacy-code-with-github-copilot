# COBOL App Test Plan

This test plan validates the current business logic of the COBOL account management app. It is designed for stakeholder review and later for transformation into node.js unit/integration tests.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|-------------|------------------------|----------------|------------|-----------------|---------------|--------------------|----------|
| TC-001 | Display initial balance (TOTAL) | App compiled and running; initial balance is default 1000.00 | 1. Start app
2. Select option 1 (View Balance)
3. Observe output | Current balance displayed as 001000.00 (or equivalent 1000.00) | (to fill during execution) | (to fill) | Basic read path works |
| TC-002 | Credit account with valid amount | App running, balance 1000.00 | 1. Select option 2 (Credit Account)
2. Enter amount 500.00
3. Select option 1 to check balance | New balance is 1500.00 | (to fill) | (to fill) | Write and read integration check |
| TC-003 | Debit account with sufficient funds | App running, balance >= 700.00 | 1. Select option 3 (Debit Account)
2. Enter amount 700.00
3. Select option 1 to check balance | New balance is old balance - 700.00 | (to fill) | (to fill) | Conditional debit success |
| TC-004 | Debit account with insufficient funds | App running, balance 1000.00 | 1. Select option 3 (Debit Account)
2. Enter amount 1500.00
3. Optionally check balance | Display "Insufficient funds for this debit." and balance unchanged (1000.00) | (to fill) | (to fill) | Reject overdraft according rules |
| TC-005 | Reject invalid menu choice | App running | 1. Enter option 9 (or non-existent 0 or letter)
2. Observe output | Display "Invalid choice, please select 1-4." and re-display menu | (to fill) | (to fill) | Input validation workflow |
| TC-006 | Exit loop cleanly | App running | 1. Select option 4 (Exit)
2. Observe output | Display "Exiting the program. Goodbye!" and stop run | (to fill) | (to fill) | Program termination |
| TC-007 | Data persistence within session | App running, perform multiple operations | 1. Credit 200.00
2. Debit 100.00
3. View balance | Balance reflects stepwise operations correctly (1000 +200 -100 =1100) | (to fill) | (to fill) | Stateful operations through DataProgram |


## Notes for Stakeholders

- `DataProgram` stores `STORAGE-BALANCE` in working storage; it is not persisted across runs.
- Financial values are fixed point (PIC 9(6)V99) and displayed with 2 decimals.
- Transition to node.js should preserve the same behavior paths and the business rules: no negative balance, proper operations mapping (TOTAL/CREDIT/DEBIT), and menu-driven flow.
- After node.js tests are in place, rows in `Actual Result` and `Status` can be updated with real outcomes.
