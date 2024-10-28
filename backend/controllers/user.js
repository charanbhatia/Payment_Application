const Zod = require("zod");
const User = require("../models/user");

const updateData = Zod.object({
  firstname: Zod.string().optional(),
  lastname: Zod.string().optional(),
  password: Zod.string()
    .min(6, "Password must be at least 6 characters long")
    .optional(),
});

exports.updateCredentials = async (req, res) => {
  try {
    const validatedInputs = updateData.safeParse(req.body);

    if (!validatedInputs.success) {
      return res
        .status(411)
        .json({ message: "Error while updating information" });
    }

    const userId = req.userId;

    await User.updateOne({ _id: userId }, req.body);

    res.status(200).json({
      message: "user updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.searchFriend = async (req, res) => {
  try {
    const filter = req.query.filter || "";
    const userId = req.userId;

    const users = await User.find({
      $or: [
        {
          firstname: {
            $regex: filter,
          },
        },
        {
          lastname: {
            $regex: filter,
          },
        },
      ],
    });

    // return res
    res.status(200).json({
      user: users
        .filter((user) => user._id.toString() !== userId.toString())
        .map((user) => ({
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          _id: user._id,
        })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      currentUser: {
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
