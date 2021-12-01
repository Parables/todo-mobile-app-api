// import the express package
import express from 'express';
//import the mongoose package
import mongoose from 'mongoose';
//import the dotenv package
import dotenv from 'dotenv';
// configure dotenv
dotenv.config();
// process.env.ENV_NAME



// create an instance of express
const app = express();


// create a variable for our PORT number
const PORT =process.env.PORT?? 5000;


// create routes to make request to the serve
app.get('/', (req, res)=>{
    res.send('Hello Worlds');
});

app.post('/', (req, res)=>{
    res.send('Hello Worlds');
});

app.put('/', (req, res)=>{
    res.send('Hello Worlds');
});

app.patch('/', (req, res)=>{
    res.send('Hello Worlds');
});
app.delete('/', (req, res)=>{
    res.send('Hello Worlds');
});


// connect to MongoDBAtlas
mongoose.connect(process.env.MONGO_DB_CON_STRING, (error)=>{
    if(error){
     return   console.log(`Failed to connect to MongDB ${error}`)
    }else{
        console.log('MongoDB is connected')
        // start the server to listen to incoming request
// on the specified PORT
app.listen(PORT, ()=>console.log(`Server is up and running 🚀🚀🚀 on PORT: ${PORT}`));
    }
})

