const mongoose = require("mongoose");

const accountSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            required: true,
            enum: ["bank", "cash"]
        },

        balance: {
            type: Number,
            required: true,
            default: 0
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },

    { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;