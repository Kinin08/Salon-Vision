"use strict";

class Product {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    calculateDiscount(percentage) {
        return this.price - (this.price * percentage / 100);
    }
}


class PhysicalProduct extends Product {
    constructor(id, name, price, weight) {
        super(id, name, price);

        this.weight = weight;
    }

    calculateShipping() {
        return this.weight * 10;
    }
}


class DigitalProduct extends Product {
    constructor(id, name, price, fileSizeMB) {
        super(id, name, price);

        this.fileSizeMB = fileSizeMB;
    }

    getDownloadLink() {
        return `https://example.com/download/${this.id}`;
    }
}

const physical1 = new PhysicalProduct(
    1,
    "Notebook",
    3500,
    2.5
);

const physical2 = new PhysicalProduct(
    2,
    "Teclado",
    250,
    0.8
);

const digital1 = new DigitalProduct(
    3,
    "Curso de JavaScript",
    199.90,
    1500
);

const digital2 = new DigitalProduct(
    4,
    "E-book de Java",
    49.90,
    20
);

console.log(physical1 instanceof PhysicalProduct);
console.log(physical1 instanceof Product);

console.log(digital1 instanceof DigitalProduct);
console.log(digital1 instanceof Product);

console.log(physical1.calculateDiscount(10));
console.log(digital1.calculateDiscount(10));

console.log(physical1.calculateShipping());
console.log(physical2.calculateShipping());

console.log(digital1.getDownloadLink());
console.log(digital2.getDownloadLink());