# Legacy COBOL Student Account Demo - Documentation

This document explains the COBOL components in this repository and summarizes how student account operations are implemented.

## Project overview

This sample app is a simple account management system implemented in COBOL to demonstrate:
- menu-driven user interaction
- modularized business logic and data access via `CALL`
- basic account operations: view balance, credit, and debit
- in-memory account state tracking in `DataProgram`

## File roles

### `src/cobol/main.cob`
- Program ID: `MainProgram`
- Entry point of the application.
- Displays a console menu to the operator and accepts a numeric command.
- Maps:
  - option `1` -> `TOTAL` balance
  - option `2` -> `CREDIT`
  - option `3` -> `DEBIT`
  - option `4` -> exit
- Uses `CALL 'Operations' USING ...` to delegate business actions.

### `src/cobol/operations.cob`
- Program ID: `Operations`
- Business logic layer.
- Accepts operation type from `MainProgram` through linkage area (`PASSED-OPERATION`).
- For each operation:
  - `TOTAL`: reads and displays current balance.
  - `CREDIT`: prompts for amount, reads balance, adds amount, writes back, shows updated balance.
  - `DEBIT`: prompts for amount, reads balance, checks sufficient funds, subtracts amount (if allowed), writes back, shows updated balance, or shows insufficient funds.
- Uses `CALL 'DataProgram' USING 'READ'|`WRITE`, FINAL-BALANCE` for data manipulation.

### `src/cobol/data.cob`
- Program ID: `DataProgram`
- Data access layer (mocked persistence in working storage).
- Maintains in-memory `STORAGE-BALANCE` (initial default `1000.00`).
- Interface via linkage area: `(PASSED-OPERATION BALANCE)`.
- On `READ`: copies `STORAGE-BALANCE` to caller's `BALANCE`.
- On `WRITE`: updates `STORAGE-BALANCE` with caller's `BALANCE`.

## Key functions and flow

1. `MainProgram` reads user menu choice.
2. `Operations` receives action string and may request amount from user.
3. `DataProgram` maintains persisted balance state during a single session.

## Business rules for student accounts

- Starting balance is `1000.00` (in `DataProgram`).
- `CREDIT` accepts any numeric amount entered as `PIC 9(6)V99` and adds to balance.
- `DEBIT` requires `FINAL-BALANCE >= AMOUNT`; otherwise, declines and leaves balance unchanged.
- `TOTAL` always reflects the current balance from data store.
- Balance arithmetic and fields are fixed-decimal with two implied decimal places (`V99`).

## Notes

- This is a legacy-style non-file-based prototype; all state resets when the program terminates.
- In a real student account domain, extend with:
  - account identifiers (student ID), multiple accounts, transaction logs
  - persisted storage (files or DB), validation for negative/zero amount, currency rules
  - authentication, limits, and audit trails.

## Sequence Diagram (Mermaid)

```mermaid
sequenceDiagram
    participant User
    participant Main as MainProgram
    participant Ops as Operations
    participant Data as DataProgram

    User->>Main: start
    Main->>User: show menu
    User->>Main: select option (1/2/3/4)
    Main->>Ops: CALL Operations USING "TOTAL"/"CREDIT"/"DEBIT"

    alt TOTAL
        Ops->>Data: CALL DataProgram USING "READ", FINAL-BALANCE
        Data-->>Ops: FINAL-BALANCE
        Ops-->>User: display current balance
    else CREDIT
        Ops-->>User: prompt credit amount
        User-->>Ops: enter AMOUNT
        Ops->>Data: CALL DataProgram USING "READ", FINAL-BALANCE
        Data-->>Ops: FINAL-BALANCE
        Ops: FINAL-BALANCE = FINAL-BALANCE + AMOUNT
        Ops->>Data: CALL DataProgram USING "WRITE", FINAL-BALANCE
        Ops-->>User: display new balance
    else DEBIT
        Ops-->>User: prompt debit amount
        User-->>Ops: enter AMOUNT
        Ops->>Data: CALL DataProgram USING "READ", FINAL-BALANCE
        Data-->>Ops: FINAL-BALANCE
        alt sufficient funds
            Ops: FINAL-BALANCE = FINAL-BALANCE - AMOUNT
            Ops->>Data: CALL DataProgram USING "WRITE", FINAL-BALANCE
            Ops-->>User: display new balance
        else insufficient funds
            Ops-->>User: display error
        end
    end

    Main-->>User: loop or exit message
```

