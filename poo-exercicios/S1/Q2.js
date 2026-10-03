const Vehicle = {
    marca: 'Toyota',
    modelo: 'Corolla',
    exibirInfo: function() {
        return `Marca: ${this.marca}, Modelo: ${this.modelo}`;
    }
}
console.log(Vehicle.exibirInfo());
const Car = Object.create(Vehicle);

Car.marca = 'Honda';
Car.modelo = 'Civic';
Car.color = 'Preto';
Car.exibirInfo();
Car.mostrarCor = function() {
    return `Cor: ${this.color}`;
}
console.log(Car.exibirInfo());
console.log(Car.mostrarCor());


const MyCar = Object.create(Car);
MyCar.marca = 'Ford';
MyCar.modelo = 'Focus';
MyCar.ano = 2021;
MyCar.color = 'Vermelho';
MyCar.exibirInfo();
MyCar.mostrarCor();
MyCar.mostrarAno = function() {
    return `Ano: ${this.ano}`;
}
console.log(MyCar.mostrarAno());
console.log(MyCar.exibirInfo());
console.log(MyCar.mostrarCor());
