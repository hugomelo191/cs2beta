export const getParam = (req, key) => {
    const value = req.params?.[key];
    if (!value) {
        throw new Error(`Missing required parameter: ${key}`);
    }
    return value;
};
export const getQuery = (req, key) => {
    return req.query?.[key];
};
export const getQueryInt = (req, key, defaultValue) => {
    const value = req.query?.[key];
    return value ? parseInt(value) : (defaultValue || 0);
};
export const getBody = (req) => {
    return req.body;
};
//# sourceMappingURL=requestHelpers.js.map