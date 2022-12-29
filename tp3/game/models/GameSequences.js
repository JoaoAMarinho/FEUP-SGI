export default class GameSequences {
  constructor() {
    this.sequences = [];
  }

  addSequence(playerTurn, scores, mandatoryPlay) {
    this.sequences.push({moves:[], playerTurn, scores, mandatoryPlay});
  }

  addAnimation(animation) {
    this.sequences[this.sequences.length - 1].moves.push(animation);
  }

  undo() {
    return this.sequences.pop();
  }

  updateSequence(val) {
    this.sequences[this.sequences.length-1] = {...this.sequences[this.sequences.length-1], ...val};
  }

  reset() {
    this.sequences = [];
  }
}
