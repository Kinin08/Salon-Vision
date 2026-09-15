//Literal Object
const Product = {
    name: "Teclado",
    price: 100,
    category: "Eletrônicos",
}

console.log(Product);

//New object

const product1 = Object.create(Product);
product1.name = "Mouse";
product1.price = 50;
product1.category = "Periféricos";

console.log(product1);

//Factory function

function createProduct(name, price, category) {

    return {
        name: name,
        price: price,
        category: category
    };
}

const product2 = createProduct(
    "Caixa de Som",
    299.90,
    "Periféricos"
);

console.log(product2);

//Object Create

const productPrototype = {};

const product3 = Object.create(productPrototype);

product3.name = "Placa de Vídeo";
product3.price = 299.90;
product3.category = "Periféricos";
console.log(product3);