import * as io from 'socket.io-client'
import { ScoreboardUpdate } from '../models/ScoreboardUpdate'
import { LogUpdate } from '../models/LogUpdate'
import { fetchPage } from '../utils/mappers'
import { HLTVConfig } from '../config'

export type ConnectToScorebotParams = {
  id: number
  onScoreboardUpdate?: (data: ScoreboardUpdate) => any
  onLogUpdate?: (data: LogUpdate) => any
  onFullLogUpdate?: (data: unknown) => any
  onConnect?: () => any
  onDisconnect?: () => any
}

export const connectToScorebot = (config: HLTVConfig) => ({
  id,
  onScoreboardUpdate,
  onLogUpdate,
  onFullLogUpdate,
  onConnect,
  onDisconnect
}: ConnectToScorebotParams) => {
  fetchPage(`${config.hltvUrl}/matches/${id}/-`, config.loadPage).then($ => {
    const url = $('#scoreboardElement')
      .attr('data-scorebot-url')
      .split(',')
      .pop()!
    const matchId = $('#scoreboardElement').attr('data-scorebot-id')

    const socket = io.connect(url)

    const initObject = JSON.stringify({
      token: '',
      listId: matchId
    })

    socket.on('connect', () => {
      if (onConnect) {
        onConnect()
      }

      socket.emit('readyForMatch', initObject)

      socket.on('scoreboard', data => {
        if (onScoreboardUpdate) {
          onScoreboardUpdate(data)
        }
      })

      socket.on('log', data => {
        if (onLogUpdate) {
          onLogUpdate(JSON.parse(data))
        }
      })

      socket.on('fullLog', data => {
        if (onFullLogUpdate) {
          onFullLogUpdate(JSON.parse(data))
        }
      })
    })

    socket.on('reconnect', () => {
      socket.emit('readyForMatch', initObject)
    })

    socket.on('disconnect', () => {
      if (onDisconnect) {
        onDisconnect()
      }
    })
  })
}
