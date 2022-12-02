const routes = require("express").Router();
const multer = require('multer');
const multerConfig = require('./config/multer');
//const express = require("express");
//const mysql = require("mysql2"); 

routes.post("/posts2", multer(multerConfig).single('file'), (req, res) => {
     
    const db = mysql.createPool({
        host: "us-cdbr-east-06.cleardb.net",
        user: "b71bf2b04093af",
        password: "c941933b",
        database: "heroku_00077021a87bf2d",
      });      
    
    
    const  name  = "teste2";
    const  cost  = "teste";
    const  category  = "teste";
    const url = "test"

    let mysql = "INSERT INTO games ( name, cost, category, url ) VALUES (?, ?, ?, ?)";
    db.query(mysql, [name, cost, category, url], (err, result) => {
      res.send(result);
    });
  
    console.log(name);


    console.log(req.file);


return res.json({ hello: "Rocket" });

});

routes.get("/test",  (req, res) => {

 return res.json({ hello: "Rocket" });
 });
 
module.exports = routes;
