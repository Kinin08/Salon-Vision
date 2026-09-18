const original = {
    name: "Welygton",

    address: {
        city: "Charqueadas"
    },

    birthdate: new Date("2000-01-01"),

    calculateAge: function () {
        return 26;
    }
};

const spreadCopy = {
    ...original
};

const objectForStructuredClone = {
    name: original.name,

    address: {
        ...original.address
    },

    birthdate: original.birthdate
};

const structuredCopy = structuredClone(objectForStructuredClone);

const jsonCopy = JSON.parse(JSON.stringify(original));

console.log("========== ORIGINAL ==========");
console.log(original);

console.log("========== SPREAD ==========");
console.log(spreadCopy);

console.log("========== STRUCTURED CLONE ==========");
console.log(structuredCopy);

console.log("========== JSON ==========");
console.log(jsonCopy);

console.log("========== COMPARAÇÕES ==========");

console.log(
    "Spread mantém Date:",
    spreadCopy.birthdate instanceof Date
);

console.log(
    "StructuredClone mantém Date:",
    structuredCopy.birthdate instanceof Date
);

console.log(
    "JSON mantém Date:",
    jsonCopy.birthdate instanceof Date
);


console.log(
    "Spread mantém função:",
    typeof spreadCopy.calculateAge === "function"
);

console.log(
    "JSON mantém função:",
    typeof jsonCopy.calculateAge === "function"
);

console.log("========== OBJETOS ANINHADOS ==========");

console.log(
    "Spread compartilha address:",
    original.address === spreadCopy.address
);

console.log(
    "StructuredClone compartilha address:",
    original.address === structuredCopy.address
);