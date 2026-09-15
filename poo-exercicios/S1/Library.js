const library = {
    name: "Biblioteca Central",
    books: 100
};

const book1 = Object.create(library);
const book2 = Object.create(library);

book1.title = "O Senhor dos Anéis";
book2.title = "Harry Potter";

library.renewCatalog = function() {
    return "Catálogo renovado!";
};

book1.leia = function() {
    return `Lendo o livro: ${this.title}`;
}

console.log(book1.renewCatalog());
 
console.log(book2.renewCatalog());

console.log(book1.hasOwnProperty("renewCatalog"));

console.log(book2.hasOwnProperty("renewCatalog"));

console.log(library.hasOwnProperty("renewCatalog"));
