// import the express package
import express, { response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Todo } from "./models/todo.js";

dotenv.config();

// create an instance of express
const app = express();

app.use(express.json());

// create a variable for our PORT number
const PORT = process.env.PORT ?? 5432;

// create routes to make request to the serve
app.get("/", async (req, res) => res.send("Hello World"));

// create routes to make request to the serve
app.get("/todos", async (req, res) => {
  const result = await Todo.find({});
  res.json(result);
});

// make the handler an async function by adding the async keyword
app.post("/todo", async (req, res) => {
  // extract the necessary fields from the body
  const { title, description, date,time, isCompleted } = req.body;
  // create a Todo model with the necessary fields
  const newTodo = Todo({
    title: title,
    description: description,
    date: date,
    time: time,
    isCompleted: isCompleted,
  });
  // save the Todo model and await the result
  const result = await newTodo.save();
  // send back a response with the result in a json format
  res.json(result);
});

app.patch("/todo/:todoID", async (req, res) => {
  //find and update a model by
  // passing in the id, the data to be updated, and set the new option to true
  const result = await Todo.findByIdAndUpdate(
    req.params.todoID, // _id of the document
    { ...req.body }, // the data to be used to update the document
    { new: true } // some options for the operation
  );
  res.json(result);
});

app.put("/todo/:todoID", async (req, res) => {
  //find and update a model by
  // passing in the id, the data to be updated, and set the new option to true
  const result = await Todo.findByIdAndUpdate(
    req.params.todoID, // _id of the document
    { ...req.body }, // data to be replaced
    { new: true, overwrite: true } // options
  );
  res.json(result);
});

app.delete("/todo/:todoID", async (req, res) => {
  //find and delete a model by
  // passing in the id and a callback function
  // that takes in the error and the deletedDocument

  await Todo.findByIdAndDelete(req.params.todoID, (error, doc) => {
    if (error){
     console.log(`Failed to connect to MongDB ${error}`);
     res.status(404).send(`Todo with _id: ${req.params.todoID} was not found`);
    }
      else{
        res.send(`Todo with _id: ${req.params.todoID} has been deleted`);
      }
  });
});

// connect to MongoDBAtlas
mongoose.connect(process.env.MONGO_DB_CON_STRING, (error) => {
  if (error) {
    return console.log(`Failed to connect to MongDB ${error}`);
  } else {
    console.log("MongoDB is connected");
    // start the server to listen to incoming request
    // on the specified PORT
    app.listen(PORT, () => {
      console.log(`Server is up and running 🚀🚀🚀 on PORT: ${PORT}`);
    });
  }
});
