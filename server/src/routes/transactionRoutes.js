const express = require("express");

const {getTransactions , createTransaction , getTransaction , updateTransaction, deleteTransaction} = require("../controllers/transactionController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/transactions" , authMiddleware , getTransactions);
router.get("/transactions/:id" , authMiddleware , getTransaction);

router.post("/transactions" , authMiddleware , createTransaction);

router.patch("/transactions/:id" , authMiddleware , updateTransaction);

router.delete("/transactions/:id" , authMiddleware , deleteTransaction);


module.exports = router;