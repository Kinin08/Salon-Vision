"use strict";

const Person = {
    name: "John Doe",
    age: 30,

    introduce() {
        console.log(
            `Hi, my name is ${this.name} and I am ${this.age} years old.`
        );
    }
};

const employee = Object.create(Person);

employee.name = "Jane Smith";
employee.age = 28;
employee.jobTitle = "Software Engineer";

employee.introduce = function() {

    Object.getPrototypeOf(this).introduce.call(this);

    console.log(
        `I work as a ${this.jobTitle}.`
    );
};

employee.introduce();