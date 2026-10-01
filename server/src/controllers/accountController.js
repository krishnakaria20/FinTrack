const Account = require("../models/accountSchema");

const createAccount = async (req, res) => {
    try {
        const { name, type, balance } = req.body;

        if (!name || !type) {
            return res.status(400).json({
                success: false,
                message: "Name and type are required"
            });
        }

        const account = await Account.create({
            name,
            type,
            balance: balance || 0,
            user: req.user
        });

        res.status(201).json({
            success: true,
            data: account
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({
            user: req.user
        });

        res.status(200).json({
            success: true,
            count: accounts.length,
            data: accounts
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch accounts"
        });
    }
};

const updateAccount = async (req, res) => {
    try {
        const { name, type, balance } = req.body;

        const account = await Account.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user
            },
            {
                name,
                type,
                balance
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        res.status(200).json({
            success: true,
            data: account
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const account = await Account.findOneAndDelete({
            _id: req.params.id,
            user: req.user
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {createAccount , getAccounts , updateAccount , deleteAccount};