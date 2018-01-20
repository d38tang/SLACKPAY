const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const MongoObjectID = require("mongodb").ObjectID
const bodyParser = require('body-parser')
config = require('./env.js')
app.use(bodyParser.json())

// Helper functions ----------------------------------------------------------

function addUser(user, db, res) {
  db.collection("users", function(error, collection){
    if (error) throw new Error(error);
    collection.insert(user, function(error, user){
      if (error) throw new Error(error);
      res.send(JSON.stringify(user))
    })
  })
}

function addTransaction(senderId, receiverId, amount, date, db, res) {
  let time = {
    year: date.getFullYear(),
    date: date.getDate(),
    month: date.getMonth() + 1,
    hour: date.getHours(),
    minutes: date.getMinutes()
  }

  let transaction = {
    senderId: senderId,
    receiverId: receiverId,
    amount: amount,
    time: time
  }

  db.collection("users", function(error, collection) {
    collection.findOne({id: senderId}, function(error, sender) {
      if (error) throw new Error(error);
      collection.findOne({id: receiverId}, function(error, receiver) {
        if (error) throw new Error(error);
        transaction.senderName = sender.name
        transaction.receiverName = receiver.name
        let newSenderTransaction = sender.transactions
        newSenderTransaction.push(transaction)
        let newReceiverTransaction = receiver.transactions
        newReceiverTransaction.push(transaction)
        collection.update({id: senderId}, {$set: {transactions: newSenderTransaction}}, function (error, user){
          if (error) throw new Error(error);
          collection.update({id: receiverId}, {$set: {transactions: newReceiverTransaction}}, function (error, user){
            if (error) throw new Error(error);
            res.send("Transaction Added")
          })
        })
      })
    })
  })
}

function getUserTransactionHistory(userId, db, res) {
  db.collection("users", function(error, collection){
    if (error) throw new Error(error);
    collection.findOne({id: userId}, function(error, user) {
      if (error) throw new Error(error);
      res.send(JSON.stringify(user.transactions))
    })
  })
}

// ----------------------------------------------------------------------
var db;

app.set('port', (process.env.PORT || 5000));

MongoClient.connect(config.databaseUrl, function(error, database){

  if (error) throw new Error(error);
  db = database.db("slackpay");

  app.post('/adduser', function(req, res) {
    let user = req.body.body
    addUser(user, db, res)
  })

  app.post('/addtransaction', function(req, res) {
    let senderId = req.body.body.senderId
    let receiverId = req.body.body.receiverId
    let amount = req.body.body.amount
    addTransaction(senderId, receiverId, amount, new Date(), db, res)
  })

  app.get('/history', function(req, res) {
    let userId = req.query.id
    getUserTransactionHistory(userId, db, res)
  })

  app.listen(app.get('port'), function() {
    console.log('Example app listening on port', app.get('port'))
  })

});
