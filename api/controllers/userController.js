const User = require('../models/User');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.' });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.' });
    }
};

const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.' });
    }
};

const deleteUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!req.user.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized Access' });
        }

        await user.remove();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.' });
    }
};

const updateUsernameById = async (req, res) => {
    const allowedUpdates = ['username'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!req.user.isAdmin && req.user._id.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized Access' });
        }

        user.username = req.body.username;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.' });
    }
};

const updateFirstNameById = async (req, res) => {
    const allowedUpdates = ['firstName'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!req.user.isAdmin && req.user._id.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized Access' });
        }

        user.firstName = req.body.firstName;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.' });
    }
};

const updateLastNameById = async (req, res) => {
    const allowedUpdates = ['lastName'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!req.user.isAdmin && req.user._id.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized Access' });
        }

        user.lastName = req.body.lastName;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.' });
    }
};

const updateUserEmailById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.email = req.body.email;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.' });
    }
};

const updateUserPasswordById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.password = req.body.password;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.' });
    }
};

const updateUserIsAdminById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.isAdmin = req.body.isAdmin;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    deleteUserById,
    updateUsernameById,
    updateFirstNameById,
    updateLastNameById,
    updateUserEmailById,
    updateUserPasswordById,
    updateUserIsAdminById
};