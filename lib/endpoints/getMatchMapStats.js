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
var getMatchMapStats = function (_a) {
    var id = _a.id;
    return __awaiter(_this, void 0, void 0, function () {
        var getMatchInfoRowValues, getPlayerTopStat, _b, m$, p$, matchPageID, map, date, team1, team2, event, teamStatProperties, teamStats, mostXProperties, mostX, overview, fullRoundHistory, _c, rh1, rh2, roundHistory, playerPerformanceStats, playerOverviewStats, playerStats, performanceOverview;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    getMatchInfoRowValues = function ($, index) {
                        var _a = $($('.match-info-row').get(index)).find('.right').text().split(' : ').map(Number), stat1 = _a[0], stat2 = _a[1];
                        return {
                            team1: stat1,
                            team2: stat2
                        };
                    };
                    getPlayerTopStat = function ($, index) {
                        return {
                            id: Number($($('.most-x-box').get(index)).find('.name > a').attr('href').split('/')[3]),
                            name: $($('.most-x-box').get(index)).find('.name > a').text(),
                            value: Number($($('.most-x-box').get(index)).find('.valueName').text())
                        };
                    };
                    return [4, Promise.all([
                            mappers_1.fetchPage(constants_1.HLTV_URL + "/stats/matches/mapstatsid/" + id + "/-"),
                            mappers_1.fetchPage(constants_1.HLTV_URL + "/stats/matches/performance/mapstatsid/" + id + "/-")
                        ])];
                case 1:
                    _b = _d.sent(), m$ = _b[0], p$ = _b[1];
                    matchPageID = Number(m$('.match-page-link').attr('href').split('/')[2]);
                    map = mappers_1.getMapSlug(m$(m$('.match-info-box').contents().get(3)).text().replace(/\n| /g, ''));
                    date = Number(m$('.match-info-box .small-text span').first().attr('data-unix'));
                    team1 = {
                        id: Number(E.popSlashSource(m$('.team-left .team-logo'))),
                        name: m$('.team-left .team-logo').attr('title')
                    };
                    team2 = {
                        id: Number(E.popSlashSource(m$('.team-right .team-logo'))),
                        name: m$('.team-right .team-logo').attr('title')
                    };
                    event = {
                        id: Number(m$('.match-info-box .text-ellipsis').first().attr('href').split('event=')[1]),
                        name: m$('.match-info-box .text-ellipsis').first().text()
                    };
                    teamStatProperties = ['rating', 'firstKills', 'clutchesWon'];
                    teamStats = teamStatProperties.reduce(function (res, prop, i) {
                        return (__assign({}, res, (_a = {}, _a[prop] = getMatchInfoRowValues(m$, i + 1), _a)));
                        var _a;
                    }, {});
                    mostXProperties = ['mostKills', 'mostDamage', 'mostAssists', 'mostAWPKills', 'mostFirstKills', 'bestRating'];
                    mostX = mostXProperties.reduce(function (res, prop, i) {
                        return (__assign({}, res, (_a = {}, _a[prop] = getPlayerTopStat(m$, i), _a)));
                        var _a;
                    }, {});
                    overview = __assign({}, teamStats, mostX);
                    fullRoundHistory = mappers_1.toArray(m$('.round-history-outcome')).map(mappers_1.mapRoundElementToModel(team1.id, team2.id));
                    _c = [fullRoundHistory.slice(0, 30), fullRoundHistory.slice(30, 60)], rh1 = _c[0], rh2 = _c[1];
                    roundHistory = rh1.reduce(function (history, round, i) { return history.concat([round, rh2[i]]); }, [])
                        .filter(function (r) { return r.outcome; });
                    playerPerformanceStats = mappers_1.toArray(p$('.highlighted-player')).reduce(function (map, playerEl) {
                        var graphData = playerEl.find('.graph.small').attr('data-fusionchart-config');
                        var data = {
                            id: Number(playerEl.find('.headline span a').attr('href').split('/')[2]),
                            killsPerRound: Number(graphData.split('Kills per round: ')[1].split('"')[0]),
                            deathsPerRound: Number(graphData.split('Deaths / round: ')[1].split('"')[0]),
                            impact: Number(graphData.split('Impact rating: ')[1].split('"')[0])
                        };
                        map[data.id] = data;
                        return map;
                    }, {});
                    playerOverviewStats = mappers_1.toArray(m$('.stats-table tbody tr')).map(function (rowEl) {
                        var id = Number(rowEl.find('.st-player a').attr('href').split('/')[3]);
                        var performanceStats = playerPerformanceStats[id];
                        return __assign({ id: id, name: rowEl.find('.st-player a').text(), kills: Number(rowEl.find('.st-kills').contents().first().text()), hsKills: Number(rowEl.find('.st-kills .gtSmartphone-only').text().replace(/\(|\)/g, '')), deaths: Number(rowEl.find('.st-deaths').text()), KAST: Number(rowEl.find('.st-kdratio').text().replace('%', '')), killDeathsDifference: Number(rowEl.find('.st-kddiff').text()), ADR: Number(rowEl.find('.st-adr').text()), firstKillsDifference: Number(rowEl.find('.st-fkdiff').text()), rating: Number(rowEl.find('.st-rating').text()) }, performanceStats);
                    });
                    playerStats = {
                        team1: playerOverviewStats.slice(0, 5),
                        team2: playerOverviewStats.slice(5)
                    };
                    performanceOverview = mappers_1.toArray(p$('.overview-table tr')).slice(1).reduce(function (res, rowEl) {
                        var stat = rowEl.find('.name-column').text();
                        var team1Stat = Number(rowEl.find('.team1-column').text());
                        var team2Stat = Number(rowEl.find('.team2-column').text());
                        var property = stat.toLowerCase();
                        return { team1: __assign({}, res.team1, (_a = {}, _a[property] = team1Stat, _a)), team2: __assign({}, res.team2, (_b = {}, _b[property] = team2Stat, _b)) };
                        var _a, _b;
                    }, {});
                    return [2, {
                            matchPageID: matchPageID, map: map, date: date, team1: team1, team2: team2, event: event, overview: overview, roundHistory: roundHistory, playerStats: playerStats, performanceOverview: performanceOverview
                        }];
            }
        });
    });
};
exports.default = getMatchMapStats;
