require('dotenv').config();


const mongoose = require("mongoose");

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


const createAndSavePosition = () => {
    var newPos = new Position({
        CompanyName: "JP Morgan",
        Ticker: "JPM",
        SharesOwned: 100,
        SharePrice: 100,
        TotalCost: 10000,
        TotalValue: 10000,
        EstimatedDivPayout: 100,
        EstimatedDivYield: 100
    });
    newPos.save().then(saved => {
        saved === newPos; // true
    });
};

const finished = function(err, data) {
    if (err) {
        console.log("There has been an error");
        console.log(err);
        return;
    } else {
        console.log("The code is done");
        console.log(data);
    }
}

createAndSavePosition();
