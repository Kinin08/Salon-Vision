const Vehicle = {
    type: "Veículo"
};

const Car = Object.create(Vehicle);
Car.name = "Carro";

const SportsCar = Object.create(Car);
SportsCar.name = "Carro esportivo";

const Person = {
    name: "João"
};

function isVehicleType(object) {
    return Vehicle.isPrototypeOf(object);
}

console.log(isVehicleType(Car));
console.log(isVehicleType(SportsCar));
console.log(isVehicleType(Person));
console.log(isVehicleType(Vehicle));