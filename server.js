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

    app.post("/api/workouts", (req, res) => {
        db.Workout.create(req.body)
          .then(dbWorkout => {
            res.json(dbWorkout);
          })
          .catch(err => {
            res.json(err);
          });
      })

      app.get("/api/workouts", (req,res) => {
        db.Workout.aggregate([
        {
          $match: { } 
        },{
          $addFields: {
            totalDuration: { $sum: "$exercises.duration" }
          }
        }])
          .then(workout => {
            res.json(workout);
          })
          .catch(err => {
            res.json(err);
          });
      })

      app.get("/api/workouts/range", (req,res) => {
        db.Workout.aggregate([
          {
            $match: {}
          },{
            $sort: {day: -1}
          },{
            $limit: 7 
          },{
          $addFields: {
            totalWeight: { $sum: "$exercises.weight" },
            totalDuration: { $sum: "$exercises.duration" }
          }
        }])
        .then(workout => {
          res.json(workout);
        })
        .catch(err => {
          res.json(err);
        });
      })
      
      app.get("/exercise", (req, res) => {
        res.redirect("/exercise.html");
      });

      app.get("/stats", (req, res) => {
        res.redirect("/stats.html");
      });

      app.put("/api/workouts/:id", (req,res) => {
        db.Workout.updateOne(
          { _id: req.params.id },
          { $push: { exercises: req.body } },
          (error, success) => {
            if (error) {
              res.json(error);
            } else {
              res.json(success);
            }
          }
        );
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

app.listen(PORT,()=>{
    console.log(`App running on port ${PORT}!`);
})