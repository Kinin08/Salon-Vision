const config = {
    version: "1.0.0",
    apiKey: "a1b2c3d4e5f6g7h8i9j0",
    mode: "development",
}

Object.defineProperty(config, "version", {
    writable: false
});
config.version = "2.0.0";
console.log("config version: " + config.version);

Object.defineProperty(config, "apiKey", {
    enumerable: false
});
for (const key in config) {
    console.log("key: " + key);
}
Object.defineProperty(config, "mode", {
    configurable: false
});
delete config.mode;

console.log("config mode: " + config.mode);