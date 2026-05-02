const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (e) {
        return res.status(400).json({
            status: 400,
            message: "Validation Error",
            errors: e.errors.map(err => ({ path: err.path, message: err.message }))
        });
    }
};

module.exports = validate;