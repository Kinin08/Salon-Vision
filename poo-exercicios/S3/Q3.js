const product = {
    id: 1,
    name: "Mouse",
    price: 89.90
};

const spreadProduct = { ...product };
const structuredProduct = structuredClone(product);
const jsonProduct = JSON.parse(JSON.stringify(product));

console.log("SPREAD:", spreadProduct);
console.log("STRUCTURED CLONE:", structuredProduct);
console.log("JSON:", jsonProduct);

const user = {
    name: "Carlos",

    calculateAge() {
        return 17;
    }
};

const spreadUser = { ...user };
const jsonUser = JSON.parse(JSON.stringify(user));

console.log("SPREAD - função:", typeof spreadUser.calculateAge);
console.log("JSON - função:", typeof jsonUser.calculateAge);


// ==========================================
// 3. OBJETO COM DATE
// ==========================================

const event = {
    name: "Aula de JavaScript",
    date: new Date("2026-10-03")
};

const spreadEvent = { ...event };
const structuredEvent = structuredClone(event);
const jsonEvent = JSON.parse(JSON.stringify(event));

console.log("SPREAD - Date:", spreadEvent.date);
console.log(
    "SPREAD - tipo:",
    spreadEvent.date instanceof Date
);

console.log("STRUCTURED - Date:", structuredEvent.date);
console.log(
    "STRUCTURED - tipo:",
    structuredEvent.date instanceof Date
);

console.log("JSON - Date:", jsonEvent.date);
console.log(
    "JSON - tipo:",
    jsonEvent.date instanceof Date
);


// ==========================================
// 4. OBJETO COM ANINHAMENTO
// ==========================================

const cart = {
    id: 10,

    customer: {
        name: "Maria"
    },

    items: [
        {
            name: "Teclado",
            quantity: 2
        }
    ]
};

const spreadCart = { ...cart };
const structuredCart = structuredClone(cart);
const jsonCart = JSON.parse(JSON.stringify(cart));

console.log(
    "Spread compartilha customer:",
    spreadCart.customer === cart.customer
);

console.log(
    "Structured compartilha customer:",
    structuredCart.customer === cart.customer
);

console.log(
    "JSON compartilha customer:",
    jsonCart.customer === cart.customer
);