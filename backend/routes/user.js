const express = require("express");

const router = express.Router();
const {User} = require("../db");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const {authMiddleware} = require("./middleware");
const { route } = require("./user");

const updateBody = zod.object({
    username: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
})

route.put("/", authMiddleware, async(req, res) => {
    const {success} = updateBody.safeParse(req.body)
    if(!success){
        res.status(411).json({
            message: "Error while uploading information"
        })
    }

    await User.updateOne({_id:req.userId}, req.body);

    res.json({
        message: "user updated successfully"
    })
})


const signupbody = zod.object({
    username: zod.string().email(),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string()
}) 

router.post("/signup", async(req, res) => {
    const {success} = signupbody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message:"Email already taken/Incorrect Inputs"
        })
    }

    const existinguser = await User.findOne({
        username: req.body.username
    })

    if(existinguser){
        return res.status(411).json({
            message: "Email already taken/Incorrect Inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    })
    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "user created successfully",
        token: token
    })
})

const signinbody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
})  

router.post("/signin", async(req, res) =>{
    const {success} = signinbody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message: "Incorrect Inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if(user){
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
        return;
    }
    res.status(411).json({
        message: "Error while login"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstname: {
                "$regex":filter
            }
        }, {
            lastname:{
                "regex": filter
            }
        }]
    })

    res.json({
        user:users.map(user =>({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    })
})


module.exports = router;