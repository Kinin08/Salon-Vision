function createAccount(initialBalance) {
    let balance = initialBalance;

    return {
        get balance() {
            return balance;
        },

        deposit(amount) {
            if (amount > 0) {
                balance += amount;
            }
        },

        withdraw(amount) {
            if (amount > 0 && amount <= balance) {
                balance -= amount;
            }
        }
    };
}
const account = createAccount(100);
account.deposit(50);
account.withdraw(30);
console.log(account.balance);