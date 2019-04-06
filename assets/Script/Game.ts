import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Prefab)
    trafficCarFab: cc.Prefab = null;

    @property(cc.Prefab)
    playerCarFab: cc.Prefab = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    touchToStartLabel: cc.Label = null;

    @property(cc.Label)
    titleLabel: cc.Label = null;

    // ======= SOUNDS =======
    @property(cc.AudioClip)
    carCrashSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    startGameSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    turnLeftSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    turnRightSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    pointsSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    bgMusic: cc.AudioClip = null;
    // ======================

    private readonly TRAFFIC_SPAWN_RATE = 0.38;
    private readonly CAR_WIDTH: number = 82;

    private scheduler: cc.Scheduler = null;

    private player: Player = null;
    private playerNode: cc.Node = null;

    private laneTwo: number;
    private laneOne: number;
    private laneThree: number;
    private score: number = 0;
    private cvs: cc.Node = null;


    public readonly GAME_STATE = { PLAY : 0, MENU : 1 }

    currentState = this.GAME_STATE.MENU;

    onLoad () {
        this.cvs = cc.find("Canvas");
        let midPoint = this.cvs.width / 2;
        this.laneTwo = midPoint;
        this.laneOne = midPoint - this.CAR_WIDTH * 1.5;
        this.laneThree = midPoint + this.CAR_WIDTH * 1.5;
        this.scheduler = cc.director.getScheduler();


        // Setup physics engine.
        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.gravity = cc.v2(0, 0);

        // INPUT
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    start () {
        this.touchToStartLabel.node.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(1.4),cc.delayTime(0.2), cc.fadeIn(1.4))));
        cc.audioEngine.playMusic(this.bgMusic,true);
        cc.audioEngine.setMusicVolume(0.4);
    }

    update (dt) {
    }

    startGame() {
        this.deactivateMenu();
        this.createPlayer();
        this.scheduler.schedule(this.spawnTrafficCar, this, this.TRAFFIC_SPAWN_RATE, false);
        this.currentState = this.GAME_STATE.PLAY;
    }

    activateMenu() {
        this.touchToStartLabel.enabled = true;
        this.titleLabel.enabled = true;
    }

    deactivateMenu() {
        this.touchToStartLabel.enabled = false;
        this.titleLabel.enabled = false;
    }

    resetGame() {
        cc.audioEngine.play(this.carCrashSound, false, 0.5);
        this.scheduler.unschedule(this.spawnTrafficCar, this);
        this.node.destroyAllChildren();
        this.score = 0;
        this.scoreLabel.string = "Score: " + 0;

        this.currentState = this.GAME_STATE.MENU;
        this.activateMenu();
    }

    createPlayer() {
        this.playerNode = cc.instantiate(this.playerCarFab);
        this.player = this.playerNode.getComponent('Player'); 
        this.node.addChild(this.playerNode);
        this.player.game = this;
        this.player.resetLane();
    }

    spawnTrafficCar() {
        const newCar = cc.instantiate(this.trafficCarFab);
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
    
    updateScore() {
        this.score++;
        if (this.score % 10 === 0) {
            cc.audioEngine.play(this.pointsSound, false, 0.5);
        }
        this.scoreLabel.string = "Score: " + this.score;
    }

    getMainCanvas() {
        return this.cvs;
    }

    onKeyDown(event: cc.Event.EventKeyboard) {

        if (this.currentState === this.GAME_STATE.MENU) {
            this.startGame();
            return;
        }

        let currentLane = this.player.getLane();
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                if (currentLane === 2 || currentLane === 3) {
                    cc.audioEngine.play(this.turnLeftSound, false, 0.5);
                    this.player.setLane(--currentLane);
                }
                break;
            case cc.macro.KEY.right:
                if (currentLane === 1 || currentLane === 2) {
                    cc.audioEngine.play(this.turnRightSound, false, 0.5);
                    this.player.setLane(++currentLane);
                }
                break;
            case cc.macro.KEY.up:
                break;
            case cc.macro.KEY.down:
                break;
            case cc.macro.KEY.space:
                break;
        }
    }
    getLaneOneX() {
        return this.laneOne;
    }

    getLaneTwoX() {
        return this.laneTwo;
    }

    getLaneThreeX() {
        return this.laneThree;
    }

    getPlayer() {
        return this.player;
    }
}


