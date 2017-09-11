"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
index_1.default.getTeamStats({ id: 6669 }).then(function (res) { return console.dir(res, { depth: null }); }).catch(function (err) { return console.log(err); });
