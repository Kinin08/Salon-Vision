const Person = {
    name: "John Doe",
    age: 30,
    address: [{
        street: "123 Main St",
        city: "Anytown",
    }]
}
const shallowCopy = { ...Person };
shallowCopy.name = "Jane Doe";
shallowCopy.address[0].street = "456 Elm St";
console.log("shallowCopy address street: " + shallowCopy.address[0].street);
console.log("Person address street: " + Person.address[0].street);

const deepCopy = JSON.parse(JSON.stringify(Person));
deepCopy.name = "Alice Smith";
deepCopy.address[0].street = "789 Oak St";
console.log("deepCopy address street: " + deepCopy.address[0].street);
console.log("Person address street: " + Person.address[0].street);