const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true
        },

        type: {
            type: String,
            required: true,
            enum: ["income", "expense"]
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        date: {
            type: Date,
            required: true,
            default: Date.now
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
            required: true
        }

    },

    { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;