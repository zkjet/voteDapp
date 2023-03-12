// returns the methods for any given object, useful for inspecting somethign while coding
const getMethods = (obj) => {
    let properties = new Set();
    let currentObj = obj;
    do {
        Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
    } while ((currentObj = Object.getPrototypeOf(currentObj)));
    return [...properties.keys()].filter((item) => typeof obj[item] === "function");
};

export { getMethods };
