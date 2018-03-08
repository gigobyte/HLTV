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
var E = require("../utils/parsing");
var constants_1 = require("../utils/constants");
var mappers_1 = require("../utils/mappers");
var getMatch = function (_a) {
    var id = _a.id;
    return __awaiter(_this, void 0, void 0, function () {
        var $, title, date, format, additionalInfo, live, hasScorebot, teamEls, team1, team2, vetoes, event, maps, mapIds, players, streams, highlightedPlayerLink, highlightedPlayer, highlights;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4, mappers_1.fetchPage(constants_1.HLTV_URL + "/matches/" + id + "/-")];
                case 1:
                    $ = _b.sent();
                    title = $('.timeAndEvent .text').text() === ' ' ? undefined : $('.timeAndEvent .text').text();
                    date = Number($('.timeAndEvent .date').attr('data-unix'));
                    format = $('.preformatted-text').text().split('\n')[0];
                    additionalInfo = $('.preformatted-text').text().split('\n').slice(1).join(' ').trim();
                    live = $('.countdown').text() === 'LIVE';
                    hasScorebot = $('#scoreboardElement').length !== 0;
                    teamEls = $('div.teamName');
                    team1 = teamEls.first().text() ? {
                        name: teamEls.eq(0).text(),
                        id: Number(E.popSlashSource(teamEls.first().prev()))
                    } : undefined;
                    team2 = teamEls.last().text() ? {
                        name: teamEls.eq(1).text(),
                        id: Number(E.popSlashSource(teamEls.last().prev()))
                    } : undefined;
                    vetoes = team1 && team2 && mappers_1.toArray($('.veto-box').last().find('.padding > div'))
                        .map(function (el) { return mappers_1.mapVetoElementToModel(el, team1, team2); });
                    event = {
                        name: $('.timeAndEvent .event').text(),
                        id: Number($('.timeAndEvent .event').children().first().attr('href').split('/')[2])
                    };
                    maps = mappers_1.toArray($('.mapholder')).map(function (mapEl) {
                        var result = mapEl.find('.results');
                        var t_first = result.find('.t').first().text();
                        var ct_first = result.find('.ct').first().text();
                        var t_second = result.find('.t').last().text() === t_first ? '' : result.find('.t').last().text();
                        var ct_second = result.find('.ct').last().text() === ct_first ? '' : result.find('.ct').last().text();
                        return {
                            name: mappers_1.getMapSlug(mapEl.find('.mapname').text()),
                            result: result.text(),
                            first_left: result.children().first().next().next().next().next().attr('class'),
                            t_first: t_first,
                            ct_first: ct_first,
                            t_second: t_second,
                            ct_second: ct_second
                        };
                    });
                    mapIds = mappers_1.toArray($('.stats-menu-link'))
                        .filter(function (mapEl) { return mapEl.children().attr('id') !== 'all'; })
                        .map(function (mapEl) {
                        return mapEl.children().attr('id');
                    });
                    players = team1 && team2 && {
                        team1: mappers_1.toArray($('div.players').first().find('tr').last().find('.flagAlign')).map(mappers_1.getMatchPlayer),
                        team2: mappers_1.toArray($('div.players').last().find('tr').last().find('.flagAlign')).map(mappers_1.getMatchPlayer)
                    };
                    streams = mappers_1.toArray($('.stream-box')).filter(E.hasChild('.flagAlign')).map(function (streamEl) { return ({
                        name: streamEl.find('.flagAlign').text(),
                        link: streamEl.attr('data-stream-embed'),
                        viewers: Number(streamEl.find('.viewers').text())
                    }); });
                    highlightedPlayerLink = $('.highlighted-player').find('.flag').next().attr('href');
                    highlightedPlayer = highlightedPlayerLink ? {
                        name: highlightedPlayerLink.split('/').pop(),
                        id: Number(highlightedPlayerLink.split('/')[2]),
                    } : undefined;
                    highlights = team1 && team2 && mappers_1.toArray($('.highlight')).map(function (highlightEl) { return ({
                        link: highlightEl.attr('data-highlight-embed'),
                        title: highlightEl.text()
                    }); });
                    return [2, {
                            team1: team1, team2: team2, date: date, format: format, additionalInfo: additionalInfo, event: event, maps: maps, mapIds: mapIds, players: players, streams: streams, live: live,
                            title: title, hasScorebot: hasScorebot, highlightedPlayer: highlightedPlayer, vetoes: vetoes, highlights: highlights
                        }];
            }
        });
    });
};
exports.default = getMatch;
