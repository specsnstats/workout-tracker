const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require('path');


const PORT = process.env.PORT || 3000;

const db = require("./models");
const { Workout } = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

app.get("/:file", (req,res)=>{
    res.sendFile(__dirname + "\\public\\" + req.params.file + ".html");
});

// finish after i have added the POST ROUTES
app.get("/api/workouts", (req,res)=>{
    db.workout.find({})
    .then(dbWorkout =>{
        res.json(dbWorkout)
    })
    .catch(err=>{
        res.json(err)
    })
})

app.listen(PORT,()=>{
    console.log(`App running on port ${PORT}!`);
})
