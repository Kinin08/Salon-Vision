class Vehicle {
    constructor(brand, model) {
        this.brand = brand;
        this.model = model;
    }

    start() {
        console.log(`${this.brand} ${this.model} foi ligado.`);
    }
}


class Car extends Vehicle {
    constructor(brand, model, doors) {
        super(brand, model);

        this.doors = doors;
    }

    honk() {
        console.log("Beep beep!");
    }
}


const car1 = new Car("Toyota", "Corolla", 4);

car1.start();
car1.honk();

console.log(car1 instanceof Car);
console.log(car1 instanceof Vehicle);