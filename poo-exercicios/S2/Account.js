function createAccount(initialBalance = 0) {
    let balance = initialBalance;

    return {
        get balance() {
            return balance;
        },
        deposit(amount) {
            if (amount <= 0) {
                console.log('O valor do depósito deve ser um número positivo.');
                return;
            }
            balance += amount;
        },
        withdraw(amount) {
            if (amount <= 0) {
                console.log('O valor do saque deve ser um número positivo.');
                return;
            }
            if (amount > balance) {
                console.log('Saldo insuficiente para realizar o saque.');
                return;
            }
            balance -= amount;
        }
    };
    return account;
}

const account = createAccount(100);

console.log(account.balance);
account.deposit(50);
console.log(account.balance);
account.withdraw(30);
console.log(account.balance);