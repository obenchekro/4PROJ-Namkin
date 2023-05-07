const User = require('../models/User');
const { generateAccessToken } = require('../middleware/authentificationToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const getAuthentificationToken = async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) return res.status(400).json({ message: 'Username and password are required' });
        const user = await User.findOne({ username: req.body.username });
        if (!user && typeof user !== typeof object) return res.status(400).json({ message: 'Username or password is incorrect' });
        
        bcrypt.compare(req.body.password, user.password, (err, match) => {
            if (err) console.log(err);
            if (!match) {
                return res.status(400).json({ message: 'Username or password is incorrect' });
            }
            else {
                const accessToken = generateAccessToken(user);

                res.status(200).json({
                    loginSession: req.body.username,
                    token: {
                        accessToken,
                        message: "User authorized successfully",
                        status: "Success",
                        issuedAt: new Date(),
                        expiresIn: new Date(jwt.decode(accessToken).exp * 1000)
                    }
                });
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.' });
    }
};

module.exports = { getAuthentificationToken };