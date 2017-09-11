"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var connectToScorebot_1 = require("./endpoints/connectToScorebot");
var getMatch_1 = require("./endpoints/getMatch");
var getMatches_1 = require("./endpoints/getMatches");
var getMatchesStats_1 = require("./endpoints/getMatchesStats");
var getMatchMapStats_1 = require("./endpoints/getMatchMapStats");
var getRecentThreads_1 = require("./endpoints/getRecentThreads");
var getResults_1 = require("./endpoints/getResults");
var getStreams_1 = require("./endpoints/getStreams");
var getTeamRanking_1 = require("./endpoints/getTeamRanking");
var getTeam_1 = require("./endpoints/getTeam");
var getTeamStats_1 = require("./endpoints/getTeamStats");
var HLTV = {
    connectToScorebot: connectToScorebot_1.default,
    getMatch: getMatch_1.default,
    getMatches: getMatches_1.default,
    getMatchesStats: getMatchesStats_1.default,
    getMatchMapStats: getMatchMapStats_1.default,
    getRecentThreads: getRecentThreads_1.default,
    getResults: getResults_1.default,
    getStreams: getStreams_1.default,
    getTeamRanking: getTeamRanking_1.default,
    getTeam: getTeam_1.default,
    getTeamStats: getTeamStats_1.default
};
exports.HLTV = HLTV;
exports.default = HLTV;
var MatchType_1 = require("./enums/MatchType");
exports.MatchType = MatchType_1.default;
var Map_1 = require("./enums/Map");
exports.Map = Map_1.default;
