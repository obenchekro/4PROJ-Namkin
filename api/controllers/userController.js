const User = require('../models/User');
const mongoose = require('mongoose');
const { loginWithToken } = require('../middleware/authentificationToken');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user && typeof user !== typeof object) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }
        res.status(200).json(user);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError && error.message.includes('ObjectId')) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
        }
    }
};

const createUser = async (req, res) => {
    try {
        const decodedPayload = await loginWithToken(req.headers['authorization']);
        const fetchUser = await User.findOne({ _id: decodedPayload._id });

        if (!fetchUser && typeof user !== typeof object) {
            return res.status(404).json({ message: 'The owner of this token does no longer exist.', status: "Error" });
        }

        if (!fetchUser.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized Access. You must be administrator to submit this changes.', status: "Error" });
        }

        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: "New user successfully added", user });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, status: "Error" });
        }
        else {
            if (error.code === 11000 && error.message.includes('duplicate key error')) {
                res.status(400).json({ message: "User with that email already exists", status: "Error" });
            } else {
                res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
                console.log(error);
            }
        }
    }
};

const deleteUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }

        if (!req.user.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized Access', status: "Error" });
        }

        await user.remove();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
    }
};

const updateUsernameById = async (req, res) => {
    const allowedUpdates = ['username'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates', status: "Error" });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }

        if (!req.user.isAdmin && req.user._id.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized Access', status: "Error" });
        }

        user.username = req.body.username;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
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
            return res.status(404).json({ message: 'User not found', status: "Error" });
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
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
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
            return res.status(404).json({ message: 'User not found', status: "Error" });
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
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
    }
};

const updateUserEmailById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }
        user.email = req.body.email;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
    }
};

const updateUserPasswordById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }
        user.password = req.body.password;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
    }
};

const updateUserIsAdminById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }
        user.isAdmin = req.body.isAdmin;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
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