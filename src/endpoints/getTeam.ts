import { FullTeam, Result, Achievement } from '../models/FullTeam'
import { Player } from '../models/Player'
import { HLTVConfig } from '../config'
import { fetchPage, toArray } from '../utils/mappers'
import { popSlashSource, hasChild } from '../utils/parsing'

export const getTeam = (config: HLTVConfig) => async ({
  id
}: {
  id: number
}): Promise<FullTeam> => {
  const t$ = await fetchPage(`${config.hltvUrl}/team/${id}/-`, config.loadPage)
  const e$ = await fetchPage(`${config.hltvUrl}/stats/teams/events/${id}/-`, config.loadPage)

  const name = t$('.profile-team-name').text()
  const logo = `${config.hltvStaticUrl}/images/team/logo/${id}`
  const coverImage = t$('.coverImage').attr('data-bg-image')
  const location = t$('.team-country .flag').attr('alt')!
  const facebook = t$('.facebook')
    .parent()
    .attr('href')
  const twitter = t$('.twitter')
    .parent()
    .attr('href')
  const rank =
    Number(
      t$('.profile-team-stat .right')
        .first()
        .text()
        .replace('#', '')
    ) || undefined

  const regularPlayers: Player[] = toArray(t$('.overlayImageFrame-square'))
    .filter(hasChild('.playerFlagName .text-ellipsis'))
    .map(playerEl => ({
      name: playerEl.find('.playerFlagName .text-ellipsis').text(),
      id: Number(
        playerEl
          .find('.profileImage')
          .attr('src')!
          .split('/')
          .slice(-2, -1)
      )
    }))

  const officialPicturePlayers: Player[] = toArray(t$('.overlayImageFrame'))
    .filter(hasChild('.playerFlagName .text-ellipsis'))
    .map(playerEl => ({
      name: playerEl.find('.playerFlagName .text-ellipsis').text(),
      id: Number(popSlashSource(playerEl.find('.bodyshot-team-img'))!.split('.')[0])
    }))

  const players = regularPlayers.concat(officialPicturePlayers)

  const recentResults: Result[] = toArray(t$('.team-row')).map(matchEl => ({
    matchID: Number(
      (matchEl.find('.matchpage-button').length
        ? matchEl.find('.matchpage-button')
        : matchEl.find('.stats-button')
      )
        .attr('href')!
        .split('/')[2]
    ),
    enemyTeam: {
      id: Number(popSlashSource(matchEl.find('.team-2 .team-logo-container img'))!),
      name: matchEl.find('span.team-2').text()
    },
    result: matchEl.find('.score-cell').text()
  }))

  let rankingDevelopment

  try {
    const rankings = JSON.parse(t$('.graph').attr('data-fusionchart-config')!)
    rankingDevelopment = rankings.dataSource.dataset[0].data.map(x => x.value).map(Number)
  } catch {
    rankingDevelopment = []
  }

  const bigAchievements: Achievement[] = toArray(t$('.achievement-table .team')).map(achEl => ({
    place: achEl.find('.achievement').text(),
    event: {
      name: achEl.find('.tournament-name-cell a').text(),
      id: Number(
        achEl
          .find('.tournament-name-cell a')
          .attr('href')!
          .split('/')[2]
      )
    }
  }))

  const events = toArray(t$('#ongoingEvents a.ongoing-event'))
    .map(eventEl => ({
      name: eventEl.find('.eventbox-eventname').text(),
      id: Number(eventEl.attr('href')!.split('/')[2])
    }))
    .concat(
      toArray(e$('.image-and-label[href*="event"]')).map(eventEl => ({
        name: eventEl.attr('title')!,
        id: Number(
          eventEl
            .attr('href')!
            .split('=')
            .pop()
        )
      }))
    )

  return {
    id,
    name,
    logo,
    coverImage,
    location,
    facebook,
    twitter,
    rank,
    players,
    recentResults,
    rankingDevelopment,
    bigAchievements,
    events
  }
}
