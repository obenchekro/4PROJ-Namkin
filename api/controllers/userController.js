const { User, hashPassword } = require('../models/User');
const mongoose = require('mongoose');
const { loginWithToken } = require('../middleware/authentificationToken');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ status: "Success", users });
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
        res.status(200).json({ status: "Success", user });
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
        const authHeader = req.headers['authorization'];
        const decodedPayload = await loginWithToken(authHeader);
        const fetchUser = await User.findOne({ _id: decodedPayload._id });

        if (!fetchUser && typeof fetchUser !== typeof object) {
            return res.status(404).json({ message: 'The owner of this token does no longer exist.', status: "Error" });
        }

        if (!fetchUser.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized Access. You must be administrator to submit this changes.', status: "Error" });
        }

        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: "New user successfully added", status: "Success", user });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, status: "Error" });
        }

        if (error.name === 'ReferenceError') {
            return res.status(404).json({ message: 'The owner of this token does no longer exist.', status: "Error" });
        }
        else {
            if (error.code === 11000 && error.message.includes('duplicate key error')) {
                res.status(400).json({ message: "User with that username or email already exists", status: "Error" });
            } else {
                res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
            }
        }
    }
};

const createManyUsers = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const decodedPayload = await loginWithToken(authHeader);
        const fetchUser = await User.findOne({ _id: decodedPayload._id });

         if (!fetchUser && typeof fetchUser !== typeof object) {
             console.log(error)
             return res.status(404).json({ message: 'The owner of this token does no longer exist.', status: "Error" });
         }

        if (!fetchUser.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized Access. You must be administrator to submit this changes.', status: "Error" });
        }

        const users = req.body;
        for (const user of users) user.password = await hashPassword(user.password);
        await User.insertMany(users.map((user) => ({ ...user })));
        res.status(201).json({ message: "New users successfully added", status: "Success", users });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, status: "Error" });
        }

        if (error.name === 'ReferenceError') {
            return res.status(404).json({ message: 'The owner of this token does no longer exist.', status: "Error" });
        }
        else {
            if (error.code === 11000 && error.message.includes('duplicate key error')) {
                res.status(400).json({ message: "User with that username or email already exists", status: "Error" });
            } else {
                res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
            }
        }
    }
};

const deleteUserById = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const decodedPayload = await loginWithToken(authHeader);
        const fetchUser = await User.findOne({ _id: decodedPayload._id });

        if (!fetchUser && typeof fetchUser !== typeof object) {
            return res.status(404).json({ message: 'The owner of this token does no longer exist.', status: "Error" });
        }

        if (!fetchUser.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized Access. You must be administrator to submit this changes.', status: "Error" });
        }

        const user = await User.findById(req.params.id);
        if (!user && typeof user !== typeof object) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User successfully deleted", status: "Success", user });

    } catch (error) {
        if (error instanceof mongoose.Error.CastError && error.message.includes('ObjectId')) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
            console.log(error);
        }
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
        res.status(200).json({ status: "Success", user });
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
    createManyUsers,
    deleteUserById,
    updateUsernameById,
    updateFirstNameById,
    updateLastNameById,
    updateUserEmailById,
    updateUserPasswordById,
    updateUserIsAdminById
};