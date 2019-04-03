import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TrafficCar extends cc.Component {

    private readonly trafficSpeed = 400;
    
    private lowBound: number = 100;

    game: Game = null;

    // onLoad () {
    // }

    start () {        
        this.lowBound = -this.game.getMainCanvas().height * 0.62;
    }

    update (dt) {
        this.node.setPosition(this.node.x, this.node.y - this.trafficSpeed * dt);
        if (this.node.y <= this.lowBound) {
            this.node.destroy();
        }
    }
}