import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TrafficCar extends cc.Component {

    private readonly trafficSpeed = 880;
    
    private lowBound: number = 100;
    private isPassed = false;


    game: Game = null;

    alive = true;


    onLoad() {
        cc.systemEvent.on('reset', this._onReset, this);
    }

    start () {        
        this.lowBound = -this.game.getMainCanvas().height * 0.62;
    }

    init(xPos: number, yPos: number) {
        this.alive = true;
        this.node.x = xPos;
        this.node.y = yPos;
    }

    update (dt) {
        if (this.alive) {
            this.node.y -= this.trafficSpeed * dt;
            if (!this.isPassed) {
                if (this.node.y < this.game.getPlayer().node.y - this.game.getPlayer().node.height / 2) {
                    this.game.updateScore();
                    this.isPassed = true;
                }
            }
            if (this.node.y <= this.lowBound) {
                this.game.carPool.put(this.node);
            }
        }
    }

    _onReset() {
        this.game.carPool.put(this.node);
    }
}