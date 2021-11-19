const mongoose = require("mongoose");
const Schema = mongoose.Schema

const WorkoutSchema = new Schema({
    exercises: [{
        type: {
            type: String
        },
        name: {
            type: String,
        },
        duration: Number,
        distance: Number, 
        weight: Number,
        reps: Number,
        sets: Number
    }],
    day: {
        type: Date,
        default: Date.now
    },
})

const Workout = mongoose.model("Workout", WorkoutSchema)

module.exports = Workout