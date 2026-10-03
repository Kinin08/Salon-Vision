function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.introduce = function() {
    console.log(`Meu nome é ${this.name} e tenho ${this.age} anos.`);
};


function Student(name, age, course) {
    Person.call(this, name, age);

    this.course = course;
}

Student.prototype = Object.create(Person.prototype);

Student.prototype.constructor = Student;

Student.prototype.study = function() {
    console.log(`${this.name} está estudando ${this.course}.`);
};


const student1 = new Student("Welygton", 18, "Informática");

student1.introduce();
student1.study();

console.log(student1 instanceof Student);
console.log(student1 instanceof Person);