const User = require('../models/User');
const { generateAccessToken } = require('../middleware/authentificationToken');
const bcrypt = require('bcryptjs');

const getAuthentificationToken = async (req, res) => {
    try {
        if (req.body.username && !req.body.password) return res.status(400).json({ message: 'Username and password are required' });
        const user = await User.findOne({ username: req.body.username });
        if (!user && typeof user !== typeof object) return res.status(400).json({ message: 'Username or password is incorrect' });
        bcrypt.compare(req.body.password, user.password, (err, match) => {
            if (err) throw new Error(`Unexpected error comitted in ${err}`);
            if (!match) {
                return res.status(400).json({ message: 'Username or password is incorrect' });
            }
            else {
                const accessToken = generateAccessToken(user);
                res.status(200).json({ accessToken, message: "Success", issuedAt: new Date() });
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.' });
    }
};

module.exports = { getAuthentificationToken };