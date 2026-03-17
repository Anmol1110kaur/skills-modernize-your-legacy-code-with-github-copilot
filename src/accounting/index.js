#!/usr/bin/env node

// Node.js version of legacy COBOL account management app
// Preserves business logic from the COBOL flow:
// - Main menu with View Balance, Credit, Debit, Exit
// - Data layer with in-memory balance read/write
// - Business logic to protect against insufficient funds

const readline = require('readline');

let storageBalance = 1000.00; // COBOL DataProgram STORAGE-BALANCE default value

function readBalance() {
  return storageBalance;
}

function writeBalance(newBalance) {
  storageBalance = Number(newBalance.toFixed(2));
}

function displayBalance() {
  const balance = readBalance();
  console.log(`Current balance: ${balance.toFixed(2)}`);
}

function creditAccount(amount) {
  const current = readBalance();
  const newBalance = current + Number(amount);
  writeBalance(newBalance);
  console.log(`Amount credited. New balance: ${newBalance.toFixed(2)}`);
}

function debitAccount(amount) {
  const current = readBalance();
  if (current >= Number(amount)) {
    const newBalance = current - Number(amount);
    writeBalance(newBalance);
    console.log(`Amount debited. New balance: ${newBalance.toFixed(2)}`);
  } else {
    console.log('Insufficient funds for this debit.');
  }
}

async function run() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  function question(query) {
    return new Promise((resolve) => rl.question(query, resolve));
  }

  let continueFlag = true;

  while (continueFlag) {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');

    const choice = await question('Enter your choice (1-4): ');
    const parsed = Number(choice.trim());

    switch (parsed) {
      case 1:
        displayBalance();
        break;
      case 2: {
        const amountStr = await question('Enter credit amount: ');
        const amount = Number(amountStr.trim());
        if (!isNaN(amount) && amount >= 0) {
          creditAccount(amount);
        } else {
          console.log('Invalid amount; must be a non-negative number.');
        }
        break;
      }
      case 3: {
        const amountStr = await question('Enter debit amount: ');
        const amount = Number(amountStr.trim());
        if (!isNaN(amount) && amount >= 0) {
          debitAccount(amount);
        } else {
          console.log('Invalid amount; must be a non-negative number.');
        }
        break;
      }
      case 4:
        continueFlag = false;
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
        break;
    }
  }

  console.log('Exiting the program. Goodbye!');
  rl.close();
}

if (require.main === module) {
  run().catch((err) => {
    console.error('Application error:', err);
    process.exit(1);
  });
}

module.exports = {
  readBalance,
  writeBalance,
  displayBalance,
  creditAccount,
  debitAccount,
  run,
};
