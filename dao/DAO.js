const {MongoClient, ObjectId} = require("mongodb");

const uri = `mongodb://localhost:27017/`

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
      const collection = database.collection("messages")
      const result = await collection.insertOne({from: "AI", to: userID,  "message": message, date: Date.now()})
      console.log(`Insertion ${result.insertedId}: Complete`);
      return result
      // client.close();
    } catch (error) {
      console.error(error.message)
    }
  }

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


  static getMessages = async (userID) => {
    try {
      const database = client.db("deeproot");
      const collection = database.collection("messages");
      const result = await collection.find({
        $or: [{ from: userID }, { to: userID }]
      }).toArray();
      
      // Check if array has any results
      if (result.length) {
        console.log(`Found ${result.length} messages for user ${userID}`);
        console.log(result);
        return result;
      } else {
        console.log("No messages found for this user");
        return [];
      }
    } catch (error) {
      console.error("Error fetching messages:", error.message);
      // Return empty array or rethrow based on your error handling strategy
      return [];
    }
  }
  

}

module.exports.DAO=DAO