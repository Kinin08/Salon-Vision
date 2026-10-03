
const Animal = {
    type: "Animal",

    eat() {
        console.log(`${this.name} está comendo.`);
    }
};

const Mammal = Object.create(Animal);

Mammal.hasFur = true;

Mammal.breathe = function() {
    console.log(`${this.name} está respirando.`);
};

const Dog = Object.create(Mammal);

Dog.species = "Cachorro";

Dog.bark = function() {
    console.log(`${this.name} está latindo: Au au!`);
};

const myPet = Object.create(Dog);

myPet.name = "Rex";
myPet.age = 3;