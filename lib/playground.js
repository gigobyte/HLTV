"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
index_1.default.getMatches().then(function (res) { return console.log(res); });
index_1.default.getResults().then(function (result) { return console.log(result); });
