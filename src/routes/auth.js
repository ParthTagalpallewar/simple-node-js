const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/User");

const router = express.Router();


// SIGNUP
router.post("/signup", async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;


        if (!username || !password) {

            return res.status(400).json({
                message:
                    "Username and password are required"
            });

        }


        const existingUser =
            await User.findOne({ username });


        if (existingUser) {

            return res.status(409).json({
                message:
                    "Username already exists"
            });

        }


        const hashedPassword =
            await bcrypt.hash(password, 10);


        const user =
            await User.create({

                username: username,

                password: hashedPassword

            });


        res.status(201).json({

            message:
                "User created successfully",

            user: {

                id: user._id,

                username: user.username

            }

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server error"

        });

    }

});


// LOGIN
router.post("/login", async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;


        if (!username || !password) {

            return res.status(400).json({

                message:
                    "Username and password are required"

            });

        }


        const user =
            await User.findOne({ username });


        if (!user) {

            return res.status(401).json({

                message:
                    "Invalid username or password"

            });

        }


        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    "Invalid username or password"

            });

        }


        // Create login session
        req.session.userId =
            user._id.toString();


        res.json({

            message:
                "Login successful"

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server error"

        });

    }

});


// LOGOUT
router.post("/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            return res.status(500).json({

                message:
                    "Could not logout"

            });

        }


        res.clearCookie("connect.sid");


        res.json({

            message:
                "Logout successful"

        });

    });

});


module.exports = router;