
function createUser(name, email, role) {
    return {
        name: name,
        email: email,
        role: role,
        DisplayData() {
            return `${this.name} - ${this.email} - ${this.role}`;
        }
    }
}

const user1 = createUser("João", "joao@email.com", "Administrador");
const user2 = createUser("Maria", "maria@email.com", "Funcionária");
const user3 = createUser("Carlos", "carlos@email.com", "Cliente");

console.log(user1.DisplayData());
console.log(user2.DisplayData());
console.log(user3.DisplayData());