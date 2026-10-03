const studentPrototype = {
    grade: 7,

    calculateAverage() {
        return this.grade;
    }
};

const student = Object.create(studentPrototype);

student.grade = 9;

console.log(student.calculateAverage());

console.log(student.hasOwnProperty("grade"));
console.log(studentPrototype.hasOwnProperty("grade"));