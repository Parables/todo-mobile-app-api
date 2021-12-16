# API with NodeJS & ExpressJS

## **Intro**

In this tutorial we will create a simple API with NodeJs and ExpressJS,
connect to MongoDB and perform CRUD operations with the API.

## **Step by Step Process**

1. Create a NodeJs project in a new folder by running the command:
   > `npm init -y`.
2. Install the following packages in the project by running the command:
   >    `npm install express mongoose dotenv cors nodemon`
3. Create a new file in your project folder with the name `index.js`
4. Inside `index.js` file, create a simple server with ExpressJS

   ```js

   //index.js

   // import the packages we need
   import express from "express";
   import dotenv from "dotenv";

   // loads the env file content into the process.env
   // Use process.env.VARIABLE_NAME to access the value of the variable in our .env file
   dotenv.config();

    // create an instance of express
    const app = express();

    // store the PORT number from the .env file into a constant variable
    const PORT = process.env.PORT;

    // create an index route to test the server
    app.get("/", async (req, res) => res.send("Hello World"));

    // start the server to listen to incoming request
    // on the specified PORT
    app.listen(PORT, () => console.log(`Server is up and running 🚀🚀🚀 on PORT: ${PORT}`));

   ```

5. Create a new file in your project folder with the name `.env`
6. Inside `.env`  file, add an environment variable for the `PORT` number

   ```.env

    PORT=5000

   ```

7. Test the server by running g the command `node index.js`
8. Open your browser and type `http://localhost:5000/` to make a GET request to your server and see your first response.
9. If you get a "Hello World" response, you have created your first Server that is ready to respond whenever a request comes in.

## **Congratulations 🎊🎊🎉🎉🥳🥳**

You can end here but an API can do more than just response with a "Hello World".
In the next step we will connect to mongoDB Atlas using a connection string and add more routes to  Create, Read, Update & Delete resources.

## **CRUD operations**

Just like how we created the index route on line 13, we will create more routes to handle different requests.

A request is made with an HTTP verb/method that specifies the type of operation the request wants to perform on the server. Some of the common HTTP methods we will look at in this tutorial are:

1. POST - used to create a new resource on the server
2. GET - used to read a resources on the server
3. PATCH - used to update a resource on the server by **merging** the existing resource with the incoming data
4. PUT - used to update a resource on the server by **replacing** the existing resource with the incoming data
5. DELETE - used to delete a resource on the server.

### **Connecting to MongoDB Atlas**

Search for MongoDB Atlas on the browser and signUp for an account. If you already have an account, then please login.

Follow the welcome guide to create a new project and build your first database cluster.
> Please note the password you set for your user account on your cluster as you will need it to connect to the Cluster later on.

Please make sure to allow access from every I.P address
> Go to the network menu on your MongoDB Atlas dashboard, add a new IP address and click on `ALLOW ACCESS FROM EVERYWHERE` button.

Click the CONNECT button on the Overview page. Then select Connect your application from the options.
Finally, make sure NodeJS is selected and the version is 4.0 upwards.

Copy the connection string below and add an environment variable for the `MONGO_DB_CON_STRING` in the `.env` file.

   ```.env

    PORT=5000

    MONGO_DB_CON_STRING=mongodb+srv://admin:<password>@cluster0.nvren.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

   ```

> Make sure to replace \<password> with the password you choose during the welcome guide process and replace myFirstDatabase in the connection string with a name for your database. You can give it any name

To connect our API with MongoDB, we will use the mongoose package we installed earlier on. Add this line to your import statements at the top of the index.js file

```js

import mongoose from "mongoose";

```

Since our server depends on the database to handle requests, its essential to attempt a connection to MongoDB Atlas first. If the connection is successfully, we  then start our server to listen to incoming requests on the specified `PORT` number.
If the connection fails, we simply log out the error to the console.

But feel free to separate the connection to mongoDB from starting the server if your server directly doesn't directly depend on the database.

Replace this part of code:

```js
   // start the server to listen to incoming request
   // on the specified PORT
   app.listen(PORT, () => console.log(`Server is up and running 🚀🚀🚀 on PORT: ${PORT}`));
```

with this:

```js
// connect to MongoDBAtlas first
mongoose.connect(process.env.MONGO_DB_CON_STRING, (error) => {
  if (error) { // if we get an error, log it out to the console
    return console.log(`Failed to connect to MongDB ${error}`);
  } else { // if connection is successful... start the server
    console.log("MongoDB is connected");
    // start the server to listen to incoming request
    // on the specified PORT
    app.listen(PORT, () => {
      console.log(`Server is up and running 🚀🚀🚀 on PORT: ${PORT}`);
    });
  }
});
```

### **Model your data**

MongoDB is a NoSQL database.

In comparison to the relational SQL database:
 a `TABLE` in SQL is a `COLLECTION` in NoSQL,
 a `COLUMN` in SQL is a `FIELD` in NoSQL,
 and `ROW` in SQL is a `DOCUMENT` in NoSQL,

Meaning, you can structure your document in the Collection any how you want it. To help make storing and retrieving documents, we will create a model to represent how data will be stored and retrieved.

Inside your project, create a new folder called `models` and inside the `models` folder create a new file called `todo.js` and paste in the following code snippet.

```js
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

// then make a model
// by passing in the name and a schema for our model
// and export it to be imported used in other files
export const Todo = model('todo',todoSchema );

```

### **Adding more routes to perform CRUD operations**

Inside the `index.js` file, import the Todo model we just created.

```js

// import Todo model to perform crud operations
import { Todo } from "./models/todo.js";

```

>To extract the body of requests made with `POST`, `PUT` & `PATCH`, we need to add line this after we created the server instance in `index.js` file;

```js

// create an instance of express
const app = express();

// use the json middleware to
// extract the data stored in the request body
app.use(express.json());

```

> Importing your files like this will crash your Server. To fix it, inside the `package.json` file, add a comma after the "main": "index.js" line and paste this there.

```json

 "main": "index.js",
  "type": "module",

```

> `"type": "module",` helps us to use the modern import statement. Read more on javascript.info about Modules

Below the index route, add the following code snippets.

Each snippet is well commented to explain what the code is doing so be sure to read them.

The async/await keywords you see simply means our server will keep on listening to more request while it await the results of the asynchronous operation.

> CREATE a todo

```js

// create routes to perform CRUD operations with the Todo model

// CREATE a new Todo resource in the database by making a POST request to /todo 
// the data to be saved must be in your request's body in json format 
app.post("/todo", async (req, res) => {
  // extract the necessary fields from the body of the request
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

```

> READ all todos

```js

// READ all the Todos from the database by making a GET request to /todos
// the Model.find({}) method takes in a object as parameter that will be used to filter the documents we retrieve. E.g: Retrieve all documents where title is "Learn API with NodeJs & Express" will be written as:
// await Todo.find({"title": "Learn API with NodeJs & Express"});
// an empty object {} means no filter is applied so retrieve all the documents

app.get("/todos", async (req, res) => {
  const result = await Todo.find({});
  res.json(result);
});

```

> UPDATE a todo by **merging** existing data with incoming data

```js

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

```

> UPDATE a todo by **replacing** existing data with incoming data

```js

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

```

> DELETE a todo

```js

// DELETE a Todo resource in the database by making a DELETE request to /todo/:todoID
// :todoID is a request parameter and can be used by req.params.todoID
app.delete("/todo/:todoID", async (req, res) => {
  //find and delete a model by
  // passing in the id and a callback function
  // that takes in the error and the deletedDocument
  await Todo.findByIdAndDelete(req.params.todoID, (error, doc) => {
    if (error){
     console.log(`Failed to delete the document with _id: ${req.params.todoID}. Error: ${error}`);
     res.status(404).send(`Todo with _id: ${req.params.todoID} was not found`);
    }
      else{
        res.send(`Todo with _id: ${req.params.todoID} has been deleted`);
      }
  });
});


```

### **Try out your API**

Anytime you make a change in the code, you have to stop the server and start it again by running `node index.js`. This process of restarting the server can get pretty tiring.

We install `nodemon` earlier on when we create the project. `nodemon` will watching your project and restart the server whenever you save a file.

To use nodemon, add the `start` & `start-dev` commands to the `scripts` object inside the `package.json` file:

```json

"scripts": {
    "start": "node index.js",
    "start-dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },

```

Start your server in development mode by running `npm run start-dev`.

>`npm run start` will be used in production when you publish your server to hosting providers like cyclic.sh or Heroku to start the serve in production mode

VS Code has an extension called `Thunder Client` so you can install it and try making request to your server.

> Make sure to use the right HTTP verb/methods for your requests and sure you replace `:todoID` the `_id` of a document  when you are making a `PUT`, `PATCH` or `DELETE` requests.
> Also, make sure that for your `POST`, `PUT` & `PATCH` requests, you add the data to be sent in the body of the request in `json` format.

//TODO: Insert screenshot of the using Thunder Client here

## **Publish your API**

To use the API you have just created in your mobile and web apps, you need to publish the server to a hosting provider.

> cyclic.sh is a free hosting provider that makes deploying your NodeJS projects as easy as pushing the codes to GitHub. I highly recommend that you try it out.

### **Pushing your codes to GitHub**

GitHub is the Google Drive or DropBox for developers. Its an remote store where you can keep your projects that and share your code with others. You can continue working on any other computer just by going to GitHub and cloning the project to the computer.

Follow these steps to publish your codes to GitHub from this [amazing article]().

### **Deploying with cyclic.sh**

After you have pushed your codes to GitHub, signUp for an account on cyclic.sh. You can use your GitHub account to signUp.

Create a new app and link it to your GitHub repository.

Add your MONGO_DB_CON_STRING environment variable you used in the `.env` file in the Environment Secrets section and done.

Anytime you push your code to GitHub, cyclic.sh will deploy your server and give you a url to access your server. This is known as Continuos Deployment.

cyclic.sh will generate a random unique url for your server. Use this url instead of `http://localhost:5000` when you are making requests.

Follow this article for a detailed guide to [deploying your API on cyclic.sh](https://dev.to/_iametornam/deploy-your-nodejs-auth0-rest-api-to-cyclicsh-under-4-minutes-j8h)

> ProTip: Anything can go wrong when a server receives a request. It is recommended that you always wrap your codes in a try/catch block to handle the errors.

If you have any issues, please write them in the comments section below.

> You can follow me on [YouTube]() for more juicy contents daily. Find me on [Twitter]() and browse through the source code for this project on [GitHub]().

That's all folks!!!.
