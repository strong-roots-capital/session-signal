# session-signal [![Build Status](https://travis-ci.org/strong-roots-capital/session-signal.svg?branch=master)](https://travis-ci.org/strong-roots-capital/session-signal) [![npm version](https://img.shields.io/npm/v/session-signal.svg)](https://npmjs.org/package/session-signal) [![Code coverage](https://img.shields.io/codecov/c/github/strong-roots-capital/session-signal.svg)](https://codecov.io/gh/strong-roots-capital/session-signal)


> Emit a signal at end of desired session (UTC)

## Install

``` shell
npm install session-signal
```

## Use

``` typescript
import SessionSignal from 'session-signal'

let sessionEmitter = new SessionSignal(['1', '5', '15', '1H']).getEmitter()
sessionEmitter.on('newSession', ISR)

function ISR(sessions: number[]) {
    console.log('New session!', new Date(), sessions)
}
```

## Related

- [market-session](https://github.com/strong-roots-capital/market-session)
