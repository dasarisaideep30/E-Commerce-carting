if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({
        path : "backend/config/.env",
    });
}

const connectDatabase = require('./db/Database.js')
const app = require("./app.js")
const PORT = process.env.PORT;




const server = app.listen(PORT,async()=>{
    connectDatabase();
    console.log("The server is running on Port:8080 URL: http://localhost:8080")
});