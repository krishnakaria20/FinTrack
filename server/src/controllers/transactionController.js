const Transaction = require("../models/transactionSchema");
const Account = require("../models/accountSchema");


// GET ALL TRANSACTIONS
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            user: req.user
        });

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch transactions"
        });
    }
};


// CREATE TRANSACTION
const createTransaction = async (req, res) => {
    try {
        const { amount, type, category, description, date, account } = req.body;

        if (!amount || !type || !category || !description || !account) {
            return res.status(400).json({
                success: false,
                message: "Amount, type, category, description and account are required fields"
            });
        }

        // Check whether the account belongs to the logged-in user
        const userAccount = await Account.findOne({
            _id: account,
            user: req.user
        });

        if (!userAccount) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        if (type === "expense") {
            userAccount.balance -= amount;
        }

        if (type === "income") {
            userAccount.balance += amount;
        }

        await userAccount.save();


        const transaction = await Transaction.create({
            amount,
            type,
            category,
            description,
            date,
            account,
            user: req.user
        });

        res.status(201).json({
            success: true,
            data: transaction
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};


// GET ONE TRANSACTION
const getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            success: true,
            data: transaction
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};


// UPDATE TRANSACTION
const updateTransaction = async (req, res) => {
    try {
        const {
            amount,
            type,
            category,
            description,
            date,
            account
        } = req.body;

        // 1. Find the existing transaction
        const oldTransaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!oldTransaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        // 2. Find the new account
        const newAccount = await Account.findOne({
            _id: account,
            user: req.user
        });

        if (!newAccount) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        // 3. Find the old account
        const oldAccount = await Account.findOne({
            _id: oldTransaction.account,
            user: req.user
        });

        if (!oldAccount) {
            return res.status(404).json({
                success: false,
                message: "Old account not found"
            });
        }

        // 4. Reverse the old transaction
        if (oldTransaction.type === "expense") {
            oldAccount.balance += oldTransaction.amount;
        }

        if (oldTransaction.type === "income") {
            oldAccount.balance -= oldTransaction.amount;
        }

        // 5. Apply the new transaction
        if (type === "expense") {
            newAccount.balance -= amount;
        }

        if (type === "income") {
            newAccount.balance += amount;
        }

        // 6. Save account balances
        await oldAccount.save();

        if (oldAccount._id.toString() !== newAccount._id.toString()) {
            await newAccount.save();
        }

        // 7. Update the transaction
        oldTransaction.amount = amount;
        oldTransaction.type = type;
        oldTransaction.category = category;
        oldTransaction.description = description;
        oldTransaction.date = date;
        oldTransaction.account = account;

        const transaction = await oldTransaction.save();

        // 8. Send response
        res.status(200).json({
            success: true,
            data: transaction
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};


// DELETE TRANSACTION
// DELETE TRANSACTION
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        const account = await Account.findOne({
            _id: transaction.account,
            user: req.user
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        // Reverse the transaction's effect
        if (transaction.type === "expense") {
            account.balance += transaction.amount;
        }

        if (transaction.type === "income") {
            account.balance -= transaction.amount;
        }

        await account.save();

        await Transaction.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Transaction deleted successfully"
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};


module.exports = {
    getTransactions,
    createTransaction,
    getTransaction,
    updateTransaction,
    deleteTransaction
};