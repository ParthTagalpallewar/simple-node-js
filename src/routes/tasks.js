const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

    res.json({
        message: "You are authenticated!",
        userId: req.session.userId
    });

});

module.exports = router;