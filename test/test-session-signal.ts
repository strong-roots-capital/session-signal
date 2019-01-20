import test from 'ava'
import sinon from 'sinon'

/**
 * Library under test
 */

import SessionSignal from '../src/session-signal'

let spy: any
let clock: any
let sessionEmitter: any

test.beforeEach(() => {
    spy = sinon.spy()
    clock = sinon.useFakeTimers()

    sessionEmitter = new SessionSignal(['1D']).getEmitter()
    sessionEmitter.on('newSession', spy)
})

test.afterEach(() => {
    clock.restore()
})

test('should throw ArgumentError when given an empty string', t => {
    const error = t.throws(() => {
        new SessionSignal([''])
    }, Error)
    t.is(error.message, '[NOT] Expected string `session` to be empty, got ``')
})

test('should throw ArgumentError when given nonsensical timeframes', t => {
    const testStrings = ['5B', '5d', 'p', 'D4', '!!', 'H4', '1m']
    testStrings.forEach((str) => {
        const error = t.throws(() => {
            new SessionSignal([str])
        }, Error)
        t.is(0, error.message.indexOf('Expected string `session` to match'))
    })
})


test('assigns a subscription to a newSession event', t => {
    sessionEmitter.emit('newSession')
    t.true(spy.called)
})

test('passes arguments from the emit() call', t => {
    sessionEmitter.emit('newSession', ['1'])
    t.true(spy.calledWith(['1']))
})

test('calls every time the event is emitted', t => {
    sessionEmitter.emit('newSession')
    sessionEmitter.emit('newSession')
    t.is(spy.callCount, 2)
})

test('emits to multiple listeners', t => {
    const spyA = sinon.spy()
    const spyB = sinon.spy()

    sessionEmitter.on('newSession', spyA)
    sessionEmitter.on('newSession', spyB)
    sessionEmitter.emit('newSession')

    t.true(spyA.called)
    t.true(spyB.called)
})

test('events are emitted on specified session-close', t => {
    const callback = sinon.fake()
    let emitter = new SessionSignal(['1']).getEmitter()
    emitter.on('newSession', callback)

    t.true(callback.notCalled)

    clock.tick(1000 * 60)
    t.true(callback.calledOnce)
})
