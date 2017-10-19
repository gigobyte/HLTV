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
var cheerio = require("cheerio");
var RoundOutcome_1 = require("../models/RoundOutcome");
var MapSlug_1 = require("../enums/MapSlug");
var E = require("../utils/parsing");
var rp = require('request-promise');
var Agent = require('socks5-http-client/lib/Agent');
exports.fetchPage = function (url) { return __awaiter(_this, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = cheerio).load;
                return [4, rp.get({
                        url: url,
                        agentClass: Agent,
                        agentOptions: {
                            socksHost: process.env.SOCKET_HOST,
                            socksPort: process.env.SOCKET_PORT
                        }
                    })
                        .then(function (res) { return res.text(); })];
            case 1: return [2, _b.apply(_a, [_c.sent()])];
        }
    });
}); };
exports.toArray = function (elements) { return elements.toArray().map(cheerio); };
exports.getMapSlug = function (map) { return MapSlug_1.default[map]; };
exports.mapVetoElementToModel = function (el, team1, team2) {
    var _a = el.text().replace(/^\d. /, '').split(/removed|picked/), teamName = _a[0], map = _a[1];
    if (!map || !teamName) {
        return {
            map: exports.getMapSlug(el.text().split(' ')[1]),
            type: 'other'
        };
    }
    return {
        team: [team1, team2].find(function (t) { return t.name === teamName.trim(); }),
        map: exports.getMapSlug(map.trim()),
        type: el.text().includes('picked') ? 'picked' : 'removed'
    };
};
exports.getMatchPlayer = function (playerEl) {
    var link = playerEl.parent().attr('href');
    return {
        name: playerEl.find('.text-ellipsis').text(),
        id: link ? Number(link.split('/')[2]) : undefined
    };
};
exports.getMatchFormatAndMap = function (mapText) {
    if (mapText && !mapText.includes('bo')) {
        return { map: mapText, format: 'bo1' };
    }
    return { format: mapText };
};
exports.mapRoundElementToModel = function (team1Id, team2Id) { return function (el, i) {
    var outcomeString = E.popSlashSource(el).split('.')[0];
    var outcome = Object.entries(RoundOutcome_1.Outcome).find(function (_a) {
        var _ = _a[0], v = _a[1];
        return v === outcomeString;
    });
    return {
        outcome: outcome && outcome[1],
        score: el.attr('title'),
        ctTeam: i < 15 ? team1Id : team2Id,
        tTeam: i < 15 ? team2Id : team1Id
    };
}; };
exports.getMapsStatistics = function (source) {
    var valueRegex = /"value":"(\d|\.)+%?"/g;
    var labelRegex = /label":"\w+/g;
    var splitRegex = /%?"/;
    if (!source.match(labelRegex)) {
        return;
    }
    var maps = source.match(labelRegex).map(function (x) { return x.split(':"')[1]; });
    var values = source.match(valueRegex).map(function (x) { return Number(x.split(':"')[1].split(splitRegex)[0]); });
    var getStats = function (index) { return ({
        winningPercentage: values[index],
        ctWinningPercentage: values[index + maps.length * 1],
        tWinningPercentage: values[index + maps.length * 2],
        timesPlayed: values[index + maps.length * 3]
    }); };
    return maps.reduce(function (stats, map, i) {
        return (__assign({}, stats, (_a = {}, _a[MapSlug_1.default[map]] = getStats(i), _a)));
        var _a;
    }, {});
};
exports.getTimestamp = function (source) {
    var _a = source.split('/'), day = _a[0], month = _a[1], year = _a[2];
    return new Date([month, day, year].join('/')).getTime();
};
