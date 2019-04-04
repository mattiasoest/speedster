const {ccclass, property} = cc._decorator;

@ccclass
export default class BumpScroll extends cc.Component {


    private readonly scrollSpeed: number = 2300;
    private readonly lowBound: number = -920;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt) {
        this.node.setPosition(this.node.position.x,this.node.position.y - this.scrollSpeed * dt);
        if (this.node.getPosition().y <= this.lowBound) {
            this.node.setPosition(this.node.position.x, this.node.position.y + this.node.height * 3);  
        }
    }
}
