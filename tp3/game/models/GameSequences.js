export default class GameSequences {
  constructor() {
    this.sequences = [];
  }

  getSequence(idx) {
    if (idx > this.sequences.length - 1) return null;
    return this.sequences[idx];
  }

  hasSequences() {
    return this.sequences.length > 0;
  }

  addSequence(board, auxiliarBoard, playerTurn, scores, mandatoryPlay) {
    this.sequences.push({
      board,
      auxiliarBoard,
      moves: [],
      playerTurn,
      scores,
      mandatoryPlay,
    });
  }

  addAnimation(animation) {
    this.sequences[this.sequences.length - 1].moves.push(animation);
  }

  undo() {
    return this.sequences.pop();
  }

  updateSequence(val) {
    this.sequences[this.sequences.length - 1] = {
      ...this.sequences[this.sequences.length - 1],
      ...val,
    };
  }

  reset() {
    this.sequences = [];
  }
}
