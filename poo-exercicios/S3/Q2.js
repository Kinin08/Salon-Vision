const user = {
    name: "Carlos",
    birthdate: new Date("2009-05-15"),

    calculateAge() {
        const today = new Date();

        return today.getFullYear() - this.birthdate.getFullYear();
    },

    phone: undefined
};

const clonedUser = JSON.parse(JSON.stringify(user));

console.log("Original:", user);
console.log("Clone:", clonedUser);

console.log("Original birthdate:", user.birthdate);
console.log("Clone birthdate:", clonedUser.birthdate);

console.log("Original calculateAge:", typeof user.calculateAge);
console.log("Clone calculateAge:", typeof clonedUser.calculateAge);

console.log("Original phone:", user.phone);
console.log("Clone phone:", clonedUser.phone);