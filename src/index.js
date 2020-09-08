'use strict'

const express = require('express')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
const app = express()
const port = 3000

 app.use(express.json())
 app.use('/model', express.static('model'))

// get the db connection up and ready
const client = new MongoClient(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PW}@zookeeper-mongo:27017`, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 20, keepAlive: 300000, socketTimeoutMS: 480000 })
client.connect((err) => {
    if (err) {
        console.log(`Error connecting to db, we can't move on from this. Fix it: ${err.message}`)
        process.exit(-1)
    } else {
        console.log(`Db connection appears to be good`)
    }
})

// Just a friendly message from the zookeeper
app.get('/', (req, res) => res.send("Hi there! I'm the caretaker around here. Let me know if you need anything!"))

//check the health of the app -> db connection
app.get('/healthz', (req,res) => {
    if ( client.isConnected()){
        res.status(200).send('OK')
    } else {
        res.status(500).send(`State was ${mongoose.connection.readyState} `)
    }
  
})

// create an animal registration
app.post('/animal', (req,res) => {
    if (req.body){
        client.db('admin').collection('animals').insertOne(req.body, (err, result) => {
            if (!err) { 
                console.log(`Insert new animal: ${req.body} --> ${result}`)
                res.status(201).send('OK')
            } else {
                res.status(500).send(err.message)
            }
        })
    } else {
        console.log(`Animal insert attempted with no POST body`)
        res.status(400).send('Bad Request: EMPTY Body')
    }

})

// remove an animal registration
app.delete('/animal/:id', (req,res) => {
    if (req.params.id){
        client.db('admin').collection('animals').findOneAndDelete({ _id : new ObjectId(req.params.id) }, (err, result) => {
            if (!err){
                console.log(`Deleted animal with id: ${req.params.id}`)
                res.status(202).send('OK')
            } else {
                res.status(500).send(err.message)
            }
        })
    } else {
        console.log(`Animal delete attemped with no id`)
        res.status(400).send('Bad Request: EMPTY id')
    }
})

app.get('/animal/:id', (req,res) => {
    if (req.params.id){
        client.db('admin').collection('animals').findOne({ _id : new ObjectId(req.params.id) }, (err, result) => {
            if (!err){
                console.log(`Fetched animal with id: ${req.params.id}`)
                res.status(200).send(JSON.stringify(result))
            } else {
                res.status(500).send(err.message)
            }
        })
    } else {
        console.log(`Animal fetch attemped with no id`)
        res.status(400).send('Bad Request: EMPTY id')
    }
})

// list the animal registrations known
app.get('/animals', (req,res) => {
    const db = client.db('admin')
    db.collection('animals').find({}).toArray((err, docs) => {
        if (err) { 
            res.status(500).send(err.message)
            console.error(`Error: ${err.message}`)
        } else { 
            res.send(docs)
        }     
    })
})


app.listen(port, () => console.log(`Service up on port ${port}`));