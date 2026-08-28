const config = {};

Object.defineProperty(config, 'version', {
    value: '1.0.0',
    writable: false,
    enumerable: true,
    configurable: true
});

Object.defineProperty(config, 'apiKey', {
    value: 'abc123-secret-key',
    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(config, 'mode', {
    value: 'production',
    writable: true,
    enumerable: true,
    configurable: false
});

try {
    config.version = '2.0.0';
} catch (error) {
    console.log("Não foi possível alterar version.");
}

console.log(config.version);

for (const key in config) {
    console.log(key);
}

try {
    delete config.mode;
} catch (error) {
    console.log("Não foi possível excluir mode.");
}

console.log(config.mode);