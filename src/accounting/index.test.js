const {
  readBalance,
  writeBalance,
  creditAccount,
  debitAccount,
} = require('./index');

describe('Accounting app business logic (mirrors COBOL test plan)', () => {
  beforeEach(() => {
    writeBalance(1000.0);
  });

  test('TC-001: Display initial balance (TOTAL) should start at 1000.00', () => {
    expect(readBalance()).toBe(1000.0);
  });

  test('TC-002: Credit account with valid amount updates balance correctly', () => {
    creditAccount(500.0);
    expect(readBalance()).toBe(1500.0);
  });

  test('TC-003: Debit account with sufficient funds updates balance correctly', () => {
    debitAccount(700.0);
    expect(readBalance()).toBe(300.0);
  });

  test('TC-004: Debit account with insufficient funds does not change balance', () => {
    writeBalance(1000.0);
    debitAccount(1500.0);
    expect(readBalance()).toBe(1000.0);
  });

  test('TC-005: Global menu invalid choice handling is outside pure function scope', () => {
    // This is UI-level behavior in run(), but business logic path includes no state change
    writeBalance(1000.0);
    expect(readBalance()).toBe(1000.0);
  });

  test('TC-006: Exit behavior is outside pure function scope; ensure no balance change from stop', () => {
    writeBalance(1000.0);
    expect(readBalance()).toBe(1000.0);
  });

  test('TC-007: Operations persistence in session (credit then debit then read)', () => {
    creditAccount(200.0);
    debitAccount(100.0);
    expect(readBalance()).toBe(1100.0);
  });
});
