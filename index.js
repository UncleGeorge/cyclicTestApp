const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require("dotenv").config()


const port = process.env.PORT || 8000
const app = express()

const Person = require('./models/User')


// middleware for bodyparser
app.use(bodyParser.urlencoded({ extended: false }))


const db = process.env.ATLAS_URL

// attempt to connect with DB
mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.log(err))

app.get('/get-usernames', async (req, res) => {

    const users = await User.find({}, {"username": 1, "_id": 0});
    try {
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }

})

app.post('/add-username', (req, res) => {
    // check to keep usernames unique
    User
        .findOne({username: req.body.username})
        .then(person => {
            if (person) {
                return res
                        .status(400)
                        .send('Username already exists')    
            } else {
                const newUser = User({
                    username: req.body.username
                })

                newUser
                    .save()
                    .then(user => res.send(user))
                    .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
})



app.listen(port, () => console.log(`App running at port : ${port}`))