"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
index_1.default.getPlayer({ id: 1339 }).then(function (res) { return console.dir(res, { depth: null }); }).catch(function (err) { return console.log(err); });
