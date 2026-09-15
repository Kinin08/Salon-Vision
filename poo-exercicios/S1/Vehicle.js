const Vehicle = {
    type: "Veículo",

    move() {
        return "O veículo está se movimentando.";
    }
};

const Car = Object.create(Vehicle);

Car.wheels = 4;

Car.honk = function() {
    return "Buzina: Bii Bii!";
};

const myCar = Object.create(Car);

myCar.brand = "Toyota";
myCar.model = "Corolla";

console.log(myCar.type);
console.log(myCar.wheels);
console.log(myCar.brand);
console.log(myCar.model);

console.log(myCar.move());
console.log(myCar.honk());

console.log(Object.getPrototypeOf(myCar) === Car);
console.log(Object.getPrototypeOf(Car) === Vehicle);
console.log(Object.getPrototypeOf(Vehicle));