(function () {
  'use strict';

  angular.module('app', [])
    .controller('MainCtrl', MainCtrl)

  function MainCtrl () {
    const vm = this

    vm.hello = 'Hello'

    const game = new Bowling()
    game.onUpdate(console.log)
  }
})()