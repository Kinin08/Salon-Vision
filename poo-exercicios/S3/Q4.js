function cloneWithoutSensitive(object) {
    const clone = structuredClone(object);

    delete clone.password;
    delete clone.ssn;
    delete clone.creditCard;

    return clone;
}
const user = {
    name: "Carlos",
    email: "carlos@email.com",
    password: "123456",
    ssn: "123.456.789-00",
    creditCard: "5555-5555-5555-5555",
    address: {
        city: "Charqueadas"
    }
};

const safeUser = cloneWithoutSensitive(user);

console.log("Original:", user);
console.log("Cópia segura:", safeUser);