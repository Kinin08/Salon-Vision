function createUser(name, email, role) {
    return{
        name,
        email,
        role,
        displayData(){
            return `Name: ${this.name} - Email: ${this.email} - Role: ${this.role}`;
        }
    }
}
const person1 = createUser("John Doe", "john.doe@example.com", "user");
console.log(person1.displayData());

const person2 = createUser("Jane Smith", "jane.smith@example.com", "admin");
console.log(person2.displayData());

const person3 = createUser("Bob Johnson", "bob.johnson@example.com", "user");
console.log(person3.displayData());