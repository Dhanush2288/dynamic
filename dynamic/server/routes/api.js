var express = require("express");
var Router = express.Router();
var mongoose = require("mongoose");
const { query } = require("express");
var dateFormat = require("dateformat");
var moment = require("moment-timezone");
var now = new Date();
const uploadFile = require("../middleware/upload");

var db = mongoose.connection;
Router.get("/i/dynamicapi", function (req, res) {
  console.log("incoming data:", req.query);
  req.query.createdAT = new Date(moment.tz("Asia/Kolkata"));
  db.collection("forms").insertOne(req.query, function (err, collection) {
    console.log("*********Completed********", req.query);
    if (err) {
      console.log(err);
      res.send("error occured");
    } else {
      res.send(`*2222#<Gsm.loc: >`);
    }
  });
});

Router.post("/i/dynamicapi", function (req, res) {
  req.body.Annotation = "new record";
  req.body.createdAT = new Date(moment.tz("Asia/Kolkata"));

  if (req.body.deviceID == null && req.body.projectID == null) {
    console.log(req.body);
    req.body.deviceID = "testing";
    req.body.projectID = "testing";
  }
  db.collection("forms").insertOne(req.body, function (err, collection) {
    if (err) {
      console.log(err);
      res.send({ success: false, message: "error occured" });
    } else {
      console.log("data inserted");
      res.send({
        success: true,
        message: "data saved succesfully",
        data: req.body,
      });
      console.log(req.body);
    }
  });
});

Router.get("/get-full-data", (req, res) => {
  var endDate = new Date();
  var startDate = new Date(endDate - 24 * 60 * 1000 * 60);
  var B = req.query.deviceID;
  forms
    .find({ deviceID: B, createdAT: { $gte: startDate } })
    .exec((err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send({ success: true, data: data });
      }
    });
});

const Schema = mongoose.Schema;
const formSchema = new Schema({}, { strict: false });
const forms = mongoose.model("forms", formSchema, "forms");
const AudioSChema = new Schema(
  {
    audiolink: { type: String },
    projectID: { type: String, required: true },
    audioname: {type:String}
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
const audio = mongoose.model("audio", AudioSChema, "audio");

Router.get("/r/dynamicapi", function (req, res) {
  console.log(req.query);
  doo = new Date(req.query.Date);
  doo.setHours(0, 0, 0, 0);

  var momentDate = moment.tz(doo,"Asia/Kolkata").toDate();
  var tmr = new Date(req.query.EndDate);
  tmr.setHours(0, 0, 0, 0);
  tmr.setDate(tmr.getDate()+1)
  var momentDate1 = moment.tz(tmr,"Asia/Kolkata").toDate();

  console.log(momentDate, momentDate1);

  forms
    .find({
      projectID: req.query.projectID,
      createdAT: { $gte: momentDate, $lte: momentDate1 },
    })
    .lean()
    .sort({ createdAT: -1 })
    .exec(function (err, collection) {
      if (err) {
        res.send(err);
      } else {
        for (let i = 0; i < collection.length; i++) {
          collection[i] = { ...{ SlData: i }, ...collection[i] };
        }
        res.send({ success: true, data: collection });
      }
    });
});
Router.get("/r/dynamicapi1", function (req, res) {
  forms
    .find(req.query)
    .lean()
    .sort({ createdAT: -1 })
    .exec(function (err, collection) {
      if (err) {
        res.send({ success: false, data: collection });
      } else {
        for (let i = 0; i < collection.length; i++) {
          collection[i] = { ...{ SlData: i }, ...collection[i] };
        }
        res.send({ success: true, data: collection });
      }
    });
});
Router.get("/r/id/dynamicapi", function (req, res) {
  forms
    .find(req.query)
    .lean()
    .exec(function (err, collection) {
      if (err) {
        res.send(err);
      } else {
        var id = [];

        for (var i = 0; i < collection.length; i++) {
          var newarray = collection[i].projectID;
          id.push(newarray);
        }
        var unique = [...new Set(id)];
        console.log(unique);

        var finalrespone = {};
        finalrespone.data = {};
        finalrespone.data.success = "true";
        finalrespone.data.projectID = unique;
        res.send(finalrespone);
      }
    });
});

Router.get("/r/id/audio", function (req, res) {
  audio
    .find(req.query)
    .lean()
    .exec(function (err, collection) {
      if (err) {
        res.send(err);
      } else {
        var id = [];

        for (var i = 0; i < collection.length; i++) {
          var newarray = collection[i].projectID;
          id.push(newarray);
        }
        var unique = [...new Set(id)];
        console.log(unique);

        var finalrespone = {};
        finalrespone.data = {};
        finalrespone.data.success = "true";
        finalrespone.data.projectID = unique;
        res.send(finalrespone);
      }
    });
});
Router.get("/r/audioapi", function (req, res) {
  console.log(req.query);
  doo = new Date(req.query.Date);
  doo.setHours(0, 0, 0, 0);
  var momentDate = moment(doo).toDate();
  console.log(moment(doo), moment(doo).toDate());
  var tmr = new Date(momentDate);
  tmr.setDate(tmr.getDate() + 1);
  tmr.setHours(0, 0, 0, 0);
  console.log( req.query.projectID,momentDate,tmr);
  audio
    .find({
      projectID: req.query.projectID
      })
    .lean()
    .sort({ createdAT: -1 })
    .exec(function (err, collection) {
      if (err) {
        
        res.send(err);
      } else {
        console.log(collection);
        for (let i = 0; i < collection.length; i++) {
          collection[i] = { ...{ SlData: i }, ...collection[i] };
        }
        res.send({ success: true, data: collection });
      }
    });
});
Router.get("/r", function (req, res) {
  audio
    .find({})
    .lean()
    .sort({ createdAT: -1 })
    .exec(function (err, collection) {
      if (err) {
        res.send({ success: false, data: collection });
      } else {
        for (let i = 0; i < collection.length; i++) {
          collection[i] = { ...{ SlData: i }, ...collection[i] };
        }
        res.send({ success: true, data: collection });
      }
    });
});
Router.post("/api", async function (req, res) {
  try {
    await uploadFile(req, res);
    var au = new audio();
    au.projectID = req.body.projectID;
    au.audioname=req.file.originalname;
    au.audiolink = `http://appservices.vetinstant.com:4000/uploads/${req.file.originalname}`;
    console.log(au.audiolink);
    au.save(function (err, success5) {
      if (err) {
        res.send({
          success: false,
          message: "Error",
        });
      } else {
        res.send({
          success: true,
          message: "successfully created starred",
          data: success5,
        });
      }
    });
  } catch (err) {
    if (err) {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }
  }
});
Router.get("/deleteprojectID/:projectID", async function (req, res) {
  try {
    forms.deleteMany({projectID:req.params.projectID})
    .exec(function (err, collection) {
      if (err) {
        res.send({ success: false, data: collection });
      } else {
        if(collection.deletedCount=!0){
          res.send({ success: true, data: collection });         
        }else{
          res.send({ success: false, data: collection });
        }
      }
    });    // forms.save(function (err, success5) {
    //   if (err) {
    //     res.send({
    //       success: false,
    //       message: "Error",
    //     });
    //   } else {
    //     res.send({
    //       success: true,
    //       message: "successfully created starred",
    //       data: success5,
    //     });
    //   }
    // });
  } catch (err) {
    if (err) {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }
  }
});
module.exports = Router;
