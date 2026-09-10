require("dotenv").config();

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const authMiddleware =
    require("./middleware/auth");


const app = express();


// MongoDB
connectDB();


// Parse JSON
app.use(express.json());


// Session
app.use(
    session({

        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        }),

        cookie: {

            httpOnly: true,

            maxAge: 1000 * 60 * 60

        }

    })
);


// API routes
app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/tasks",
    authMiddleware,
    taskRoutes
);


// Login page
app.get("/login", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "pages",
            "login.html"
        )
    );

});


// Signup page
app.get("/signup", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "pages",
            "signup.html"
        )
    );

});


// Home page
app.get("/", (req, res) => {

    if (!req.session.userId) {

        return res.redirect("/login");

    }

    res.sendFile(
        path.join(
            __dirname,
            "pages",
            "home.html"
        )
    );

});


// Start server
app.listen(
    process.env.PORT,   

    () => {

        console.log(
            `Server running on http://localhost:3000`
        );

    }
);

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});