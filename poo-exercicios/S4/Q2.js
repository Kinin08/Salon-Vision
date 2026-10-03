const normalConfig = {
    name: "Sistema",
    version: "1.0"
};

const restrictedConfig = {
    name: "Sistema",
    version: "1.0"
};

Object.preventExtensions(restrictedConfig);

restrictedConfig.version = "2.0";
delete restrictedConfig.name;
const sealedConfig = {
    name: "Sistema",
    version: "1.0"
};

Object.seal(sealedConfig);

sealedConfig.version = "2.0";

const frozenConfig = {
    name: "Sistema",
    version: "1.0"
};

Object.freeze(frozenConfig);