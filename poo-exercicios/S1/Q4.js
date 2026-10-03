const Library = {
    name: "Library"
};

const Book = Object.create(Library);

Book.title = "The Great Gatsby";
Book.author = "F. Scott Fitzgerald";
Book.year = 1925;

const Book2 = Object.create(Library);

Book2.title = "To Kill a Mockingbird";
Book2.author = "Harper Lee";
Book2.year = 1960;

Library.renewCatalog = function() {
    return "The library has been updated with new books.";
};

console.log(Book.renewCatalog());
console.log(Book2.renewCatalog());