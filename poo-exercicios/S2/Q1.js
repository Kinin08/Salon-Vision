const Product = {
    name: "Mouse",
    price: 120,
    category: "eletronicos",
    getInfo() {
        return "Produto: " + this.name + " - Preço: R$" + this.price + " - Categoria: " + this.category;
    }
}

console.log("Object literal: " + Product.getInfo());

const product1 = new Object();
product1.name = "Teclado";
product1.price = 150;
product1.category = "eletronicos";
product1.getInfo = function() {
    return "Produto: " + this.name + " - Preço: R$" + this.price + " - Categoria: " + this.category;
}

console.log("New Object: " + product1.getInfo());

const ProductMethod = {
    getInfo() {
        return "Produto: " + this.name + " - Preço: R$" + this.price + " - Categoria: " + this.category;
    }
}

const product2 = Object.create(ProductMethod);

product2.name = "Monitor";
product2.price = 800;
product2.category = "eletronicos";

console.log("Object.create(): " + product2.getInfo());

function factoryProduct(name, price, category) {
    return {
        name,
        price,
        category,
        getInfo() {
            return "Produto: " + this.name + " - Preço: R$" + this.price + " - Categoria: " + this.category;
        }
    }
}
const product3 = factoryProduct("Gabinete", 100, "eletronicos");
console.log("Factory function: " + product3.getInfo());

