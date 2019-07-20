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
        this.node.setPosition(xPos, yPos);
        this.isPassed = false;
    }

    update (dt) {
        if (this.alive) {
            this.node.position.y -= this.trafficSpeed * dt;
            this.node.setPosition(this.node.position.x, this.node.position.y -= this.trafficSpeed * dt);
            if (!this.isPassed) {
                if (this.node.position.y < this.game.getPlayer().node.position.y - this.game.getPlayer().node.height / 2) {
                    this.game.updateScore();
                    this.isPassed = true;
                }
            }
            if (this.node.position.y <= this.lowBound) {
                this._remove()
            }
        }
    }

    _remove() {
        this.node.removeFromParent();
        this.game.carPool.put(this.node);
    }

    _onReset() {
        this._remove();
    }
}