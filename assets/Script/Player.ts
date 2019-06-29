import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    // Three lanes; 1 ,2 ,3
    currentLane = 2;

    game: Game = null;

    resetLane() {
        this.setLane(2);
    }

    setLane(lane: number) {
        switch(lane) {
            case 1:
                this.node.x = this.game.getLaneOneX();
                break;
            case 2:
                this.node.x = this.game.getLaneTwoX();
                break;
            case 3:
                this.node.x = this.game.getLaneThreeX();
                break;
            default:
                throw new Error("Invalid car lane. Got: " + lane);
        }
        
        this.currentLane = lane;
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        this.game.resetGame();
    }
}
