class User{
  constructor(id, name, email, password){
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }
  getId(){
    return this.id;
  }
  getName(){
    return this.name;
  }
  getEmail(){
    return this.email;
  }
  getPassword(){
    return this.password;
  }
  setId(id){
    this.id = id;
  }
  setName(name){
    this.name = name;
  }
  setEmail(email){
    this.email = email;
  }
  setPassword(password){
    this.password = password;
  }
  
}