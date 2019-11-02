"use strict";
import express from "express";
import cors from "cors";

const { Client } = require("tplink-smarthome-api");

const client = new Client();

const plugs = {
  hs100_1: "192.168.1.204",
  hs100_2: "192.168.1.205",
  hs105_1: "192.168.1.206",
  hs105_2: "192.168.1.207",
  hs105_mini_1: "192.168.1.208",
  hs105_mini_2: "192.168.1.209"
};

// var whitelist = ["https://48oak.ca", "https://www.48oak.ca"];
var corsOptions = {
  origin: function(origin: string, callback: any) {
    callback(null, true);
    // console.log(origin);
    // if (whitelist.indexOf(origin) !== -1) {
    //   callback(null, true);
    // } else {
    //   callback(new Error("Not allowed by CORS"));
    // }
  }
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// var https = require("https");
// var http = require("http");
// var fs = require("fs");

// var options = {
//   key: fs.readFileSync("./privatekey.key"),
//   cert: fs.readFileSync("./certificate.crt")
// };


Object.keys(plugs).forEach((key: keyof typeof plugs) => {
  app.post(`/${key}`, (req, res) => {
    client.getDevice({ host: plugs[key] }).then((device: any) => {
      device.setPowerState(req.body.on);
      console.log(req.body)
      res.status(200).json({ new_state: req.body.on });
    });
  });
});

Object.keys(plugs).forEach((key: keyof typeof plugs) => {
  app.get(`/${key}`, (req, res) => {
    console.log('request received')
    client.getDevice({ host: plugs[key] }).then((device: any) => {
      device.getSysInfo().then((sysInfo: any) => res.status(200).json(sysInfo));
    });
  });
});

// app.get("/", (req, res) => {
//   console.log("got");
//   res.status(200).json({ hey: "there" });
// });

// http.createServer(app).listen(80);
// https.createServer(options, app).listen(443);

app.listen(80);
console.log("listening");