namespace engine {
    export let run = (canvas: HTMLCanvasElement) => {

        var stage = new DisplayObjectContainer();
        let context2D = canvas.getContext("2d");
        let render = new CanvasRenderer(stage, context2D);
        Resourse.getInstance().initial();
        let lastNow = Date.now();
        let frameHandler = () => {
            let now = Date.now();
            let deltaTime = now - lastNow;
            Ticker.getInstance().notify(deltaTime);
            context2D.clearRect(0, 0, 400, 400);
            context2D.save();
            stage.update();
            render.render();
            context2D.restore();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        }

        window.requestAnimationFrame(frameHandler);

        let hitResult: DisplayObject;
        let currentX: number;
        let currentY: number;
        let lastX: number;
        let lastY: number;
        let isMouseDown = false;

        window.onmousedown = (e) => {
            isMouseDown = true;
            let targetArray = EventManager.getInstance().targetArray;
            targetArray.splice(0, targetArray.length);
            hitResult = stage.hitTest(e.offsetX, e.offsetY);
            currentX = e.offsetX;
            currentY = e.offsetY;
        }

        window.onmousemove = (e) => {
            let targetArray = EventManager.getInstance().targetArray;
            lastX = currentX;
            lastY = currentY;
            currentX = e.offsetX;
            currentY = e.offsetY;
            if (isMouseDown) {
                for (let i = 0; i < targetArray.length; i++) {
                    for (let x of targetArray[i].eventArray) {
                        if (x.eventType.match("onmousemove") &&
                            x.ifCapture == true) {
                            x.func(e);
                        }
                    }
                }
                for (let i = targetArray.length - 1; i >= 0; i--) {
                    for (let x of targetArray[i].eventArray) {
                        if (x.eventType.match("onmousemove") &&
                            x.ifCapture == false) {
                            x.func(e);
                        }
                    }
                }
            }
        }
        window.onmouseup = (e) => {
            isMouseDown = false;
            let targetArray = EventManager.getInstance().targetArray;
            targetArray.splice(0, targetArray.length);
            let newHitRusult = stage.hitTest(e.offsetX, e.offsetY);
            for (let i = 0; i < targetArray.length; i++) {
                for (let x of targetArray[i].eventArray) {
                    if (x.eventType.match("onclick") &&
                        newHitRusult == hitResult &&
                        x.ifCapture == true) {
                        x.func(e);
                    }
                }
            }
            for (let i = targetArray.length - 1; i >= 0; i--) {
                for (let x of targetArray[i].eventArray) {
                    if (x.eventType.match("onclick") &&
                        newHitRusult == hitResult &&
                        x.ifCapture == false) {
                        x.func(e);
                    }
                }
            }
        }
        return stage;
    }

    class CanvasRenderer {
        constructor(private stage: DisplayObjectContainer, private context2D: CanvasRenderingContext2D) {

        }

        render() {
            let stage = this.stage;
            let context2D = this.context2D;
            this.renderContainer(stage);
        }

        renderContainer(container: DisplayObjectContainer) {
            for (let child of container.children) {
                let context2D = this.context2D;
                context2D.globalAlpha = child.globalAlpha;
                let m = child.globalMatrix;
                context2D.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);

                if (child.type == "Bitmap") {
                    this.renderBitmap(child as Bitmap);
                }
                else if (child.type == "TextField") {
                    this.renderTextField(child as TextField);
                }
                else if (child.type == "DisplayObjectContainer") {
                    this.renderContainer(child as DisplayObjectContainer);
                }
            }
        }

        renderBitmap(bitmap: Bitmap) {
            //  if (bitmap.imageCache == null) {
            //     let img = new Image();
            //     img.src = bitmap.texture;
            //     img.onload = () => {
            //         this.context2D.drawImage(img, 0, 0);
            //         bitmap.imageCache = img;
            //     }
            // } else {
            //     bitmap.imageCache.src=bitmap.texture;
            //     this.context2D.drawImage(bitmap.imageCache, 0, 0);
            // }
            if (bitmap.texture != null) {
                if (bitmap.texture.bitmapData == null) {
                    let img = new Image();
                    img.src = bitmap.texture.id;
                    img.onload = () => {
                        this.context2D.drawImage(img, 0, 0);
                        bitmap.texture.bitmapData = img;
                    }
                } else {
                    this.context2D.drawImage(bitmap.texture.bitmapData, 0, 0);
                }
            } else {
                console.log("no bitmap resource find");
            }


        }

        renderTextField(textField: TextField) {
            this.context2D.fillText(textField.text, 0, 10);
            textField._measureTextWidth = this.context2D.measureText(textField.text).width;
        }
    }

}
