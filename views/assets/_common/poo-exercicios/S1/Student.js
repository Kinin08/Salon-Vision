const studentPrototype = {
    grade: 8,

    calculateAverage() {
        return this.grade;
    }
};

const student = Object.create(studentPrototype);

student.grade = 10;

console.log(student.grade);

console.log(student.calculateAverage());

console.log(student.hasOwnProperty("grade"));

console.log(studentPrototype.hasOwnProperty("grade"));

console.log(student.hasOwnProperty("calculateAverage"));
