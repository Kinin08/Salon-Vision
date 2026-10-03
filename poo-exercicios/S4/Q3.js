function deepFreeze(object) {
    const properties = Object.getOwnPropertyNames(object);

    for (const property of properties) {

        const value = object[property];

        if (value !== null && typeof value === "object") {
            deepFreeze(value);
        }
    }

    return Object.freeze(object);
}
const user = {
    name: "Ana",

    address: {
        city: "Charqueadas",

        location: {
            country: "Brasil"
        }
    }
};

deepFreeze(user);