const express = require("express");
const { DAO } = require("./dao/dao.js");
const app = express();
const cors = require("cors");
const crypto = require("crypto");

// const session = require('express-session');
// const cookieParser = require('cookie-parser');


new DAO();


app.use(cors({
    origin: 'https://ob384.github.io', // Frontend domain
    credentials: true,
  }));

  // app.use(cors())
  // app.use(cookieParser());



app.use(express.json());
app.use(express.urlencoded({extended: true}))

// app.use(express.static('public'))

app.use((req, res,next)=>{
  console.log(`A ${req.method} request come from ${req.url}`);
  next()
})


app.listen(process.env.PORT || 3001)

app.post("/api/addUser", async (req, res)=>{
  try {
    const {fname, lname,email, pwd} = req.body
    const result = await DAO.addUser(fname, lname,email, pwd)
    res.status(200).json({result})
  } catch (error) {
    console.error(error.message);
    res.status(500).json({error: error.message})
  }
})