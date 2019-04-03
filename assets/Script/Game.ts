const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Prefab)
    trafficCar: cc.Prefab = null;

    private readonly TRAFFIC_SPAWN_RATE = 1.1;
    private readonly CAR_WIDTH: number = 82;

    private scheduler: cc.Scheduler = null;
    private laneTwo: number;
    private laneOne: number;
    private laneThree: number;

    private cvs: cc.Node = null;

    onLoad () {
        this.cvs = cc.find("Canvas");
        let midPoint = this.cvs.width / 2;
        this.laneTwo = midPoint;
        this.laneOne = midPoint - this.CAR_WIDTH * 1.5;
        this.laneThree = midPoint + this.CAR_WIDTH * 1.5;
        this.scheduler = cc.director.getScheduler();
    }

    start () {
        this.scheduler.schedule(this.spawnTrafficCar, this, this.TRAFFIC_SPAWN_RATE, false);
    }

    // update (dt) {}

    spawnTrafficCar() {
        const newCar = cc.instantiate(this.trafficCar);
        this.node.addChild(newCar);
        newCar.setPosition(cc.v2(this.generateRandomCarLane(), this.cvs.height * 1.2));
        // Leave a reference to the game object.
        newCar.getComponent('TrafficCar').game = this;
    }

    generateRandomCarLane() {
        const lane = Math.floor(Math.random() * 3);
        switch(lane) {
            case 0:
                return this.laneOne;
            case 1:
                return this.laneTwo;
            case 2:
                return this.laneThree;
            default:
                throw new Error("Invalid car lane. Got: " + lane);
        }
    }

    getMainCanvas() {
        return this.cvs;
    }
}
