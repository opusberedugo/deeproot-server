const express = require("express");
const { DAO } = require("./dao/dao.js");
const app = express();
const cors = require("cors");
const crypto = require("crypto");
const axios  = require("axios");

// const session = require('express-session');
// const cookieParser = require('cookie-parser');


new DAO();


// app.use(cors({
//     origin: 'https://ob384.github.io', // Frontend domain
//     credentials: true,
//   }));

app.use(cors())
  // app.use(cookieParser());



app.use(express.json());
app.use(express.urlencoded({extended: true}))

// app.use(express.static('public'))

app.use((req, res,next)=>{
  console.log(`A ${req.method} request come from ${req.url}`);
  next()
})


app.listen(process.env.PORT || 3001)

new DAO();

app.post("/api/addUser", async (req, res)=>{
  try {
    const {firstname, lastname,email, password} = req.body
    const result = await DAO.addUser(firstname, lastname,email, password).then((result)=>{res.status(200).json({result})})
    
  } catch (error) {
    console.error(error.message);
    res.status(500).json({error: error.message})
  }
})

app.post("/api/login", async (req, res)=>{
  try {
    const {email, password} = req.body
    const result = await DAO.getUser(email, password).then((result)=>{
      if (result) {
        res.status(200).json({result})
      } else {
        res.status(401).json({error: "Invalid email or password"})
      }
    })
    
  } catch (error) {
    console.error(error.message);
    res.status(500).json({error: error.message})
  }
})

app.post("/api/chat/:userID", async (req, res)=>{
  try {
    const {message, usegpt} = req.body

    // const chatResult = await axios.get(`localhost:3000/chat/user123?message=${message}?&use_gpt=${usegpt}`)
    DAO.addUserMessage(req.params.userID, message).then((result)=>{
      console.log("User Message Added",result)
      axios.get(`http://localhost:8000/predict/${req.params.userID}?message=${message}`,).then((response)=>{
        DAO.addBotMessage(req.params.userID, response.data).then((result)=>{
          console.log("Bot Message Added",result)
          res.status(200).json({result: response.data})
        })
      })})
    // DAO.addUserMessage(req.params.userID, message).then((result)=>{
    //   console.log("User Message Added",result)
    //   axios.get(`http://localhost:3000/chat/${req.params.userID}?message=${message}`,).then((response)=>{
    //     DAO.addBotMessage(req.params.userID, response.data).then((result)=>{
    //       console.log("Bot Message Added",result)
    //       res.status(200).json({result: response.data})
    //     })
    //   })})
    
      // console.log(chatResult.data);
    // res.status(200).json({result: chatResult.data})
    
  } catch (error) {
    console.error(error.message);
    res.status(500).json({error: error.message})
  }
})

app.get("/api/:userID/messages", async (req, res)=>{
  // A GET request to retrieve messages for a specific user
  try {
    

    DAO.getMessages(req.params.userID).then((result)=>{
      console.log("Messages retrieved for user:", req.params.userID, result);
      res.status(200).json({result})
    })
    
  } catch (error) {
    console.error(error.message);
    res.status(500).json({error: error.message})
  }
})

app.get("/api/:userID/messages", async (req, res)=>{
  try {
    const {userID} = req.params
    const result = await DAO.getMessages(userID).then((result)=>{
      res.status(200).json({result})
    })
    
  } catch (error) {
    console.error(error.message);
    res.status(500).json({error: error.message})
  }
})