function Vehicle(brand, model) {
    this.brand = brand;
    this.model = model;
}

Vehicle.prototype.start = function() {
    console.log(`${this.brand} ${this.model} foi ligado.`);
};


function Car(brand, model, doors) {
    Vehicle.call(this, brand, model);

    this.doors = doors;
}

Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;

Car.prototype.honk = function() {
    console.log("Beep beep!");
};


const car1 = new Car("Toyota", "Corolla", 4);

car1.start();
car1.honk();

console.log(car1 instanceof Car);
console.log(car1 instanceof Vehicle);