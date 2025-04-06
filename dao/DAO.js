const {MongoClient, ObjectId} = require("mongodb");

const uri = `mongodb+srv://ob384:AewneOTcxz3dx1yC@after-mdx.w9ple.mongodb.net/`

const client = new MongoClient(uri)


class DAO {
  constructor(){
    client.connect();
  }

  static addUser = async (fname, lname,email, pwd)=>{
    try {
      // client.connect();
      const database = client.db("deeproot")
      const collection = database.collection("users")
      const result = await collection.insertOne({firstname: fname, lastname:lname, "email": email, password: pwd})
      console.log(`Insertion ${result.insertedId}: Complete`);
      // client.close();
    } catch (error) {
      console.error(error.message)
    }
  }

  static addUser = async (userObject)=>{
    try {
      // client.connect();
      const database = client.db("deeproot")
      userObject.username = userObject.email.split( "@")[0]
      console.log(userObject);
      
      const collection = database.collection("users")
      await collection.createIndex({ username: 1 }, { unique: true });
      await collection.createIndex({ email: 1 }, { unique: true });
      const result = await collection.insertOne(userObject)
      console.log(`Insertion ${result.insertedId}: Complete`);
      // client.close();
    } catch (error) {
      console.error(error.message)
    }
  }

  static verifyUser = async(object)=>{
    try {
      const database = client.db("deeproot")
      const collection  = database.collection("users")
      const result = await collection.findOne(object)
      return result
    } catch (error) {
      console.error(error.message);
    }
  }

    

  

}

module.exports.DAO=DAO