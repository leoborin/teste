const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const GOOGLE_API_FOLDER_ID = '1rB9_lL0GaspbPnfv3UGziQTjHRbTffYl'
const { google } = require('googleapis')
const fs = require('fs');
//const { servicenetworking } = require("googleapis/build/src/apis/servicenetworking");
//const { response } = require("express");
//const { text } = require("body-parser");
//const routes = require("express").Router();
const multer = require('multer');
const multerConfig = require('./config/multer');


app.use(require("./routes"));

async function uploadFile(){
  try{
   const auth = new google.auth.GoogleAuth({
     keyFile:'googledrive.json',
     scopes:['https://www.googleapis.com/auth/drive']
   })
    
    const driveservice = google.drive({
      version: 'v3',
      auth
    })

   const fileMetaData = {
    'name': "snowplace2.png",
    'parents': [GOOGLE_API_FOLDER_ID]
   } 

   const media = {
      mimeType : "image/png",
      body : fs.createReadStream('./snow.png')

   }

   const response = await driveservice.files.create({

    resource : fileMetaData,
    media: media,
    fields: 'id'

   })
   return response.data.id
  }
  catch(err){
    console.log('erro criando arquivo',err)
  }
}
//---------------------------------






const db = mysql.createPool({
  host: "us-cdbr-east-06.cleardb.net",
  user: "b71bf2b04093af",
  password: "c941933b",
  database: "heroku_00077021a87bf2d",
});

app.use(express.json());
app.use(cors());



//-------------------------------
app.post("/posts10", multer(multerConfig).single('file'), (req, res) => {
      
//  const { name } = req.body;
//  const { cost } = req.body;
//  const { category } = req.body;
const  name  = "Unvsads";
const  cost  = "teste";
const  category  = "teste";

const imagename = req.file.filename;



async function uploadFile2(){
  try{
   const auth = new google.auth.GoogleAuth({
     keyFile:'googledrive.json',
     scopes:['https://www.googleapis.com/auth/drive']
   })
    
    const driveservice = google.drive({
      version: 'v3',
      auth
    })

   const fileMetaData = {
    'name': imagename,
    'parents': [GOOGLE_API_FOLDER_ID]
   } 

   //const txt = `./tmp/uploads/-${file.imagename}`

   const media = {
      mimeType : "image/png",
     // body :fs.createReadStream('./snow.png') 
      body : fs.createReadStream(`./tmp/uploads/${imagename}`)
      
   }

   const response = await driveservice.files.create({

    resource : fileMetaData,
    media: media,
    fields: 'id'

   })
const url = response.data.id

let mysql = "INSERT INTO games ( name, cost, category, url, imagename ) VALUES (?, ?, ?, ?, ?)";
db.query(mysql, [name, cost, category, url, imagename], (err, result) => {
  res.send(result);
});
   return response.data.id
  }
  catch(err){
    console.log('erro criando arquivo',err)
  }
}

uploadFile2().then(data=>{
console.log(data)
})

//const url = req.data.id




//return console.log(req.file);

});

//----------------------------




app.post("/register", (req, res) => {
//  const { name } = req.body;
//  const { cost } = req.body;
//  const { category } = req.body;

uploadFile().then(data=>{

  console.log(data)
  
  })


  const  name  = "teste19";
  const  cost  = "teste";
  const  category  = "teste";
  const  url  = "0";


  let mysql = "INSERT INTO games ( name, cost, category, url ) VALUES (?, ?, ?, ?)";
  db.query(mysql, [name, cost, category, url], (err, result) => {
    res.send(result);
  });

  console.log(name);

});

app.post("/search", (req, res) => {
  const { name } = req.body;
  const { cost } = req.body;
  const { category } = req.body;

  let mysql =
    "SELECT * from games WHERE name = ? AND cost = ? AND category = ?";
  db.query(mysql, [name, cost, category], (err, result) => {
    if (err) res.send(err);
    res.send(result);
  });
});

app.get("/getCards", (req, res) => {
  let mysql = "SELECT * FROM heroku_00077021a87bf2d.games";
  db.query(mysql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/edit", (req, res) => {
  const { id } = req.body;
  const { name } = req.body;
  const { cost } = req.body;
  const { category } = req.body;
  let mysql = "UPDATE games SET name = ?, cost = ?, category = ? WHERE id = ?";
  db.query(mysql, [name, cost, category, id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  let mysql = "DELETE FROM games WHERE id = ?";
  db.query(mysql, id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
//$ heroku logs --tail --app your_app_name
app.listen(process.env.PORT||3001, () => {
  console.log("rodando na porta 3001");
});
