class Bowling {
  constructor (players) {
    this.players = players
    this.frames = 10
    this.rollsPerFrame = 2
    this.changedCallback = null

    setTimeout(() => {
      this.changedCallback('changed')
    }, 1000);
  }

  onUpdate (callback) {
    this.changedCallback = callback
  }

}