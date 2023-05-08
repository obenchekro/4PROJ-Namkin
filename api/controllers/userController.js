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
        }
    }
};

const deleteManyUsers = async (req, res) => {
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

        const usernames = req.body.map(obj => obj.username);
        const users = await User.find({ username: { $in: usernames } });

        if (!users || !Array.isArray(users) || users.length === 0) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }

        await User.deleteMany({ username: { $in: usernames } });
        res.status(200).json({ message: "Users successfully deleted", status: "Success", users });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
    }
};

const updateUsernameById = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const decodedPayload = await loginWithToken(authHeader);
    const fetchUser = await User.findOne({ _id: decodedPayload._id });

    if (!fetchUser && typeof fetchUser !== typeof object) {
        return res.status(404).json({ message: 'The owner of this token does no longer exist.', status: "Error" });
    }

    if (!fetchUser.isAdmin) {
        return res.status(401).json({ message: 'Unauthorized Access. You must be administrator to submit this changes.', status: "Error" });
    }

    const allowedUpdates = ['username'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates', status: "Error" });
    }

    try {
        const userFetched = await User.findById(req.params.id);
        if (!userFetched && typeof userFetched !== typeof object && req.user._id.toString() !== userFetched._id.toString()) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }
        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { username: req.body.username } },
            { new: true, runValidators: false }
        );

        res.status(200).json({ message: "User successfully updated", status: "Success", user });

    } catch (error) {
        if (error instanceof mongoose.Error.CastError && error.message.includes('ObjectId')) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }
        else {
            if (error.code === 11000 && error.message.includes('duplicate key error')) {
                res.status(400).json({ message: "That username already exists.", status: "Error" });
            } else {
                res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
            }
        }
    }
};

const updateFirstNameById = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const decodedPayload = await loginWithToken(authHeader);
    const fetchUser = await User.findOne({ _id: decodedPayload._id });

    if (!fetchUser && typeof fetchUser !== typeof object) {
        return res.status(404).json({ message: 'The owner of this token does no longer exist.', status: "Error" });
    }

    if (!fetchUser.isAdmin) {
        return res.status(401).json({ message: 'Unauthorized Access. You must be administrator to submit this changes.', status: "Error" });
    }

    const allowedUpdates = ['firstName'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates', status: "Error" });
    }

    try {
        const userFetched = await User.findById(req.params.id);
        if (!userFetched && typeof userFetched !== typeof object && req.user._id.toString() !== userFetched._id.toString()) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }
        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { firstName: req.body.firstName } },
            { new: true, runValidators: false }
        );

        res.status(200).json({ message: "User successfully updated", status: "Success", user });

    } catch (error) {
        if (error instanceof mongoose.Error.CastError && error.message.includes('ObjectId')) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
    }
};

const updateLastNameById = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const decodedPayload = await loginWithToken(authHeader);
    const fetchUser = await User.findOne({ _id: decodedPayload._id });

    if (!fetchUser && typeof fetchUser !== typeof object) {
        return res.status(404).json({ message: 'The owner of this token does no longer exist.', status: "Error" });
    }

    if (!fetchUser.isAdmin) {
        return res.status(401).json({ message: 'Unauthorized Access. You must be administrator to submit this changes.', status: "Error" });
    }

    const allowedUpdates = ['lastName'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates', status: "Error" });
    }

    try {
        const userFetched = await User.findById(req.params.id);
        if (!userFetched && typeof userFetched !== typeof object && req.user._id.toString() !== userFetched._id.toString()) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }
        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { lastName: req.body.lastName } },
            { new: true, runValidators: false }
        );

        res.status(200).json({ message: "User successfully updated", status: "Success", user });

    } catch (error) {
        if (error instanceof mongoose.Error.CastError && error.message.includes('ObjectId')) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }
        res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
    }
};

const updateUserEmailById = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const decodedPayload = await loginWithToken(authHeader);
    const fetchUser = await User.findOne({ _id: decodedPayload._id });

    if (!fetchUser && typeof fetchUser !== typeof object) {
        return res.status(404).json({ message: 'The owner of this token does no longer exist.', status: "Error" });
    }

    if (!fetchUser.isAdmin) {
        return res.status(401).json({ message: 'Unauthorized Access. You must be administrator to submit this changes.', status: "Error" });
    }

    const allowedUpdates = ['email'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates', status: "Error" });
    }

    try {
        const userFetched = await User.findById(req.params.id);
        if (!userFetched && typeof userFetched !== typeof object && req.user._id.toString() !== userFetched._id.toString()) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }
        const emailValidator = User.schema.path('email').validators.find(v => v.validator.name === 'validator');
        const isEmail = eval(emailValidator.validator.toString());

        if (!isEmail(req.body.email)) {
            return res.status(400).json({ message: "Invalid email format.", status: "Error" });
        }

        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { email: req.body.email } },
            { new: true, runValidators: false }
        );

        res.status(200).json({ message: "User successfully updated", status: "Success", user });

    } catch (error) {
        if (error instanceof mongoose.Error.CastError && error.message.includes('ObjectId')) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }
        else {
            if (error.code === 11000 && error.message.includes('duplicate key error')) {
                res.status(400).json({ message: "That email already exists.", status: "Error" });
            } else {
                console.log(error)
                res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
            }
        }
    }
};

const updateUserPasswordById = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const decodedPayload = await loginWithToken(authHeader);
    const fetchUser = await User.findOne({ _id: decodedPayload._id });

    if (!fetchUser && typeof fetchUser !== typeof object) {
        return res.status(404).json({ message: 'The owner of this token does no longer exist.', status: "Error" });
    }

    if (!fetchUser.isAdmin) {
        return res.status(401).json({ message: 'Unauthorized Access. You must be administrator to submit this changes.', status: "Error" });
    }

    const allowedUpdates = ['password'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates', status: "Error" });
    }

    try {
        const userFetched = await User.findById(req.params.id);
        if (!userFetched && typeof userFetched !== typeof object && req.user._id.toString() !== userFetched._id.toString()) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }
        const passwordValidator = User.schema.path('password').validators.find(v => v.validator.name === 'validator');
        const isPassword = eval(passwordValidator.validator.toString());

        if (!isPassword(req.body.password)) {
            return res.status(400).json({ message: "Invalid password format.", status: "Error" });
        }

        passwordHashed = await hashPassword(req.body.password);
        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { password: passwordHashed } },
            { new: true, runValidators: false }
        );

        res.status(200).json({ message: "User successfully updated", status: "Success", user });

    } catch (error) {
        if (error instanceof mongoose.Error.CastError && error.message.includes('ObjectId')) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }
        else {
            console.log(error)
            res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
        }
    }
};

const updateUserIsAdminById = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const decodedPayload = await loginWithToken(authHeader);
    const fetchUser = await User.findOne({ _id: decodedPayload._id });

    if (!fetchUser && typeof fetchUser !== typeof object) {
        return res.status(404).json({ message: 'The owner of this token does no longer exist.', status: "Error" });
    }

    if (!fetchUser.isAdmin) {
        return res.status(401).json({ message: 'Unauthorized Access. You must be administrator to submit this changes.', status: "Error" });
    }

    const allowedUpdates = ['isAdmin'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates', status: "Error" });
    }

    try {
        const userFetched = await User.findById(req.params.id);
        if (!userFetched && typeof userFetched !== typeof object) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }

        if (req.user._id.toString() === userFetched._id.toString()) {
            return res.status(400).json({ message: "You're administrator and you cannot modify your own role yourself.", status: "Error" });
        }

        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { isAdmin: req.body.isAdmin } },
            { new: true, runValidators: false }
        );

        res.status(200).json({ message: "User successfully updated", status: "Success", user });

    } catch (error) {
        if (error instanceof mongoose.Error.CastError && error.message.includes('ObjectId')) {
            return res.status(404).json({ message: 'User not found', status: "Error" });
        }
        else {
            if (error instanceof mongoose.Error.CastError && error.message.includes('Boolean')) {
                return res.status(404).json({ message: 'Invalid type. isAdmin must be a boolean.', status: "Error" });
            }
            else {
                res.status(500).json({ message: 'Internal Server Error, we might patch up all of this occasional error later on.', status: "Error" });
            }
        }
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    createManyUsers,
    deleteUserById,
    deleteManyUsers,
    updateUsernameById,
    updateFirstNameById,
    updateLastNameById,
    updateUserEmailById,
    updateUserPasswordById,
    updateUserIsAdminById
};