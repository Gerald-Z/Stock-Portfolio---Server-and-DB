const express = require('express')
const app = express()
const mongoose = require("mongoose");
const cors = require('cors');

require('dotenv').config();


// static assets
app.use(express.static('./methods-public'))
// parse form data
app.use(express.urlencoded({ extended: false }))
// parse json
app.use(express.json())
// Enable CORS

// app.use(cors({origin: 'localhost:5500'}));
// If we wish to enable CORS from all websites.
app.use(cors({origin: '*'}));



// Connecting to the database
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;
const positionSchema = new Schema({
    name: String, 
    portfolio: [{
        CompanyName: String,
        Ticker: String,
        SharesOwned: Number,
        SharePrice: Number,
        TotalCost: Number,
        TotalValue: Number,
        EstimatedDivPayout: Number,
        EstimatedDivYield: Number
    }]
});
const Position = mongoose.model("Position", positionSchema);

const findPortfolioByCred = async (usernames, passwords) => {
    const returned = await Position.find({name: usernames, password: passwords});
    return returned;
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

// sellShare interacts with the MongoDB database and modifies the portfolio
//      of userName so that shares of ticker will be subtracted from sharesOwned/
// Also, both TotalCost and TotalValue will be subtracted by shares x price.
// Note that if this function is called, the order has been confirmed to be valid
//      and a sell is possible.
const sellShare = async (position, shares, price, index) => {
   // console.log("Sell share position is", position.portfolio[2].SharesOwned);
    position.portfolio[index].SharesOwned -= shares;
    position.portfolio[index].TotalCost -= shares * price;
  //  console.log("Sell Share was called", position.portfolio[2].SharesOwned);
    await position.save();
}

const buyShare = async (position, shares, price, index) => {
   // console.log("Buy share position is", position);
    position.portfolio[index].SharesOwned += shares;
    position.portfolio[index].TotalCost += shares * price;
  //  console.log("Buyshare was called", position.portfolio[0].SharesOwned);
    await position.save();
}


const handleChange = async (userName, password, orderType, ticker, shares, price) => {
    const currentPortfolio = await findPortfolioByCred(userName, password);
   // currentPortfolio = await currentPortfolio;
   // console.log(currentPortfolio);
    let position = currentPortfolio[0];
    let index = 0;
    for (var i = 0; i < position.portfolio.length; i++) {
   //     console.log("the ticker here is", position.portfolio[i].Ticker);
        if (position.portfolio[i].Ticker == ticker) {
            index = i;
        }
    }
  //  console.log("Position is", position);
  //  console.log("OrderType is", orderType);
    if (orderType == "Sell" && typeof position === "undefined") {
        if (shares == 0) {
            return true;
        } else {
            return false;
        }
    } else if (orderType == "Sell" && shares > position.portfolio[index].SharesOwned) {
        return false;
    } else if (orderType == "Sell" && shares <= position.portfolio[index].SharesOwned) {
        sellShare(position, shares, price, index);
        return true;
    } else if (orderType == "Buy") {
        buyShare(position, shares, price, index);
        return true;
    } else {
        return false;
    }
}

app.use("/api/login", async (req, res) => {
    const profile = await findPortfolioByCred(req.body.username, req.body.password)
   // console.log(profile);
    if (profile.length == 0) {
        res.status(201).send(false);
    } else {
        res.status(201).send(true);
    }
})


// API returns the portfolio of the user. 
app.use('/api/Investor/portfolio', async (req, res) => {
    var portfolio = await findPortfolioByCred(req.body.username, req.body.password)

    res.json({data: portfolio});
})


// API modifies a position according to the user's API request.
// If the ticker symbol didn't exist in the portfolio yet, a new document
//      will be created. Otherwise, changes will be made to the existing position.
app.post('/api/Investor/changePosition', (req, res) => {
  const { orderType, ticker, shares, price } = req.body;
    const outcome = handleChange("Investor", "Password", orderType, ticker, shares, price);
    if (outcome) {
        res.status(201).json({ success: true });
    } else {
        res.status(400);
    }
})





app.listen(4400, () => {
  console.log('Server is listening on port 4400....')
})

//process.exit();