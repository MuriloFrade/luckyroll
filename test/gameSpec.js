const spy = require('sinon').spy
const assert = require('sinon').assert
const expect = require('chai').expect

const Bowling = require('../src/game').Bowling
const Frame = require('../src/game').Frame

describe('Bowling single player', () => {
  let framesChangedSpy
  let endGameSpy
  let game

  const testCases = [
    {
      rolls: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      total: 300
    },
    {
      rolls: [5, 5, 8, 2, 3, 4, 7, 0, 10, 10, 9, 1, 2, 3 , 4, 4, 9, 1, 6 ],
      total: 135
    }
  ]

  beforeEach(() => {
    game = new Bowling()
    game.startGame()
    framesChangedSpy = spy()
    endGameSpy = spy()
    game.onFramesChanged(framesChangedSpy)
    game.onEndingGame(endGameSpy)
  })

  it('can roll', () => {
    game.roll(5)
  })

  it('can calc scores', () => {
    testCases.forEach(t => {
      game.startGame()
      t.rolls.forEach(r => game.roll(r))
      expect(game.getFrames()[9].total).to.equal(t.total)
    })
  })

  it('calculates scores correctly while playing', () => {
    let frames
    game.roll(10)
    frames = game.getFrames()
    expect(frames[0]).to.deep.equal(new Frame(10, null, null, 0))

    game.roll(5)
    game.roll(2)
    frames = game.getFrames()
    expect(frames[0]).to.deep.equal(new Frame(10, null, null, 17))
    expect(frames[1]).to.deep.equal(new Frame(5, 2, null, 24))

    game.roll(4)
    game.roll(3)
    frames = game.getFrames()
    expect(frames[2]).to.deep.equal(new Frame(4, 3, null, 31))

    game.roll(10)
    game.roll(10)
    game.roll(10)
    game.roll(2)
    game.roll(3)
    frames = game.getFrames()
    expect(frames[3]).to.deep.equal(new Frame(10, null, null, 61))
    expect(frames[4]).to.deep.equal(new Frame(10, null, null, 83))
    expect(frames[5]).to.deep.equal(new Frame(10, null, null, 98))
    expect(frames[6]).to.deep.equal(new Frame(2, 3, null, 103))

    game.roll(9)
    game.roll(1)
    game.roll(3)
    game.roll(2)
    frames = game.getFrames()
    expect(frames[7]).to.deep.equal(new Frame(9, 1, null, 116))
    expect(frames[8]).to.deep.equal(new Frame(3, 2, null, 121))

    game.roll(4)
    game.roll(6)
    game.roll(8)
    frames = game.getFrames()
    expect(frames[9]).to.deep.equal(new Frame(4, 6, 8, 139))
  })

  it('counts remaining pins', () => {
    game.roll(5)
    expect(game.countRemainingPins()).to.equal(5)

    game.roll(4)
    expect(game.countRemainingPins()).to.equal(10)

    game.roll(10)
    expect(game.countRemainingPins()).to.equal(10)
  })

  it('calls callback on frames changed', () => {
    game.roll(5)
    const frames = game.getFrames()
    assert.calledOnce(framesChangedSpy)
    assert.calledWithExactly(framesChangedSpy, frames)
  })

  it('calls callback on ending game', () => {
    testCases.forEach(t => {
      game.startGame()
      t.rolls.forEach(r => game.roll(r))
    })
    assert.callCount(endGameSpy, testCases.length)
  })
})