const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization)
            throw new Error("Debe enviar un token de autorización");

        const [authType, token] = authorization.trim().split(" ");
        if (authType !== "Bearer") throw new Error("Se esperaba un token Bearer");

        jwt.verify(token, process.env.SECRET_KEY, (error, _) => {
            if (error) {
                throw error;
            } else {
                next();
            }
        });
    } catch (error) {
        return res.status(401).json({ ok: false, error });
    }
};

module.exports = {
    verifyToken,
};