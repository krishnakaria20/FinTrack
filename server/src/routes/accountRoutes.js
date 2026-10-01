const express = require("express");

const { createAccount , getAccounts , updateAccount , deleteAccount } = require("../controllers/accountController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/accounts", authMiddleware, createAccount);
router.get("/accounts" , authMiddleware , getAccounts);

router.patch("/accounts/:id" , authMiddleware , updateAccount);
router.delete("/accounts/:id" , authMiddleware , deleteAccount);

module.exports = router;