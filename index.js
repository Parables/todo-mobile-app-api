// import the packages we need
import express from "express";
import dotenv from "dotenv";

// loads the env file content into the process.env
// Use process.env.VARIABLE_NAME to access the value of the variable in our .env file
dotenv.config();

import mongoose from "mongoose";
// import Todo model to perform crud operations
import { Todo } from "./models/todo.js";

// create an instance of express
const app = express();

// use the json middleware to
// extract the data stored in the request body
app.use(express.json());

// store the PORT number from the .env file into a constant variable
const PORT = process.env.PORT;

// create an index route to test the server
app.get("/", async (req, res) => res.send("Hello World"));

// create routes to perform CRUD operations with the Todo model

// CREATE a new Todo resource in the database by making a POST request to /todo
// the data to be saved must be in your request's body in json format
app.post("/todo", async (req, res) => {
  // extract the necessary fields from the body of the request
  const { title, description, date, time, isCompleted } = req.body;
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

// READ all the Todos from the database by making a GET request to /todos
// the Model.find({}) method takes in a object as parameter that will be used to filter the documents we retrieve. E.g: Retrieve all documents where title is "Learn API with NodeJs & Express" will be written as:
// await Todo.find({"title": "Learn API with NodeJs & Express"});
// an empty object {} means no filter is applied so retrieve all the documents

app.get("/todos", async (req, res) => {
  const result = await Todo.find({});
  res.json(result);
});

// UPDATE a Todo resource in the database by making a PATCH request to /todo/:todoID
// a PATCH request should merge the previous resource with incoming data
// :todoID is a request parameter and can be used by req.params.todoID
// the data to be saved must be in your request's body in json format
app.patch("/todo/:todoID", async (req, res) => {
  //find and update a model by
  // passing in the id, the data to be updated,
  // and set the new option to true
  const result = await Todo.findByIdAndUpdate(
    req.params.todoID, // _id of the document
    { ...req.body }, // the data to be merged with the existing document
    { new: true } // options
  );
  res.json(result);
});

// UPDATE a Todo resource in the database by making a PUT request to /todo/:todoID
// a PUT request is almost similar to a PATCH request
//  except that it overwrites the previous resource with incoming data
// :todoID is a request parameter and can be used by req.params.todoID
// the data to be saved must be in your request's body in json format
app.put("/todo/:todoID", async (req, res) => {
  //find and update a model by
  // passing in the id, the data to be updated,
  // and set the new and overwrite options to true
  const result = await Todo.findByIdAndUpdate(
    req.params.todoID, // _id of the document
    { ...req.body }, // data to be replaced
    { new: true, overwrite: true } // options
  );
  res.json(result);
});

// DELETE a Todo resource in the database by making a DELETE request to /todo/:todoID
// :todoID is a request parameter and can be used by req.params.todoID
app.delete("/todo/:todoID", async (req, res) => {
  //find and delete a model by
  // passing in the id and a callback function
  // that takes in the error and the deletedDocument
  await Todo.findByIdAndDelete(req.params.todoID, (error, doc) => {
    if (error) {
      console.log(
        `Failed to delete the document with _id: ${req.params.todoID}. Error: ${error}`
      );
      res.status(404).send(`Todo with _id: ${req.params.todoID} was not found`);
    } else {
      res.send(`Todo with _id: ${req.params.todoID} has been deleted`);
    }
  });
});

// connect to MongoDBAtlas first
mongoose.connect(process.env.MONGO_DB_CON_STRING, (error) => {
  if (error) {
    // if we get an error, log it out to the console
    return console.log(`Failed to connect to MongDB ${error}`);
  } else {
    // if connection is successful... start the server
    console.log("MongoDB is connected");
    // start the server to listen to incoming request
    // on the specified PORT
    app.listen(PORT, () => {
      console.log(`Server is up and running 🚀🚀🚀 on PORT: ${PORT}`);
    });
  }
});
