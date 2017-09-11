"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var E = require("../utils/parsing");
var constants_1 = require("../utils/constants");
var mappers_1 = require("../utils/mappers");
var getStreams = function (_a) {
    var loadLinks = (_a === void 0 ? {} : _a).loadLinks;
    return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        var $, streams;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, mappers_1.fetchPage("" + constants_1.HLTV_URL)];
                case 1:
                    $ = _a.sent();
                    streams = Promise.all(mappers_1.toArray($('a.col-box.streamer')).map(function (streamEl) { return __awaiter(_this, void 0, void 0, function () {
                        var name, category, country, viewers, hltvLink, stream, $streamPage, realLink;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    name = streamEl.find('.name').text();
                                    category = streamEl.children().first().attr('title');
                                    country = {
                                        name: streamEl.find('.flag').attr('title'),
                                        code: E.popSlashSource(streamEl.find('.flag')).split('.')[0]
                                    };
                                    viewers = Number(streamEl.contents().last().text());
                                    hltvLink = streamEl.attr('href');
                                    stream = { name: name, category: category, country: country, viewers: viewers, hltvLink: hltvLink };
                                    if (!loadLinks) return [3, 2];
                                    return [4, mappers_1.fetchPage("" + constants_1.HLTV_URL + hltvLink)];
                                case 1:
                                    $streamPage = _a.sent();
                                    realLink = $streamPage('iframe').attr('src');
                                    return [2, __assign({}, stream, { realLink: realLink })];
                                case 2: return [2, stream];
                            }
                        });
                    }); }));
                    return [4, streams];
                case 2: return [2, _a.sent()];
            }
        });
    });
};
exports.default = getStreams;
