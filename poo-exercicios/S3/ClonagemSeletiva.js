function cloneWithoutSensitive(object) {

    const sensitiveProperties = [
        "password",
        "ssn",
        "creditCard"
    ];

    function clone(value) {

        if (Array.isArray(value)) {
            return value.map(item => clone(item));
        }

        if (value !== null && typeof value === "object") {

            const result = {};

            for (const key in value) {

                if (sensitiveProperties.includes(key)) {
                    continue;
                }

                result[key] = clone(value[key]);
            }

            return result;
        }

        return value;
    }

    return clone(object);
}