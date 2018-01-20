const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const MongoObjectID = require("mongodb").ObjectID
const bodyParser = require('body-parser')
config = require('./env.js')
app.use(bodyParser.json())

// Helper functions ----------------------------------------------------------

function addEmployee(employee, db, res) {
  db.collection("employees", function(error, collection){
    if (error) throw new Error(error);
    collection.insert(employee, function(error, employee){
      if (error) throw new Error(error);
      res.send(JSON.stringify(employee))
    })
  })
}

function deleteEmployee(employee, db, res) {
  db.collection("employees", function(error, collection){
    if (error) throw new Error(error);
    collection.remove({_id: new MongoObjectID(employee._id)}, function(error, result){
      if (error) throw new Error(result);
      res.send(result)
    })
  })
}

function getEmployeeDetails(db, res) {
  db.collection("employees", function(error, collection){
    if (error) throw new Error(error);
    collection.find().toArray(function(err, employees){
      if (error) throw new Error(error);
      res.send(JSON.stringify(employees))
    })
  })
}

function updateEmployeeDetails(employee, db, res) {
  db.collection("employees", function(error, collection){
    if (error) throw new Error(error);
    console.log(employee._id)
    collection.update({_id: new MongoObjectID(employee._id)}, employee, function(err, employee){
      if (error) throw new Error(error);
      res.send(JSON.stringify(employee))
    })
  })
}

// ----------------------------------------------------------------------
var db;

app.set('port', (process.env.PORT || 5000));

MongoClient.connect(config.databaseUrl, function(error, database){

  if (error) throw new Error(error);
  db = database.db("slackpay");

  app.get('/', function(req, res) {
    getEmployeeDetails(db, res)
  })

  app.post('/add', function(req, res) {
    let employee = req.body.body
    addEmployee(employee, db, res)
  })

  app.post('/delete', function(req, res) {
    let employee = req.body.body
    deleteEmployee(employee, db, res)
  })

  app.post('/change', function(req, res){
    let employee = req.body.body
    updateEmployeeDetails(employee, db, res)
  })

  app.listen(app.get('port'), function() {
    console.log('Example app listening on port', app.get('port'))
  })

});
