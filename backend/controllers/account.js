const { default: mongoose } = require("mongoose");
const Account = require("../models/account");

exports.getBalance = async (req, res) => {
  try {
    const userId = req.userId;

    const account = await Account.findOne({ userId: userId });

    res.status(200).json({
      balance: account.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.transferBalance = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const { amount, to } = req.body;

    if (amount <= 0) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "Amount cannot be negative/Zero" });
    }

    const account = await Account.findOne({ userId: req.userId }).session(
      session
    );
    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid account" });
    }

    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    session.commitTransaction();

    res.status(200).json({
      message: "Transfer successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
