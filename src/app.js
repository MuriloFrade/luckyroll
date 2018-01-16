(function () {
  'use strict';

  angular.module('app', [])
    .controller('MainCtrl', MainCtrl)

  function MainCtrl ($scope) {
    const game = new window.Bowling()
    game.onFramesChanged(updateFrames.bind(this))
    game.onEndingGame(endGame.bind(this))
    const totalPins = 10

    const vm = this
    vm.showInitial = true
    vm.showEndingGame = false

    vm.player = ''
    vm.frames = []
    vm.fallenPins = null
    vm.remainingPins = 10
    vm.rollDisabled = false
    vm.totalScore = 0
    vm.pinsVisible = []
    for (let index = 0; index < 10; index++) {
      vm.pinsVisible.push(true)
    }


    vm.start = function () {
      game.startGame()
      vm.showInitial = false
      vm.showPlaying = true
      vm.rollDisabled = false
      vm.showEndingGame = false

      for (let index = 0; index < 10; index++) {
        vm.pinsVisible[index] = true
      }
    }

    vm.roll = function () {
      vm.rollDisabled = true
      moveBallAnimation(() => {
        const fallenPins = Math.floor(Math.random() * (vm.remainingPins + 1))
        game.roll(fallenPins)
        updateStats(fallenPins)
        updatePins()
        vm.rollDisabled = false
        scopeApply()
      })
    }

    function updateStats (fallenPins) {
      vm.fallenPins = fallenPins
      vm.remainingPins = game.countRemainingPins()
    }

    function updatePins () {
      const left = game.countRemainingPins()
      vm.pinsVisible = vm.pinsVisible.map(() => true)
      for (let index = 0; index < totalPins - left; index++) {
        vm.pinsVisible[index] = false
      }
    }

    function updateFrames (frames) {
      vm.frames = parseRollsValues(frames)
    }

    function parseRollsValues (frames) {
      return frames.map(f => {
        let roll1 = f.roll1 === null ? ' ' : f.roll1
        let roll2 = f.roll2 === null ? ' ' : f.roll2
         if (f.roll1 === 10) {
          roll1 = ' X '
        } else if (f.roll1 + f.roll2 === 10) {
          roll2 = ' \\ '
        }
        return { roll1, roll2, total: f.total}
      })
    }

    function endGame () {
      vm.showEndingGame = true
      vm.rollDisabled = true
      vm.totalScore = game.getFrames()[9].total
    }

    function moveBallAnimation (cb) {
      const ballEl =  document.getElementById('ball')
      const delay = 5
      const initial = 75
      const blinkDuration = 1500
      let last = initial

      const changeMargin = () => {
        if (last === -5) {
          blinkPins(blinkDuration)
          setTimeout(() => {
            ballEl.style.top = initial + '%'
            cb()
          }, blinkDuration)
          return
        }
        last -= 1
        ballEl.style.top = last + '%'
        setTimeout(changeMargin.bind(this), delay);
      }
      changeMargin()
    }

    function blinkPins (duration) {
      const pinEls = angular.element(document.getElementsByClassName('pin'))
      let visible = false
      pinEls.css('display', 'none')
      const id = setInterval(() => {
        if (visible) {
          pinEls.css('display', 'none')
        } else {
          pinEls.css('display', 'inline-block')
        }
        visible = !visible
      }, 200)

      setTimeout(() => {
        pinEls.css('display', 'inline-block')
        clearInterval(id)
      }, duration)
    }

    function scopeApply () {
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    }

  }
})()