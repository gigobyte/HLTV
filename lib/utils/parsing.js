"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.text = function (el) { return el.text(); };
exports.prev = function (el) { return el.prev(); };
exports.hasChild = function (childSelector) { return function (el) { return el.find(childSelector).length !== 0; }; };
exports.popSlashSource = function (el) { return el.attr('src').split('/').pop(); };
