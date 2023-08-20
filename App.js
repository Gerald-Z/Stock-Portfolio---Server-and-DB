require('dotenv').config();


const mongoose = require("mongoose");

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

const BX = {
        CompanyName: "Blackstone Inc",
        Ticker: "BX",
        SharesOwned: 20,
        SharePrice: 100,
        TotalCost: 1000,
        TotalValue: 10000,
        EstimatedDivPayout: 100,
        EstimatedDivYield: 100
        };
const BLK = {
        CompanyName: "Blackrock Inc",
        Ticker: "BLK",
        SharesOwned: 20,
        SharePrice: 100,
        TotalCost: 1000,
        TotalValue: 10000,
        EstimatedDivPayout: 100,
        EstimatedDivYield: 100
        };
const GS = {
        CompanyName: "Goldman Sachs",
        Ticker: "GS",
        SharesOwned: 20,
        SharePrice: 100,
        TotalCost: 1000,
        TotalValue: 10000,
        EstimatedDivPayout: 100,
        EstimatedDivYield: 100
        };



const createAndSavePosition = () => {
    var newPos = new Position({
        name: "Investor",
        portfolio: [BX, BLK, GS]
    });
    
    newPos.save().then(saved => {
        console.log(saved === newPos); // true
    }).then(saved => {process.exit()});
  //  process.exit();
   // console.log("Done");
};



createAndSavePosition();
//process.exit();