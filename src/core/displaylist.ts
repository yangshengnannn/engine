namespace engine {


    type MovieClipData = {

        name: string,
        frames: MovieClipFrameData[]
    }

    type MovieClipFrameData = {
        "image": string
    }

    export class EventManager {
        targetArray: DisplayObject[];
        static eventManager: EventManager;
        constructor() {

        }
        static getInstance() {
            if (EventManager.eventManager == null) {
                EventManager.eventManager = new EventManager();
                EventManager.eventManager.targetArray = new Array();
                return EventManager.eventManager;
            } else {
                return EventManager.eventManager;
            }
        }
    }

    export class MyEvent {
        eventType = "";
        ifCapture = false;
        target: DisplayObject;
        func: Function;
        constructor(eventType: string, func: Function, target: DisplayObject, ifCapture: boolean) {
            this.eventType = eventType;
            this.ifCapture = ifCapture;
            this.func = func;
            this.target = target;
        }
    }

    export interface Drawable {

    }

    export abstract class DisplayObject implements Drawable {

        x = 0;

        y = 0;

        scaleX = 1;

        scaleY = 1;

        rotation = 0;

        alpha = 1;

        globalAlpha = 1;

        localMatrix: Matrix;

        globalMatrix: Matrix;

        parent: DisplayObjectContainer;

        touchEnabled: boolean;

        type: string;

        eventArray: MyEvent[];

        constructor(type: string) {
            this.localMatrix = new Matrix();
            this.globalMatrix = new Matrix();
            this.eventArray = new Array();
            this.type = type;
        }

        update() {
            this.localMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
            if (this.parent) {
                this.globalMatrix = matrixAppendMatrix(this.localMatrix, this.parent.globalMatrix);
            }
            else {
                this.globalMatrix = this.localMatrix;
            }
            if (this.parent) {
                this.globalAlpha = this.parent.globalAlpha * this.alpha;
            }
            else {
                this.globalAlpha = this.alpha;
            }
        }

        addEventListener(eventType: string, func: Function, target: DisplayObject, ifCapture: boolean) {
            //if this.eventArray doesn't contain e
            let e = new MyEvent(eventType, func, target, ifCapture);
            this.eventArray.push(e);
        }

        abstract hitTest(x: number, y: number): DisplayObject

    }


    export class Bitmap extends DisplayObject {
        // imageCache: HTMLImageElement;
        texture: ImageResource;


        constructor() {
            super("Bitmap");
        }

        hitTest(x: number, y: number) {
            if (this.texture) {
                if (this.texture.bitmapData) {
                    var rect = new engine.Rectangle();
                    rect.x = rect.y = 0;
                    rect.width = this.texture.bitmapData.width;
                    rect.height = this.texture.bitmapData.height;
                    if (rect.isPointInRectangle(new Point(x, y))) {
                        let eventManager = EventManager.getInstance();
                        eventManager.targetArray.push(this);
                        return this;
                    }
                    else {
                        return null;
                    }
                }
            }
        }
    }


    var fonts = {

        "name": "Arial",
        "font": {
            "A": [0, 0, 0, 0, 1, 0, 0, 1, 1, 0],
            "B": []
        }

    }

    export class TextField extends DisplayObject {

        text: string = "";

        constructor() {
            super("TextField");
        }

        _measureTextWidth: number = 0;

        hitTest(x: number, y: number) {
            var rect = new Rectangle();
            rect.width = this._measureTextWidth;
            rect.height = 20;
            var point = new Point(x, y);
            if (rect.isPointInRectangle(point)) {
                let eventManager = EventManager.getInstance();
                eventManager.targetArray.push(this);
                return this;
            }
            else {
                return null;
            }
        }
    }

    export class DisplayObjectContainer extends DisplayObject {

        children: DisplayObject[] = [];

        constructor() {
            super("DisplayObjectContainer");
        }

        update() {
            super.update();
            for (let displayobject of this.children) {
                displayobject.update();
            }
        }

        addChild(child: DisplayObject) {
            let x = this.children.indexOf(child);
            if (x < 0) {
                this.children.push(child);
                child.parent = this;
            } else {
                //如需遮罩，则需在此处将已有子物体移至第一位
            }
        }

        removeChild(child: DisplayObject) {
            let x = this.children.indexOf(child);
            if (x >= 0) {
                this.children.splice(x, 1);
            }
        }

        hitTest(x, y) {
            for (let i = this.children.length - 1; i >= 0; i--) {
                let child = this.children[i];
                let point = new Point(x, y);
                let invertChildLocalMatrix = invertMatrix(child.localMatrix);
                let pointBaseOnChild = pointAppendMatrix(point, invertChildLocalMatrix);
                let hitTestResult = child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);
                if (hitTestResult) {
                    let eventManager = EventManager.getInstance();
                    eventManager.targetArray.push(this);
                    return hitTestResult;
                }
            }
            return null;
        }

    }


    class MovieClip extends Bitmap {

        private advancedTime: number = 0;

        private static FRAME_TIME = 20;

        private static TOTAL_FRAME = 10;

        private currentFrameIndex: number;

        private data: MovieClipData;

        constructor(data: MovieClipData) {
            super();
            this.setMovieClipData(data);
            this.play();
        }

        ticker = (deltaTime) => {
            // this.removeChild();
            this.advancedTime += deltaTime;
            if (this.advancedTime >= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME) {
                this.advancedTime -= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME;
            }
            this.currentFrameIndex = Math.floor(this.advancedTime / MovieClip.FRAME_TIME);

            let data = this.data;

            let frameData = data.frames[this.currentFrameIndex];
            let url = frameData.image;
        }

        play() {
            Ticker.getInstance().register(this.ticker);
        }

        stop() {
            Ticker.getInstance().unregister(this.ticker)
        }

        setMovieClipData(data: MovieClipData) {
            this.data = data;
            this.currentFrameIndex = 0;
            // 创建 / 更新 

        }
    }

}