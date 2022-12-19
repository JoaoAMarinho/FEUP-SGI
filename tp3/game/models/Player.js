
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

    hasMoves() {
        return Object.keys(this.moves).length > 0;
    }

    getPlayablePositions() {
        return Object.keys(this.moves).map(key => {
            return JSON.parse(key);
        });
    }
}