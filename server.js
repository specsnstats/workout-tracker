const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const mongojs = require("mongojs");

const PORT = process.env.PORT || 3000;

const db = require("./models");
const { Workout, Exercise } = require("./models");

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
    db.Workout.find({})
    .then(dbWorkout =>{
        res.json(dbWorkout)
    })
    .catch(err=>{
        res.json(err)
    })
})

app.put("/api/workouts", (req,res)=>{
    const workout = new Workout(req.body)
    
    Workout.update(workout)
        .then(dbWorkout=>{
            res.json(dbWorkout)
        })
        .catch(err =>{
            res.json(err)
            console.log(err)
        })
})

app.put("/api/workouts/:id", (req,res)=>{
    db.Workout.create({_id:mongojs.ObjectId(req.params.id)}, (err,data)=>{
        console.log("this is data: "+data)
        if(err){
            console.log(err)
          } res.json(data)
    })
})

app.listen(PORT,()=>{
    console.log(`App running on port ${PORT}!`);
})