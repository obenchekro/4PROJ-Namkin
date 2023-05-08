const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
    const payload = {
        _id: user._id,
        isAdmin: user.isAdmin,
    };
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
        expiresIn: process.env.SECRET_TOKEN_DURATION * 60,
    };
    return jwt.sign(payload, secret, options);
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401).send("No token found");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403).send("Invalid token, you're not authentifying with the right access.");
        }
        req.user = user;
        return next();
    });
}

function loginWithToken(bearerToken) {

    return new Promise((resolve, reject) => {
        const token = bearerToken.split(' ')[1];
        const base64Token = token.split(".")[1];
        const decodedValue = JSON.parse(Buffer.from(base64Token, "base64").toString("ascii"));
        const secret = process.env.ACCESS_TOKEN_SECRET;

        jwt.verify(token, secret, err => {
            if (err) {
                reject(new Error(err));
            }
            resolve(decodedValue);
        });
    });
}

module.exports = {
    generateAccessToken,
    authenticateToken,
    loginWithToken
};