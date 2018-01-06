import * as io from 'socket.io-client'
import ScoreboardUpdate from '../models/ScoreboardUpdate'
import LogUpdate from '../models/LogUpdate'
import { HLTV_URL } from '../utils/constants'
import { fetchPage } from '../utils/mappers'

export type ConnectToScorebotParams = {
    id: number,
    onScoreboardUpdate?: (data: ScoreboardUpdate) => any,
    onLogUpdate?: (data: LogUpdate) => any,
    onConnect?: () => any,
    onDisconnect?: () => any
}

const connectToScorebot = async ({ id, onScoreboardUpdate, onLogUpdate, onConnect, onDisconnect }: ConnectToScorebotParams) => {
    const $ = await fetchPage(`${HLTV_URL}/matches/${id}/-`)
    // const url = $('#scoreboardElement').attr('data-scorebot-url')
    const url = 'http://scorebot2.hltv.org:10022';
    const matchId = $('#scoreboardElement').attr('data-scorebot-id')

    const socket = io.connect(url)

    socket.on('connect', () => {
        if (onConnect) {
            onConnect()
        }

        socket.emit('readyForMatch', matchId)

        socket.on('scoreboard', (data) => {
            if (onScoreboardUpdate) {
                onScoreboardUpdate(data)
            }
        })

        socket.on('log', (data) => {
            if (onLogUpdate) {
                onLogUpdate(JSON.parse(data))
            }
        })
    })

    socket.on('reconnect', () => {
        socket.emit('readyForMatch', matchId)
    })

    socket.on('disconnect', () => {
        if (onDisconnect) {
            onDisconnect()
        }
    })
}

export default connectToScorebot
