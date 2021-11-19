const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const mongojs = require("mongojs");
const path = require("path")

const PORT = process.env.PORT || 3000;

const db = require("./models");
const { Workout, Exercise } = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", 
{ 
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex: true,
    useFindAndModify:true
 });
// POSTS

app.post("/api/workouts", (req, res)=>{
    console.log(req)
    db.Workout.create(req.body)
        .then(dbWorkout=>{
            res.json(dbWorkout)
        })
        .catch(err =>{
            res.json(err)
            console.log(err)
        })
})

app.post("/api/workouts", (req, res) => {
    const workout = req.body;
    console.log(workout);
    if (workout) {
        workout.day = new Date(new Date().setDate(new Date().getDate()));
        workout.exercises = [];
    }
    db.Workout.create(workout)
        .then((err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.json(data);
            }
        });
});

// GETS

app.get("/stats", (req,res)=>{
    res.sendFile(path.join(__dirname,"public/stats.html"))
})

app.get("/exercise", (req,res)=>{
    res.sendFile(path.join(__dirname,"public/exercise.html"))
})

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

app.get("/api/workouts/range", (req,res)=>{
    db.Workout.find().sort({_id:-1}).limit(8).exec((err, data)=>{
        if(err){
            res.send(err)
        } else res.json(data)
    })
})

// PUTS

// app.put("/api/workouts", (req,res)=>{
//     const workout = new Workout(req.body)
    
//     db.Workout.update(workout)
//         .then(dbWorkout=>{
//             res.json(dbWorkout)
//         })
//         .catch(err =>{
//             res.json(err)
//             console.log(err)
//         })
// })

 
app.put("/api/workouts/:id", (req,res)=>{
    db.Workout.findByIdAndUpdate(req.params.id, (err,data)=>{
        console.log("this is data: "+data)
        if(err){
            console.log(err)
          } else {
              res.send(data)
          }
    }).then(()=>{
        db.Workout.findById(req.params.id, (err, data)=>{
            let durationTotal = 0
            if(err){
                console.log(err)
                res.send(err)
            } else{
                for(let i = 0; i< data.exercises.length;i++){
                    durationTotal += data.exercises[i].duration
                }
            }
            const number = durationTotal
            db.Workout.updateOne(req.params.id, {$set:{durationTotal:number}}, (err, data)=>{
                if(err){
                    console.log(err)
                    res.send(err)
                }
                res.send(data)
                console.log(data)
            })
        })
    })
})

app.listen(PORT,()=>{
    console.log(`App running on port ${PORT}!`);
})