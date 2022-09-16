const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/countriesDB");

const countrySchema = {
  country: String,
  capital: String
};

const Country =  mongoose.model("Country", countrySchema);

// RESTful Api creation - genaral countries data. Request targeting all countries
app.route("/countries")
.get(function(req,res){
  Country.find(function(err, foundCountries){
    if(!err){
      res.send(foundCountries)
    } else {
      console.log(err);
    }
  });
})

.post(function(req, res){
  const countryName = req.body.country;
  const capitalName = req.body.capital;

  // console.log(countryName + " " + capitalName);

  const newCountry = new Country({
    country : countryName,
    capital : capitalName
  })
  newCountry.save(function(err){
    if(!err){
      res.send("Successfully added a new country data");
    } else {
      res.send(err)
    }
  });
})

.delete(function(req, res){
  Country.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all countries data");
    } else {
      res.send(err);
    }
  })
});


// Specific countries data. Request targeting a specific country
app.route("/countries/:countryName")
.get(function(req, res){
  Country.findOne({country : req.params.countryName}, function(err, foundCountry){
    if(!err){
      res.send(foundCountry)
    } else {
      res.send(err)
    }
  });
})

.put(function(req, res){
  const countryName = req.body.country;
  const capitalName = req.body.capital;
  Country.updateOne({country : req.params.countryName}, {country : countryName, capital: capitalName}, function(err){
    if(!err){
      res.send("Successfully updated country field");
    } else {
      res.send(err)
    }
  });
})

.patch(function(req, res){
  Country.updateOne({country : req.params.countryName}, {$set : {country : req.body.country, capital : req.body.capital}}, function(err){
    if(!err){
      res.send("Succesfully updated a particular data in this field");
    } else {
      res.send(err)
    }
  });
})

.delete(function(req, res){
  Country.deleteOne({country : req.params.countryName}, function(err){
    if(!err){
      res.send("Successfully deleted this field")
    } else {
      res.send(err)
    }
  })
});


app.listen("3000", function(req, res){
  console.log("Server is running on port 3000");
});
