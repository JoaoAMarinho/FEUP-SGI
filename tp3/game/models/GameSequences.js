export default class GameSequences {
  constructor() {
    this.sequences = [];
  }

  addSequence(move) {
    this.sequences.push([]);
    this.addAnimation(move);
  }
  
  addAnimation(animation) {
    this.sequences[this.sequences.length-1].push(animation);
  }

  undo() {
    return this.sequences.pop();
  }

  reset() {
    this.sequences = [];
  }
}
