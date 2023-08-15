const express = require('express')
const app = express()
const mongoose = require("mongoose");

require('dotenv').config();


// static assets
app.use(express.static('./methods-public'))
// parse form data
app.use(express.urlencoded({ extended: false }))
// parse json
app.use(express.json())



// Connecting to the database
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;
const positionSchema = new Schema({
    CompanyName: String,
    Ticker: String,
    SharesOwned: Number,
    SharePrice: Number,
    TotalCost: Number,
    TotalValue: Number,
    EstimatedDivPayout: Number,
    EstimatedDivYield: Number
  });
const Position = mongoose.model("Position", positionSchema);



// findPortfoliobyName(personName) takes in string personName, finds the associated
//      portfolio in the MongoDB, and returns said portfolio as a JSON. 

var findPortfolioByName = function(personName) {
    var returned = Position.find({name: personName}, function (err, people) {
        if (err) return console.log(err);
        done(null, people);
    });
    var name = returned.select('portfolio');
    return name;
}

// createAndSavePosition(userName) takes in string userName and object newPosition
//      and creates a new position for the user userName using info from newPosition.
// This function is only called when a new position is created, not when changes are
//      made to an already existing position.  
const createAndSavePosition = (userName, newPosition) => {
    const user = Position.find({name: userName}, function (err, people) {
        if (err) return console.log(err);
        done(null, people);
    });
    const userId = user.select('id');

    Position.findByID(userId, function (err, user) {
        if (err) return console.log(err);
        user.portfolio.push(newPosition);
        user.save((err, updatedUser) => {
            if(err) return console.log(err);
            done(null, updatedUser)
        })
    });
};





// API returns the portfolio of the user. 
app.get('/api/portfolio', (req, res) => {
    const {name } = req.body;
    const portfolio = findPortfolioByName(name);
    res.status(200).json({ success: true, data: portfolio })
})




// API adds a new position to the user's portfolio. 
app.post('/api/addPosition', (req, res) => {
  const { name, userName, newPosition } = req.body;
  
  if (!name) {
    return res
      .status(400)
      .json({ success: false, msg: 'please provide name value' })
  }
  createAndSavePosition(userName, userName, newPosition);
  res.status(201).json({ success: true })
})





app.listen(5500, () => {
  console.log('Server is listening on port 5500....')
})