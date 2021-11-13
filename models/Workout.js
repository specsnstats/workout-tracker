const mongoose = require("mongoose");
const Schema = mongoose.Schema

const WorkoutSchema = new Schema({
    title: {
        type: String,
    },
    body: Array
})

const Workout = mongoose.model("Workout", WorkoutSchema)

module.exports = Workout