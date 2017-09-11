"use strict";
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
var constants_1 = require("../utils/constants");
var mappers_1 = require("../utils/mappers");
var getMatchesStats = function (_a) {
    var _b = _a === void 0 ? {} : _a, startDate = _b.startDate, endDate = _b.endDate, matchType = _b.matchType, maps = _b.maps;
    return __awaiter(_this, void 0, void 0, function () {
        var query, page, $, matches;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = "startDate=" + startDate + "&endDate=" + endDate + "&matchtype=" + matchType + [''].concat(maps).join('&maps=');
                    page = 0;
                    matches = [];
                    _a.label = 1;
                case 1: return [4, mappers_1.fetchPage(constants_1.HLTV_URL + "/stats/matches?" + query + "&offset=" + page * 50)];
                case 2:
                    $ = _a.sent();
                    page++;
                    matches = matches.concat(mappers_1.toArray($('.matches-table tbody tr')).map(function (matchEl) {
                        var id = Number(matchEl.find('.date-col a').attr('href').split('/')[4]);
                        var date = Number(matchEl.find('.time').attr('data-unix'));
                        var map = matchEl.find('.dynamic-map-name-short').text();
                        var team1 = {
                            id: Number(matchEl.find('.team-col a').first().attr('href').split('/')[3]),
                            name: matchEl.find('.team-col a').first().text()
                        };
                        var team2 = {
                            id: Number(matchEl.find('.team-col a').last().attr('href').split('/')[3]),
                            name: matchEl.find('.team-col a').last().text()
                        };
                        var event = {
                            id: Number(matchEl.find('.event-col a').attr('href').split('event=')[1].split('&')[0]),
                            name: matchEl.find('.event-col a').text()
                        };
                        var result = {
                            team1: Number(matchEl.find('.team-col .score').first().text().trim().replace(/\(|\)/g, '')),
                            team2: Number(matchEl.find('.team-col .score').last().text().trim().replace(/\(|\)/g, ''))
                        };
                        return { id: id, date: date, map: map, team1: team1, team2: team2, event: event, result: result };
                    }));
                    _a.label = 3;
                case 3:
                    if ($('.matches-table tbody tr').length !== 0) return [3, 1];
                    _a.label = 4;
                case 4: return [2, matches];
            }
        });
    });
};
exports.default = getMatchesStats;
