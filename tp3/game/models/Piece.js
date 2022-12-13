export default class Piece {
    constructor(player, isQueen = false) {
        this.player = player;
        this.isQueen = isQueen;

        this.id = this.getPieceID();
        this.vectors = this.getVectors();
    }

    getPieceID() {
        let ids = ["XX", "X"];
        if (this.player) {
            ids = ["YY", "Y"];
        }
        return this.isQueen ? ids[1] : ids[0];
    }

    getVectors() {
        if (this.isQueen) {
            return [
                [-1, -1],
                [-1, 1],
                [1, -1],
                [1, 1],
            ];
        }

        if (this.player) {
            return [
                [-1, 1],
                [1, 1],
            ];
        }

        return [[-1,-1], [1,-1]];
    }

}
