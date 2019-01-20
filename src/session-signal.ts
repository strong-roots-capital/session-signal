/**
 * Session Signal
 * Emit a signal on conclusion of specified sessions (UTC)
 */

const EventEmitter = require('events')
const schedule = require('node-schedule')
import { utcDate } from '@hamroctopus/utc-date'
import session from 'market-session'

// OPTIMIZE: find a more accurate timer-system
const cronEveryMinute = '1 * * * * *' // Every minute at one-second past


/**
 * Emits a `newSession` signal at the start of specified sessions
 * (UTC).
 */
class SessionSignal {

    sessions: string[]
    emitter: any

    constructor(sessions: string[]) {
        // Reduce the feedback loop by validating `sessions`
        // with `marketSession.fromString`s built-in validation --
        // failures will immediately be visible
        sessions.map(session.fromString)

        this.sessions = sessions
        this.emitter = new EventEmitter()
        schedule.scheduleJob(cronEveryMinute, this.timerISR.bind(null, this))
    }

    /**
     * Return the event emitter that fires signals on end-of-session.
     */
    getEmitter(): any { return this.emitter }

    /**
     * Listen for end-of-session and emit a `newSession` event.
     */
    timerISR(context: SessionSignal): void {
        const now = utcDate()
        const closedSessions = session(now, context.sessions)
        // console.log('ISR: new minute')

        if (closedSessions.length < 1) { return }
        context.emitter.emit('newSession', closedSessions)
    }
}

export default SessionSignal
