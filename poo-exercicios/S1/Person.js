const Person = {
    name: 'John Doe',
    age: 30,
    introduce() {
        console.log(`Hi, I'm ${this.name} and I'm ${this.age} years old.`);
    }
};

const person1 = Object.create(Person);
const person2 = Object.create(Person);

person1.name = "João";
person1.age = 18;

person2.name = "Maria";
person2.age = 20;

console.log(person1.introduce());
console.log(person2.introduce());