import { HLTVConfig } from '../config'
import { fetchPage, toArray } from '../utils/mappers'
import { EventResult } from 'models/EventResult';
import { SimpleEvent } from 'models/SimpleEvent';

export const getEvents = (config: HLTVConfig) => async ({ eventSize = 'all' } = {}): Promise<EventResult[]> => {
    const $ = await fetchPage(`${config.hltvUrl}/events`, config.loadPage);

    let events = [] as EventResult[];

    toArray($('.events-month')).map(event => {
        let monthEvents = [] as SimpleEvent[];
        let monthName   = event.find('.standard-headline').text();

        switch(eventSize) {
            case 'small':
                monthEvents = parseSmallEvents(toArray(event.find('a.small-event')));
            break;

            case 'big':
                monthEvents = parseBigEvents(toArray(event.find('a.big-event')));
            break;

            default:
                monthEvents = parseBigEvents(toArray(event.find('a.big-event'))).concat( parseSmallEvents(toArray(event.find('a.small-event'))) );
            break;
        }

        events.push({
            month: monthName,
            events: monthEvents
        });
    });

    return events;
}

const parseSmallEvents = (smallEvents) => {
    let events = [] as SimpleEvent[];

    smallEvents.forEach((eventEl) => {
        let dateStart   = eventEl.find('.eventDetails .col-desc span[data-unix]').eq(0).data('unix');
        let dateEnd     = eventEl.find('.eventDetails .col-desc span[data-unix]').eq(1).data('unix');
        let teams       = eventEl.find('.col-value').eq(1).text();

        events.push({
            id: Number(eventEl.attr('href').split('/')[2]),
            name: eventEl.find('.col-value .text-ellipsis').text(),
            dateStart: dateStart ? Number(dateStart) : undefined,
            dateEnd: dateEnd ? Number(dateEnd) : undefined,
            prizePool: eventEl.find('.prizePoolEllipsis').text(),
            teams: teams.length ? Number(teams) : undefined,
            location: eventEl.find('.smallCountry img').prop('title'),
            host: eventEl.find('table tr').eq(0).find('td').eq(3).text()
        });
    });

    return events;
}

const parseBigEvents = (bigEvents) => {
    let events = [] as SimpleEvent[];

    bigEvents.forEach((eventEl) => {
        let dateStart   = eventEl.find('span[data-unix]').eq(0).data('unix');
        let dateEnd     = eventEl.find('span[data-unix]').eq(1).data('unix');
        let teams       = eventEl.find('.additional-info tr').eq(0).find('td').eq(2).text();

        events.push({
            id: Number(eventEl.attr('href').split('/')[2]),
            name: eventEl.find('.big-event-name').text(),
            dateStart: dateStart ? Number(dateStart) : undefined,
            dateEnd: dateEnd ? Number(dateEnd) : undefined,
            prizePool: eventEl.find('.additional-info tr').eq(0).find('td').eq(1).text(),
            teams: teams.length ? Number(teams) : undefined,
            location: eventEl.find('.location-top-teams img').prop('title'),
            host: undefined
        });
    });

    return events;
}