const express = require("express");
const { DAO } = require("./dao/dao.js");
const app = express();
const cors = require("cors");
const crypto = require("crypto");
const axios  = require("axios");

new DAO();

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({extended: true}))

// app.use(express.static('public'))

app.use((req, res,next)=>{
  console.log(`A ${req.method} request come from ${req.url}`);
  next()
})

app.listen(process.env.PORT || 3001)

// Removed duplicate DAO initialization

app.post("/api/addUser", async (req, res)=>{
  try {
    const {firstname, lastname,email, password} = req.body
    // Fixed: Remove unnecessary await when using .then()
    DAO.addUser(firstname, lastname,email, password).then((result)=>{res.status(200).json({result})})
    
  } catch (error) {
    console.error(error.message);
    res.status(500).json({error: error.message})
  }
})

app.post("/api/login", async (req, res)=>{
  try {
    const {email, password} = req.body
    // Fixed: Remove unnecessary await when using .then()
    DAO.getUser(email, password).then((result)=>{
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
    const {message,} = req.body
    let botMessage = "";

    DAO.addUserMessage(req.params.userID, message).then(()=>{
      // Fixed: Remove quotes around message parameter
      axios.get(`http://localhost:5000/chat?message=${message}`).then((response)=>{
        botMessage = response.data.message;
        console.log("Bot message:", botMessage);
        
        DAO.addBotMessage(req.params.userID, botMessage).then((result)=>{
          console.log("Bot message added to database:", result);
          res.status(200).json({botMessage});
        }).catch((error)=>{
          console.error("Error adding bot message:", error.message);
          res.status(500).json({error: error.message});
        });
      }).catch((error)=>{
        // Fixed: Added missing error handling for axios call
        console.error("Error calling bot service:", error.message);
        res.status(500).json({error: error.message});
      });
    }).catch((error)=>{
      // Fixed: Added missing error handling for addUserMessage
      console.error("Error adding user message:", error.message);
      res.status(500).json({error: error.message});
    });

    
  } catch (error) {
    console.error(error.message);
    res.status(500).json({error: error.message})
  }
})

app.get("/api/:userID/messages", async (req, res)=>{
  // A GET request to retrieve messages for a specific user
  try {
    DAO.getMessages(req.params.userID).then((messages)=>{
      console.log("Messages retrieved for user:", req.params.userID, messages);
      
      if (messages && messages.length > 0) {
        res.status(200).json({result: messages});
      } else {
        console.log("No messages found for this user");
        
        // Make request to introduce endpoint
        axios.get('http://localhost:5000/introduce').then((response) => {
          const introMessage = response.data.message;
          
          DAO.addBotMessage(req.params.userID, introMessage).then((result)=>{
            res.status(200).json({
              result: [{
                "_id": result.insertedId,
                "from": "AI", 
                "to": req.params.userID,  
                "message": introMessage, 
                "date": Date.now()
              }]
            });
          }).catch((error)=>{
            console.error("Error adding bot message:", error.message);
            res.status(500).json({error: error.message});
          });
        }).catch((error) => {
          console.error("Error calling introduce service:", error.message);
          res.status(500).json({error: error.message});
        });
      }
    }).catch((error)=>{
      console.error("Error retrieving messages:", error.message);
      res.status(500).json({error: error.message});
    });
       
  } catch (error) {
    console.error(error.message);
    res.status(500).json({error: error.message})
  }
})