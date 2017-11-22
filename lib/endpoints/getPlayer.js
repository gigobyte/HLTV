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
var getPlayer = function (_a) {
    var id = _a.id;
    return __awaiter(_this, void 0, void 0, function () {
        var $, name, ign, shownImageOld, shownImage, image, coverImage, age, twitter, twitch, facebook, country, team, getMapStat, statistics, achievements;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4, mappers_1.fetchPage(constants_1.HLTV_URL + "/player/" + id + "/-")];
                case 1:
                    $ = _b.sent();
                    name = $('.subjectname').text().replace(/".+" /, '').trim() || undefined;
                    ign = $('.subjectname').text().match(/".+"/)[0].replace(/"/g, '');
                    shownImageOld = $('.containedImageFrame img');
                    shownImage = shownImageOld.length ? shownImageOld : $('.profileImage');
                    image = !shownImage.attr('src').includes('blankplayer') ? shownImage.attr('src') : undefined;
                    coverImage = $('.coverImage').attr('data-bg-image');
                    age = Number($($('.subjectname').next().contents().get(3)).text().trim().split(' ')[0]);
                    twitter = $($('.player-some').find('a').get(0)).attr('href');
                    twitch = $($('.player-some').find('a').get(1)).attr('href');
                    facebook = $($('.player-some').find('a').get(2)).attr('href');
                    country = {
                        name: $('.subjectname').next().children().first().attr('title'),
                        code: E.popSlashSource($('.subjectname').next().children().first()).split('.')[0]
                    };
                    if ($('.team-logo-container img').length) {
                        team = {
                            name: $('.team-logo-container img').attr('title'),
                            id: Number(E.popSlashSource($('.team-logo-container img')))
                        };
                    }
                    getMapStat = function (i) { return Number($($('.standard-box .two-col').find('.cell').get(i)).find('.statsVal').text().replace('%', '')); };
                    statistics = {
                        rating: getMapStat(0),
                        killsPerRound: getMapStat(1),
                        headshots: getMapStat(2),
                        mapsPlayed: getMapStat(3),
                        deathsPerRound: getMapStat(4),
                        roundsContributed: getMapStat(5)
                    };
                    achievements = mappers_1.toArray($('.achievement')).map(function (achEl) { return ({
                        place: $(achEl.contents().get(1)).text().split(' at')[0],
                        event: {
                            name: $(achEl.contents().get(2)).text(),
                            id: Number($(achEl.contents().get(2)).attr('href').split('/')[2])
                        }
                    }); });
                    return [2, { name: name, ign: ign, image: image, coverImage: coverImage, age: age, twitter: twitter, twitch: twitch, facebook: facebook, country: country, team: team, statistics: statistics, achievements: achievements }];
            }
        });
    });
};
exports.default = getPlayer;
