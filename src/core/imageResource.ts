let imageJason = [
    { id: "ACCEPTABLE.png", width: 100, height: 100 },
    { id: "buttonAccept.png", width: 100, height: 100 },
    { id: "buttonFinish.png", width: 100, height: 100 },
    { id: "CAN_SUBMIT.png", width: 100, height: 100 },
    { id: "close.png", width: 100, height: 100 },
    { id: "d1.png", width: 100, height: 100 },
    { id: "d2.png", width: 100, height: 100 },
    { id: "d3.png", width: 100, height: 100 },
    { id: "d4.png", width: 100, height: 100 },
    { id: "dialog.jpg", width: 100, height: 100 },
    { id: "DURING.png", width: 100, height: 100 },
    { id: "f1.png", width: 100, height: 100 },
    { id: "f2.png", width: 100, height: 100 },
    { id: "f3.png", width: 100, height: 100 },
    { id: "f4.png", width: 100, height: 100 },
    { id: "heroButton.png", width: 100, height: 100 },
    { id: "heroDetails.jpg", width: 100, height: 100 },
    { id: "i1.png", width: 100, height: 100 },
    { id: "i2.png", width: 100, height: 100 },
    { id: "i3.png", width: 100, height: 100 },
    { id: "i4.png", width: 100, height: 100 },
    { id: "i5.png", width: 100, height: 100 },
    { id: "l1.png", width: 100, height: 100 },
    { id: "l2.png", width: 100, height: 100 },
    { id: "l3.png", width: 100, height: 100 },
    { id: "l4.png", width: 100, height: 100 },
    { id: "mask.png", width: 100, height: 100 },
    { id: "monster.png", width: 100, height: 100 },
    { id: "npc_0.png", width: 100, height: 100 },
    { id: "npc_1.png", width: 100, height: 100 },
    { id: "path.jpg", width: 100, height: 100 },
    { id: "pig.png", width: 100, height: 100 },
    { id: "r1.png", width: 100, height: 100 },
    { id: "r2.png", width: 100, height: 100 },
    { id: "r3.png", width: 100, height: 100 },
    { id: "r4.png", width: 100, height: 100 },
    { id: "taskButton.png", width: 100, height: 100 },
    { id: "taskPanel.jpg", width: 100, height: 100 },
    { id: "u1.png", width: 100, height: 100 },
    { id: "u2.png", width: 100, height: 100 },
    { id: "u3.png", width: 100, height: 100 },
    { id: "u4.png", width: 100, height: 100 },
    { id: "w1.jpg", width: 100, height: 100 },
    { id: "w2.jpg", width: 100, height: 100 },
    { id: "w3.jpg", width: 100, height: 100 },
    { id: "w4.jpg", width: 100, height: 100 },
    { id: "wall.jpg", width: 100, height: 100 },
];
namespace engine {
    export class ImageResource {
        bitmapData: HTMLImageElement;
        id: string;
        width: number;
        height: number;
        constructor(id: string, width: number, height: number) {
            this.id = id;
            this.width = width;
            this.height = height;
        }
    }
    export class Resourse {
        resourses: ImageResource[];
        private static Res: Resourse;
        constructor() {
            ;
        }
        public static getInstance(): Resourse {
            if (Resourse.Res == null) {
                Resourse.Res = new Resourse();
                Resourse.Res.resourses = new Array();
                return Resourse.Res;
            } else {
                return Resourse.Res;
            }
        }
        getRes(id: string): ImageResource {
            if (id.match("null")) {
                console.log("not find " + id + " in imageJason");//此处可替换为“若没有该id，则添加至resource数组”
                return null;
            }
            for (let i = 0; i < this.resourses.length; i++) {
                if (this.resourses[i].id.match(id)) {
                    return this.resourses[i];
                }
            }


        }
        initial() {
            imageJason.forEach((x) => {
                var y = new ImageResource(x.id, x.width, x.height);
                this.resourses.push(y);
            })
        }
    }
}