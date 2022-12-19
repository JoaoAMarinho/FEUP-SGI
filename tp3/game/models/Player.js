
export default class Player {
    constructor() {
        this.camera = null;
        this.score = 0;
        this.time = 300; // 5 minutes
    }

    setMoves(moves) {
        this.moves = moves;
    }

    getMoves() {
        return this.moves;
    }
}