const Person = {
    name: "John Doe",
    age: 30,
    introduce() {
        return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
    }
}
const person1 = Object.create(Person);

person1.name = "Alice";
person1.age = 25;

const person2 = Object.create(Person);

person2.name = "Bob";
person2.age = 35;

console.log(person1.introduce());
console.log(person2.introduce());