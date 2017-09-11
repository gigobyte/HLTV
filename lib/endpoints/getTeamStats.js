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
var E = require("../utils/parsing");
var getTeamStats = function (_a) {
    var id = _a.id;
    return __awaiter(_this, void 0, void 0, function () {
        var $, m$, e$, mp$, overviewStats, getOverviewStatByIndex, _a, wins, draws, losses, overview, getContainerByText, getPlayersByContainer, currentLineup, historicPlayers, standins, matches, events, getMapStat, mapStats;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4, mappers_1.fetchPage(constants_1.HLTV_URL + "/stats/teams/" + id + "/-")];
                case 1:
                    $ = _b.sent();
                    return [4, mappers_1.fetchPage(constants_1.HLTV_URL + "/stats/teams/matches/" + id + "/-")];
                case 2:
                    m$ = _b.sent();
                    return [4, mappers_1.fetchPage(constants_1.HLTV_URL + "/stats/teams/events/" + id + "/-")];
                case 3:
                    e$ = _b.sent();
                    return [4, mappers_1.fetchPage(constants_1.HLTV_URL + "/stats/teams/maps/" + id + "/-")];
                case 4:
                    mp$ = _b.sent();
                    overviewStats = $('.standard-box .large-strong');
                    getOverviewStatByIndex = function (i) { return Number(overviewStats.eq(i).text()); };
                    _a = overviewStats.eq(1).text().split('/').map(Number), wins = _a[0], draws = _a[1], losses = _a[2];
                    overview = {
                        mapsPlayed: getOverviewStatByIndex(0),
                        totalKills: getOverviewStatByIndex(2),
                        totalDeaths: getOverviewStatByIndex(3),
                        roundsPlayed: getOverviewStatByIndex(4),
                        kdRatio: getOverviewStatByIndex(5),
                        wins: wins, draws: draws, losses: losses
                    };
                    getContainerByText = function (text) { return $('.standard-headline').filter(function (_, el) { return $(el).text() === text; }).parent().next(); };
                    getPlayersByContainer = function (container) { return mappers_1.toArray(container.find('.image-and-label')).map(function (playerEl) { return ({
                        id: Number(playerEl.attr('href').split('/')[3]),
                        name: playerEl.find('.text-ellipsis').text()
                    }); }); };
                    currentLineup = getPlayersByContainer(getContainerByText('Current lineup'));
                    historicPlayers = getPlayersByContainer(getContainerByText('Historic players'));
                    standins = getPlayersByContainer(getContainerByText('Standins'));
                    matches = mappers_1.toArray(m$('.stats-table tbody tr')).map(function (matchEl) { return ({
                        dateApproximate: mappers_1.getTimestamp(matchEl.find('.time a').text()),
                        event: {
                            id: Number(E.popSlashSource(matchEl.find('.image-and-label img')).split('.')[0]),
                            name: matchEl.find('.image-and-label img').attr('title')
                        },
                        enemyTeam: {
                            id: Number(matchEl.find('img.flag').parent().attr('href').split('/')[3]),
                            name: matchEl.find('img.flag').parent().contents().last().text()
                        },
                        map: mappers_1.getMapSlug(matchEl.find('.statsMapPlayed span').text()),
                        result: matchEl.find('.statsDetail').text()
                    }); });
                    events = mappers_1.toArray(e$('.stats-table tbody tr')).map(function (eventEl) { return ({
                        place: eventEl.find('.statsCenterText').text(),
                        event: {
                            id: Number(eventEl.find('.image-and-label').first().attr('href').split('=')[1]),
                            name: eventEl.find('.image-and-label').first().attr('title')
                        }
                    }); });
                    getMapStat = function (mapEl, i) { return mapEl.find('.stats-row').eq(i).children().last().text(); };
                    mapStats = mappers_1.toArray(mp$('.two-grid .col .stats-rows')).reduce(function (stats, mapEl) {
                        var mapName = mappers_1.getMapSlug(mapEl.prev().find('.map-pool-map-name').text());
                        stats[mapName] = {
                            wins: Number(getMapStat(mapEl, 0).split(' / ')[0]),
                            draws: Number(getMapStat(mapEl, 0).split(' / ')[1]),
                            losses: Number(getMapStat(mapEl, 0).split(' / ')[2]),
                            winRate: Number(getMapStat(mapEl, 1).split('%')[0]),
                            totalRounds: Number(getMapStat(mapEl, 2)),
                            roundWinPAfterFirstKill: Number(getMapStat(mapEl, 3).split('%')[0]),
                            roundWinPAfterFirstDeath: Number(getMapStat(mapEl, 4).split('%')[0])
                        };
                        return stats;
                    }, {});
                    return [2, { overview: overview, currentLineup: currentLineup, historicPlayers: historicPlayers, standins: standins, events: events, mapStats: mapStats, matches: matches }];
            }
        });
    });
};
exports.default = getTeamStats;
