const express = require("express");
const userRouter = require("./user");
const accountRouter = require("./account");
const { authMiddleware } = require("../middleware");
const { account } = require("../db");
const { default: mongoose } = require("mongoose");

const router = express.Router();

router.use("/user", userRouter);
router.use("/account", accountRouter);

router.get("/balance", authMiddleware, async (req, res) =>{
    const account = await account.findOne({
        userId: req.userId
    })

    res.json({
        balance: account.balance
    })
})


router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const {amount, to} = req.body;

    const Account = await account.findOne({userId: req.userId}).session(session);

    if(!Account || Account.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        })
    }

    const toAccount = await account.findOne({userId: to}).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        })
    }

    await account.updateOne({userId: req.userId}, {$inc: {balance: -amount}}).session(session);
    await account.updateOne({userId: to}, {$inc: {balance: amount}}).session(session);

    await session.commitTransaction();
    

    res.json({
        message: "Transfer success"
    })

   
})
 
module.exports = router;