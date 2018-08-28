import * as io from 'socket.io-client'
import ScoreboardUpdate from '../models/ScoreboardUpdate'
import LogUpdate from '../models/LogUpdate'
import { fetchPage } from '../utils/mappers'
import HLTVConfig from '../models/HLTVConfig'

export type ConnectToScorebotParams = {
    id: number,
    onScoreboardUpdate?: (data: ScoreboardUpdate) => any,
    onLogUpdate?: (data: LogUpdate) => any,
    onConnect?: () => any,
    onDisconnect?: () => any
}

const connectToScorebot = (config: HLTVConfig) => async ({ id, onScoreboardUpdate, onLogUpdate, onConnect, onDisconnect }: ConnectToScorebotParams) => {
    const $ = await fetchPage(`${config.hltvUrl}/matches/${id}/-`, config.loadPage)
    const url = $('#scoreboardElement').attr('data-scorebot-url')
    const matchId = $('#scoreboardElement').attr('data-scorebot-id')

    const socket = io.connect(url)

    socket.on('connect', () => {
        if (onConnect) {
            onConnect()
        }

        socket.emit('readyForMatch', `{"token":"","listId":"${matchId}"}`)

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
