<template>
  <div>
    <div>
      <p>Rules</p>
      <p>Do what to want but return an chess move</p>
      <p>To process this you have to write you IA (or not), in the editor, the only thing you have to
        do is return a correct chess move in san notation like "A4".
      </p>
    </div>
    <div>
      <engineSelector></engineSelector>
    </div>
    <div id="board">
      <chessboard :fen="currentFen" @onMove="onMove"></chessboard>
    </div>
    <div id="editor">
      <editor id="mainEditor" :action="(data)=>updateInput (data)"></editor>
    </div>
    <input type="button" value="Run" @keyup.enter="run" @click="run">
    <div>
      <tree-view :data="formatedChessMoves"></tree-view>
    </div>
  </div>
</template>

<script>
import {chessboard} from 'vue-chessboard'
import Editor from './Editor'
import Chess from 'chess.js'
import EngineSelector from './EngineSelector'

export default {
  name: 'BoardEditor',
  components: {
    chessboard: chessboard,
    editor: Editor,
    engineSelector: EngineSelector,
    userPlayWhite: true
  },
  data () {
    return {
      editorInput: 'moves[Math.floor(Math.random()*moves.length)]',
      currentFen: ''
    }
  },
  methods: {
    /**
    * Called when hit by the Run button. It executes the code in the editor, then plays the move returned.
    */
    run () {
      /* eslint-disable-next-line no-new-func */
      let userFunction = Function('moves', 'game', this.editorInput)
      let game = this.$store.getters.getGame
      let legalMoves = this.$store.getters.getChessMoves
      console.log(userFunction(legalMoves, game))
      game.move(userFunction(this.$store.getters.getChessMoves, game))
      this.currentFen = game.fen()
      const stockfish = new Worker(require('@/engines/stockfish.js'))
      stockfish.onmessage = function (message) {
        console.log(message.data)
      }
      stockfish.postMessage('uci')
      stockfish.postMessage('isready')
      console.log('position ' + this.currentFen)
      stockfish.postMessage('position fen ' + this.currentFen)
      stockfish.postMessage('go depth 3')
    },
    onMove (data) {
      const chess = Chess(data.fen)
      this.$store.commit('setGame', chess)
      this.$store.commit('setChessMoves', chess.moves())
      const reason = chess.game_over()
      if (reason) {
        console.log('Game over:', reason())
      }
    },
    updateInput (input) {
      this.editorInput = input
    }
  },
  computed: {
    formatedChessMoves () {
      return this.$store.getters.getChessMoves
    }
  }
}
</script>

<style scoped>
  @import url('vue-chessboard/dist/vue-chessboard.css');

  .floatbox {
    display: inline-block;
    width: 50%;
  }
</style>
