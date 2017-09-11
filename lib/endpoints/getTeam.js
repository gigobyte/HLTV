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
var getTeam = function (_a) {
    var id = _a.id;
    return __awaiter(_this, void 0, void 0, function () {
        var t$, e$, name, logo, coverImage, location, facebook, twitter, rank, players, recentResults, rankingDevRegex, rankings, hasRank, rankingDevelopment, bigAchievements, mapStatistics, events;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, mappers_1.fetchPage(constants_1.HLTV_URL + "/team/" + id + "/-")];
                case 1:
                    t$ = _a.sent();
                    return [4, mappers_1.fetchPage(constants_1.HLTV_URL + "/events?team=" + id)];
                case 2:
                    e$ = _a.sent();
                    name = t$('.subjectname').text();
                    logo = constants_1.HLTV_STATIC_URL + "/images/team/logo/" + id;
                    coverImage = t$('.coverImage').attr('data-bg-image');
                    location = t$(t$('.fa-map-marker').parent().contents().get(3)).text().trim();
                    facebook = t$(t$('.fa-map-marker').parent().contents().get(4)).attr('href');
                    twitter = t$(t$('.fa-map-marker').parent().contents().get(6)).attr('href');
                    rank = Number(t$(t$('.fa-map-marker').parent().contents().last()).text().split('#')[1]) || undefined;
                    players = mappers_1.toArray(t$('.overlayImageFrame')).filter(E.hasChild('.playerFlagName .text-ellipsis')).map(function (playerEl) { return ({
                        name: playerEl.find('.playerFlagName .text-ellipsis').text(),
                        id: Number(playerEl.find('.playerFlagName .text-ellipsis').attr('href').split('/')[2])
                    }); });
                    recentResults = mappers_1.toArray(t$('.results-holder .a-reset')).map(function (matchEl) { return ({
                        matchID: matchEl.attr('href') ? Number(matchEl.attr('href').split('/')[2]) : undefined,
                        enemyTeam: {
                            id: Number(E.popSlashSource(t$(matchEl.find('.team-logo').get(1)))),
                            name: t$(matchEl.find('.team').get(1)).text()
                        },
                        result: matchEl.find('.result-score').text(),
                        event: {
                            id: Number(E.popSlashSource(matchEl.find('.event-logo')).split('.')[0]),
                            name: matchEl.find('.event-name').text()
                        }
                    }); });
                    rankingDevRegex = /value":"\d+(?="})/g;
                    rankings = t$('.graph').attr('data-fusionchart-config').match(rankingDevRegex);
                    hasRank = t$('.graph').attr('data-fusionchart-config').match(rankingDevRegex) !== null;
                    rankingDevelopment = hasRank ? rankings.map(function (m) { return m.split(':"')[1]; }).map(Number) : undefined;
                    bigAchievements = mappers_1.toArray(t$('.achievement')).map(function (achEl) { return ({
                        place: t$(achEl.contents().get(1)).text().split(' at')[0],
                        event: {
                            name: t$(achEl.contents().get(2)).text(),
                            id: Number(t$(achEl.contents().get(2)).attr('href').split('/')[2])
                        }
                    }); });
                    mapStatistics = mappers_1.getMapsStatistics(t$(t$('.graph').get(1)).attr('data-fusionchart-config'));
                    events = mappers_1.toArray(e$('a.big-event')).map(function (eventEl) { return ({
                        name: eventEl.find('.big-event-name').text(),
                        id: Number(eventEl.attr('href').split('/')[2])
                    }); }).concat(mappers_1.toArray(e$('a.small-event')).map(function (eventEl) { return ({
                        name: eventEl.find('.event-col .text-ellipsis').text(),
                        id: Number(eventEl.attr('href').split('/')[2])
                    }); })).concat(mappers_1.toArray(e$('a.ongoing-event')).map(function (eventEl) { return ({
                        name: eventEl.find('.event-name-small .text-ellipsis').text(),
                        id: Number(eventEl.attr('href').split('/')[2])
                    }); }));
                    return [2, { name: name, logo: logo, coverImage: coverImage, location: location, facebook: facebook, twitter: twitter, rank: rank, players: players, recentResults: recentResults, rankingDevelopment: rankingDevelopment, bigAchievements: bigAchievements, mapStatistics: mapStatistics, events: events }];
            }
        });
    });
};
exports.default = getTeam;
