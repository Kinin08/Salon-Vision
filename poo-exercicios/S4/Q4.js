const admin = {
    name: "Carlos",
    role: "admin",
    permissions: ["read", "write", "delete"]
};

const editor = Object.seal({
    name: "Ana",
    role: "editor",
    permissions: ["read", "write"]
});

const reader = Object.freeze({
    name: "João",
    role: "reader",
    permissions: ["read"]
});