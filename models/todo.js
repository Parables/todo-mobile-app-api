//import the mongoose package
import mongoose from 'mongoose';
// unpack Schema & model from mongoose
const {Schema, model} = mongoose;
// the Schema defines the structure of our Collection(Table) in MongoDB
// the model defines how data will modeled for our collection 
// and comes along with built in features  to manipulate the data

// create a new Schema instance specifying which
// fields(columns) we want in our Collection(Table)
const todoSchema = Schema({
    title: String,
    description: String,
    date: String,
    time: String,
    isCompleted: Boolean
});


// then we make a model 
// by passing in the name and a schema for our model
export const Todo = model('todo',todoSchema );

