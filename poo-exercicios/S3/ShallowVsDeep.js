const person = {
    name: "Welygton",
    age: 17,
    address: {
        street: "Rua Principal",
        city: "Caxias do Sul"
    }
};

const shallowPerson = {
    ...person
};

const deepPerson = structuredClone(person);

shallowPerson.address.city = "Porto Alegre";

deepPerson.address.city = "São Paulo";

console.log("Pessoa original:", person);
console.log("Cópia rasa:", shallowPerson);
console.log("Cópia profunda:", deepPerson);