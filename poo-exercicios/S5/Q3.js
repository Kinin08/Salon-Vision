
const Vehicle = {
    type: "Veículo"
};

const car = Object.create(Vehicle);
car.name = "Carro";

const motorcycle = Object.create(Vehicle);
motorcycle.name = "Moto";

const truck = Object.create(Vehicle);
truck.name = "Caminhão";

console.log(car.start);
console.log(motorcycle.start);
console.log(truck.start);


Vehicle.start = function() {
    console.log(`${this.name} foi iniciado!`);
};

car.start();
motorcycle.start();
truck.start();