const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./config/database');
/*LOAD MODELS */
const { UserModel } = require('./models/users');
const { ListModel } = require('./models/lists');
const { TaskModel } = require('./models/task');


/*LOAD MODELS */

require('dotenv').config();
app.use(cors());
app.use(express.json());   
app.get("/",(req,res)=>{
    res.status(200).send("Hello from the server")
})
const {user,list,task} = require('./routes');
app.use("/api",user);
app.use("/api",list);
app.use("/api",task);

// Synchronize all models with the database
(async () => {
    try {
      await db.sync({ alter: true }); // This will sync all models
      console.log('All tables synchronized');
    } catch (error) {
      console.error('Error syncing tables:', error);
    }
  
    // Test DB connection after synchronization
    db.authenticate()
      .then(() => {
        console.log("Database connected");
        app.listen(process.env.PORT || 4500, () => {
          console.log(`Listening to PORT : ${process.env.PORT || 4500}`)
        });
      })
      .catch((err) => console.log(err.message));
  })();

