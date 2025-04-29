const {MongoClient, ObjectId} = require("mongodb");

const uri = `mongodb+srv://ob384:AewneOTcxz3dx1yC@after-mdx.w9ple.mongodb.net/`

const client = new MongoClient(uri)


class DAO {
  constructor(){
    client.connect();
  }

  static async addUser(fname, lname,email, pwd) {
    try {
      // client.connect();
      const database = client.db("deeproot")
      const collection = database.collection("users")
      await collection.createIndex({ "email": 1 }, { unique: true });
      const result = await collection.insertOne({firstname: fname, lastname:lname, "email": email, password: pwd})
      console.log(`Insertion ${result.insertedId}: Complete`);
      return result
      // client.close();
    } catch (error) {
      console.error(error.message)
    }
  }

  static async addUserMessage(userID, message) {
    try {
      const database = client.db("deeproot");
      const collection = database.collection("messages");
      
      const messageDoc = {
        from: userID, 
        to: "AI",
        message: message,
        date: Date.now()
      };
      
      const result = await collection.insertOne(messageDoc);
      console.log(`Message inserted with ID: ${result.insertedId}`);
      
      return result;
    } catch (error) {
      console.error("Error adding user message:", error.message);
      throw error; // Re-throw the error for proper handling upstream
    }
  }

  static async addBotMessage(userID, message, ) {
    try {
      // client.connect();
      const database = client.db("deeproot")
      const collection = database.collection("bot-messages")
      const result = await collection.insertOne({from: "AI", to: userID,  "message": message, date: Date.now()})
      console.log(`Insertion ${result.insertedId}: Complete`);
      return result
      // client.close();
    } catch (error) {
      console.error(error.message)
    }
  }

  // static async addUser(userObject){
  //   try {
  //     // client.connect();
  //     const database = client.db("deeproot")
  //     userObject.username = userObject.email.split( "@")[0]
  //     console.log(userObject);
      
  //     const collection = database.collection("users")
  //     await collection.createIndex({ username: 1 }, { unique: true });
  //     await collection.createIndex({ email: 1 }, { unique: true });
  //     const result = await collection.insertOne(userObject)
  //     console.log(`Insertion ${result.insertedId}: Complete`);
  //     // client.close();
  //   } catch (error) {
  //     console.error(error.message)
  //   }
  // }

  static getUser = async(email, password)=>{
    try {
      const database = client.db("deeproot")
      const collection  = database.collection("users")
      const result = await collection.findOne({email: email, password: password})
      if (result) {
        console.log(`User ${result._id} found`);
        // console.log(result);
        return result
      } else {
        console.log("User not found");
        return null
      }
      // return result
    } catch (error) {
      console.error(error.message);
    }
  }


  static getMessages = async(userID, )=>{
    try {
      const database = client.db("deeproot")
      const collection  = database.collection("messages")
      const result = await collection.find({$or: [{ from: userID },{ to: userID }]}).toArray()
      
      
      if (result) {
        console.log(`User ${result._id} found`);
        // console.log(result);
        return result
      } else {
        console.log("User not found");
        return []
      }
      // return result
    } catch (error) {
      console.error(error.message);
    }
  }

  
    

  

}

module.exports.DAO=DAO