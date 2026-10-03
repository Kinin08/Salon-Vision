function Book(title, author, year) {
    this.title = title;
    this.author = author;
    this.year = year;
}

Book.prototype.displayInfo = function() {
    console.log(`${this.title} — ${this.author} (${this.year})`);
};

const book1 = new Book("Dom Casmurro", "Machado de Assis", 1899);
const book2 = new Book("O Cortiço", "Aluísio Azevedo", 1890);
const book3 = new Book("Iracema", "José de Alencar", 1865);

book1.displayInfo();
book2.displayInfo();
book3.displayInfo();

console.log(book1 instanceof Book);
console.log(book2 instanceof Book);
console.log(book3 instanceof Book);

console.log(book1.displayInfo === book2.displayInfo);
console.log(book2.displayInfo === book3.displayInfo);