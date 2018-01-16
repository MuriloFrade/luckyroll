(function () {

  class Frame {
    constructor (roll1 = null, roll2 = null, roll3 = null, total = 0) {
      this.roll1 = roll1
      this.roll2 = roll2
      this.roll3 = roll3
      this.total = total
    }
  }

  class Bowling {
    constructor () {
      this.numberOfFrames = 10
      this.numberOfPins = 10
      this.framesChangedCb = () => {}
      this.endingGameCb = () => {}

      this.remainingPins = 10
      this.currentFrame = 0,
      this.frames = []
    }

    onFramesChanged (cb) {
      this.framesChangedCb = cb
    }

    onEndingGame (cb) {
      this.endingGameCb = cb
    }

    startGame () {
      this.remainingPins = 10
      this.currentFrame = 0,
      this.frames = []
      for (let i = 0; i < this.numberOfFrames; i++) {
        this.frames.push(new Frame())
      }
      this.framesChangedCb(this.frames)
    }

    roll (fallenPins) {
      if (
        this.currentFrame === this.frames.length ||
        fallenPins > this.countRemainingPins()
      ) {
        throw Error('invalid roll call')
      }

      if (this.frames[this.currentFrame].roll1 === null) {
        this.frames[this.currentFrame].roll1 = fallenPins
        if (fallenPins === this.numberOfPins && this.currentFrame + 1 < this.numberOfFrames) {
          this.currentFrame++
        }
      } else if (this.frames[this.currentFrame].roll2 === null) {
        this.frames[this.currentFrame].roll2 = fallenPins
        if (!this.isLastFrame()) {
          this.currentFrame++
        }
      } else {
        this.frames[this.currentFrame].roll3 = fallenPins
      }

      this.framesChangedCb(this.frames)
      this.updateScore()
      this.checkEndingGame()
    }

    updateScore () {
      let lastScore = 0
      for (let i = 0; i < this.frames.length; i++) {
        if (
          this.frames[i].roll1 === null ||
          (this.frames[i].roll1 !== 10 && this.frames[i].roll2 === null) ||
          (this.frames[i].roll1 === 10 && i + 1 < this.numberOfFrames && this.frames[i + 1].roll1 === null)
        ) {
          break
        }

        // last frame
        if (
          i + 2 === this.numberOfFrames  &&
          this.frames[i].roll1  === this.numberOfPins
        ) {
          if (this.frames[i + 1].roll2 !== null) {
            lastScore += this.frames[i].roll1 + this.frames[i + 1].roll1 + this.frames[i + 1].roll2
          }
        } else if (i + 1 === this.numberOfFrames) {
          if (
            this.frames[i].roll1 + this.frames[i].roll2 === this.numberOfPins ||
            this.frames[i].roll1  === this.numberOfPins
          ) {
            if (this.frames[i].roll3 !== null) {
              lastScore += this.frames[i].roll1 +this.frames[i].roll2 + this.frames[i].roll3
            }
          } else {
            if (this.frames[i].roll3 !== null) {
              lastScore += this.frames[i].roll1 +this.frames[i].roll2 + this.frames[i].roll3
            }
          }
        }

        // strike
        else if (this.frames[i].roll1 === this.numberOfPins) {
          if (this.frames[i + 1].roll1 !== null) {
            if (this.frames[i + 1].roll1 === this.numberOfPins && this.frames[i + 2].roll1 !== null) {
              lastScore += this.frames[i].roll1 + this.frames[i + 1].roll1 + this.frames[i + 2].roll1
            } else if (this.frames[i + 1].roll2 !== null) {
              lastScore += this.frames[i].roll1 + this.frames[i + 1].roll1 + this.frames[i + 1].roll2
            }
          }
        }

        // spare
        else if (this.frames[i].roll2 !== null) {
          if (this.frames[i].roll1 + this.frames[i].roll2 === this.numberOfPins) {
            if (this.frames[i + 1].roll1 !== null) {
              lastScore += this.frames[i].roll1 + this.frames[i].roll2 + this.frames[i + 1].roll1
            }
          } else {
            lastScore += this.frames[i].roll1 + this.frames[i].roll2
          }
        }

        if (this.frames[i].total !== lastScore) {
          this.frames[i].total = lastScore
          this.framesChangedCb(this.frames)
        }
      }
    }

    getFrames () {
      return this.frames.map(f => Object.assign({}, f))
    }

    countRemainingPins () {

      if (this.isLastFrame()) {
        const index = this.currentFrame
        if (this.frames[index].roll1 === null) {
          return this.numberOfPins
        }

        if (this.frames[index].roll2 === null) {
          if (this.frames[index].roll1 === this.numberOfPins) {
            return this.numberOfPins
          }
          return this.numberOfPins - this.frames[index].roll1
        }

        if (this.frames[index].roll2 === this.numberOfPins) {
          return this.numberOfPins
        }

        if (this.frames[index].roll1 + this.frames[index].roll2 === this.numberOfPins){
          return this.numberOfPins
        }

        return 0
      }

      return this.numberOfPins - this.frames[this.currentFrame].roll1
    }

    checkEndingGame () {
      if (this.isLastFrame()) {
        if (
          (this.frames[this.currentFrame].roll1 !== null && this.frames[this.currentFrame].roll2 !== null) &&
          (
            (this.frames[this.currentFrame].roll1 + this.frames[this.currentFrame].roll2) < 10 ||
            this.frames[this.currentFrame].roll3 !== null
          )
        ) {
          this.endingGameCb()
        }
      }
    }

    isLastFrame () {
      return this.currentFrame + 1 === this.numberOfFrames
    }

  }

  // test only
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports.Bowling = Bowling
    module.exports.Frame = Frame
  } else {
    window.Bowling = Bowling
  }

})()
