//slingshot DEMO
if (window.location.href.indexOf("demo") === -1) {
    (function() {
        var Sprite = Laya.Sprite;
        var Stage = Laya.Stage;
        var Browser = Laya.Browser;
        var WebGL = Laya.WebGL;
        var Render = Laya.Render;

        var stageWidth = 800;
        var stageHeight = 600;

        var Matter = Browser.window.Matter;
        var RenderLaya = Browser.window.RenderLaya || Browser.window.LayaRender;

        //是否使用线框，使用则不显示图片
        var hideWireFrames = window.location.href.indexOf("hideWireFrames") > -1 ? true : false;

        var mouseConstraint;
        var engine;
        var render;

        (function() {
            // 不支持WebGL时自动切换至Canvas
            Laya.init(stageWidth, stageHeight, WebGL);

            Laya.stage.alignV = Stage.ALIGN_MIDDLE;
            Laya.stage.alignH = Stage.ALIGN_CENTER;
            Laya.stage.scaleMode = window.location.href.indexOf("noScale") > -1 ? Stage.SCALE_NOSCALE : "showall";
            Laya.stage.bgColor = "#232628";

            setup();
        })();

        function setup() {
            initMatter();
            initWorld();

            Laya.stage.on("resize", this, onResize);
        }

        function initMatter() {
            var gameWorld = new Sprite();
            Laya.stage.addChild(gameWorld);

            // 初始化物理引擎
            engine = Matter.Engine.create({
                enableSleeping: true
            });
            Matter.Engine.run(engine);

            render = RenderLaya.create({
                engine: engine,
                container: gameWorld,
                width: stageWidth,
                height: stageHeight,
                options: {
                    hideWireFrames: false, //默认为false，正式环境开启，隐藏线框
                    wireframes: true,
                    showAngleIndicator: true, //角度指示器
                    showAxes: true, //显示坐标轴,如果显示了坐标轴则角度指示器也会一起显示
                    showVelocity: true, //显示速度
                    showBounds: true, //显示边框
                    showPositions: true, //显示中心点
                    showIds: true //显示id
                }
            });
            RenderLaya.run(render);

            mouseConstraint = Matter.MouseConstraint.create(engine, {
                element: Render.canvas
            });
            Matter.World.add(engine.world, mouseConstraint);
            render.mouse = mouseConstraint.mouse;
        }

        function initWorld() {
            // add bodies
            var Common = Matter.Common;
            var Composite = Matter.Composite;
            var Composites = Matter.Composites;
            var Bounds = Matter.Bounds;
            var Events = Matter.Events;
            var Grid = Matter.Grid;
            var Vector = Matter.Vector;
            var Body = Matter.Body;
            var Bodies = Matter.Bodies;
            var World = Matter.World;
            var Constraint = Matter.Constraint;
            var world = engine.world;
            var Mouse = Matter.Mouse;


            var group = Body.nextGroup(true);

            var ropeA = Composites.stack(100, 50, 8, 1, 10, 10, function(x, y) {
                return Bodies.rectangle(x, y, 50, 20, { collisionFilter: { group: group } });
            });

            Composites.chain(ropeA, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 2, render: { type: 'line' } });
            Composite.add(ropeA, Constraint.create({
                bodyB: ropeA.bodies[0],
                pointB: { x: -25, y: 0 },
                pointA: { x: ropeA.bodies[0].position.x, y: ropeA.bodies[0].position.y },
                stiffness: 0.5
            }));

            group = Body.nextGroup(true);

            var ropeB = Composites.stack(350, 50, 10, 1, 10, 10, function(x, y) {
                return Bodies.circle(x, y, 20, { collisionFilter: { group: group } });
            });

            Composites.chain(ropeB, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 2, render: { type: 'line' } });
            Composite.add(ropeB, Constraint.create({
                bodyB: ropeB.bodies[0],
                pointB: { x: -20, y: 0 },
                pointA: { x: ropeB.bodies[0].position.x, y: ropeB.bodies[0].position.y },
                stiffness: 0.5
            }));

            group = Body.nextGroup(true);

            var ropeC = Composites.stack(600, 50, 13, 1, 10, 10, function(x, y) {
                return Bodies.rectangle(x - 20, y, 50, 20, { collisionFilter: { group: group }, chamfer: 5 });
            });

            Composites.chain(ropeC, 0.3, 0, -0.3, 0, { stiffness: 1, length: 0 });
            Composite.add(ropeC, Constraint.create({
                bodyB: ropeC.bodies[0],
                pointB: { x: -20, y: 0 },
                pointA: { x: ropeC.bodies[0].position.x, y: ropeC.bodies[0].position.y },
                stiffness: 0.5
            }));

            World.add(world, [
                ropeA,
                ropeB,
                ropeC,
                Bodies.rectangle(400, 600, 1200, 50.5, { isStatic: true })
            ]);
        }

        function onResize() {
            // 设置鼠标的坐标缩放
            Matter.Mouse.setScale(mouseConstraint.mouse, {
                x: 1 / (Laya.stage.clientScaleX * Laya.stage._canvasTransform.a),
                y: 1 / (Laya.stage.clientScaleY * Laya.stage._canvasTransform.d)
            });
        }
    })();
} else if (window.location.href.indexOf("demo2") > -1) {
    (function() {
        var Sprite = Laya.Sprite;
        var Stage = Laya.Stage;
        var WebGL = Laya.WebGL;
        var Browser = Laya.Browser;
        var Stat = Laya.Stat;
        var Render = Laya.Render;

        var stageWidth = 800;
        var stageHeight = 600;

        var Matter = Browser.window.Matter;
        var RenderLaya = Browser.window.RenderLaya;

        //-------------------
        //是否使用线框，使用则不显示图片
        var hideWireFrames = window.location.href.indexOf("hideWireFrames") > -1 ? true : false;
        //-------------------

        var mouseConstraint;
        var engine;

        (function() {
            // 不支持WebGL时自动切换至Canvas
            Laya.init(stageWidth, stageHeight, WebGL);

            Laya.stage.alignV = Stage.ALIGN_MIDDLE;
            Laya.stage.alignH = Stage.ALIGN_CENTER;
            Laya.stage.scaleMode = window.location.href.indexOf("noScale") > -1 ? Stage.SCALE_NOSCALE : "showall";
            //可以对比一下Laya官网这里，因为官网的RenderLaya对Sprite设置bgColor，是无效的，所以显示了Laya.stage的颜色#232628
            //而默认背景颜色是#fff
            Laya.stage.bgColor = "#232628";
            Stat.show();
            setup();
        })();

        function setup() {
            initMatter();
            initWorld();

            Laya.stage.on("resize", this, onResize);
        }

        function initMatter() {
            var gameWorld = new Sprite();
            Laya.stage.addChild(gameWorld);

            // 初始化物理引擎
            engine = Matter.Engine.create({
                enableSleeping: true
            });
            Matter.Engine.run(engine);

            var render = RenderLaya.create({
                engine: engine,
                container: gameWorld,
                width: stageWidth,
                height: stageHeight,
                options: {
                    wireframes: false
                }
            });
            RenderLaya.run(render);

            mouseConstraint = Matter.MouseConstraint.create(engine, {
                element: Render.canvas
            });
            Matter.World.add(engine.world, mouseConstraint);
            render.mouse = mouseConstraint.mouse;
        }

        function initWorld() {
            // 创建游戏场景
            var group = Matter.Body.nextGroup(true);
            var particleOptions = {
                friction: 0.00001,
                collisionFilter: {
                    group: group
                },
                render: {
                    visible: false
                }
            };
            var cloth = Matter.Composites.softBody(200, 200, 20, 12, 5, 5, false, 8, particleOptions);

            for (var i = 0; i < 20; i++) {
                cloth.bodies[i].isStatic = true;
            }

            Matter.World.add(engine.world, [
                cloth,
                Matter.Bodies.circle(300, 500, 80, {
                    isStatic: true
                }),
                Matter.Bodies.rectangle(500, 480, 80, 80, {
                    isStatic: true
                })
            ]);
        }

        function onResize() {
            // 设置鼠标的坐标缩放
            Matter.Mouse.setScale(
                mouseConstraint.mouse, {
                    x: 1 / (Laya.stage.clientScaleX * Laya.stage._canvasTransform.a),
                    y: 1 / (Laya.stage.clientScaleY * Laya.stage._canvasTransform.d)
                });
        }
    })();
} else if (window.location.href.indexOf("demo3") > -1) {
    (function() {
        var Sprite = Laya.Sprite;
        var Stage = Laya.Stage;
        var Browser = Laya.Browser;
        var WebGL = Laya.WebGL;
        var Render = Laya.Render;

        var stageWidth = 800;
        var stageHeight = 600;

        var Matter = Browser.window.Matter;
        var RenderLaya = Browser.window.RenderLaya;

        //是否使用线框，使用则不显示图片
        var hideWireFrames = window.location.href.indexOf("hideWireFrames") > -1 ? true : false;

        var mouseConstraint;
        var engine;

        (function() {
            // 不支持WebGL时自动切换至Canvas
            Laya.init(stageWidth, stageHeight, WebGL);

            Laya.stage.alignV = Stage.ALIGN_MIDDLE;
            Laya.stage.alignH = Stage.ALIGN_CENTER;
            Laya.stage.scaleMode = window.location.href.indexOf("noScale") > -1 ? Stage.SCALE_NOSCALE : "showall";
            Laya.stage.bgColor = "#232628";

            setup();
        })();

        function setup() {
            initMatter();
            initWorld();

            Laya.stage.on("resize", this, onResize);
        }

        function initMatter() {
            var gameWorld = new Sprite();
            Laya.stage.addChild(gameWorld);

            // 初始化物理引擎
            engine = Matter.Engine.create({
                enableSleeping: true
            });
            Matter.Engine.run(engine);

            var render = RenderLaya.create({
                engine: engine,
                container: gameWorld,
                width: stageWidth,
                height: stageHeight,
                options: {
                    wireframes: false,
                    showAngleIndicator: true //角度指示器
                }
            });
            RenderLaya.run(render);

            mouseConstraint = Matter.MouseConstraint.create(engine, {
                element: Render.canvas
            });
            Matter.World.add(engine.world, mouseConstraint);
            render.mouse = mouseConstraint.mouse;
        }

        function initWorld() {
            var cradle = Matter.Composites.newtonsCradle(280, 100, 5, 30, 200);
            Matter.World.add(engine.world, cradle);
            Matter.Body.translate(cradle.bodies[0], {
                x: -180,
                y: -100
            });

            cradle = Matter.Composites.newtonsCradle(280, 380, 7, 20, 140);
            Matter.World.add(engine.world, cradle);
            Matter.Body.translate(cradle.bodies[0], {
                x: -140,
                y: -100
            });
        }

        function onResize() {
            // 设置鼠标的坐标缩放
            Matter.Mouse.setScale(mouseConstraint.mouse, {
                x: 1 / (Laya.stage.clientScaleX * Laya.stage._canvasTransform.a),
                y: 1 / (Laya.stage.clientScaleY * Laya.stage._canvasTransform.d)
            });
        }
    })();
} else if (window.location.href.indexOf("demo4") > -1) {
    (function() {
        var Sprite = Laya.Sprite;
        var Stage = Laya.Stage;
        var Render = Laya.Render;
        var Browser = Laya.Browser;
        var WebGL = Laya.WebGL;

        var stageWidth = 800;
        var stageHeight = 600;

        var Matter = window.Matter;
        var RenderLaya = window.RenderLaya;

        //-------------------
        //是否使用线框，使用则不显示图片
        var hideWireFrames = window.location.href.indexOf("hideWireFrames") > -1 ? true : false;
        //-------------------

        var mouseConstraint;
        var engine;

        (function() {
            Laya.init(stageWidth, stageHeight);

            Laya.stage.alignV = Stage.ALIGN_MIDDLE;
            Laya.stage.alignH = Stage.ALIGN_CENTER;

            Laya.stage.scaleMode = window.location.href.indexOf("noScale") > -1 ? Stage.SCALE_NOSCALE : "showall";

            setup();
        })();

        function setup() {
            initMatter();
            initWorld();

            Laya.stage.on("resize", this, onResize);
        }

        function initMatter() {
            var gameWorld = new Sprite();
            Laya.stage.addChild(gameWorld);

            // 初始化物理引擎
            engine = Matter.Engine.create({
                enableSleeping: true
            });
            Matter.Engine.run(engine);

            var render = RenderLaya.create({
                engine: engine,
                width: 800,
                height: 600,
                options: {
                    background: '../image/background.png', //传入16进制颜色如#00b6e4，或者图片路径如 http://www.manfredhu.com/images/matterjs.png
                    wireframes: false,
                    hideWireFrames: hideWireFrames, //是否隐藏线框体，通常如果你有贴图的话，是要隐藏所有刚体的，这里还会作用于指示器
                    // wireframeBackground: '#00ff00', //当wireframes为true的时候，wireframeBackground可以设置背景颜色
                    showAngleIndicator: true, //角度指示器
                }
            });
            RenderLaya.run(render);

            mouseConstraint = Matter.MouseConstraint.create(engine, {
                constraint: {
                    angularStiffness: 0.1,
                    stiffness: 2
                },
                element: Render.canvas
            });
            Matter.World.add(engine.world, mouseConstraint);
            render.mouse = mouseConstraint.mouse;
        }

        function initWorld() {
            var ground = Matter.Bodies.rectangle(395, 600, 815, 50, {
                    isStatic: true,
                    render: { //背景图的绿色草地会被刚体遮挡，这里如果不显示则不会遮挡到
                        visible: false
                    }
                }),
                rockOptions = {
                    density: 0.004,
                    render: {
                        sprite: {
                            texture: '../image/rock.png',
                            xOffset: 23.5,
                            yOffset: 23.5
                        }
                    }
                },
                rock = Matter.Bodies.polygon(170, 450, 8, 20, rockOptions),
                anchor = {
                    x: 170,
                    y: 450
                },
                elastic = Matter.Constraint.create({
                    pointA: anchor,
                    bodyB: rock,
                    stiffness: 0.05,
                    render: {
                        lineWidth: 5,
                        strokeStyle: '#dfa417'
                    }
                });

            var pyramid = Matter.Composites.pyramid(500, 300, 9, 10, 0, 0, function(x, y, column) {
                var texture = column % 2 === 0 ? '../image/block.png' : '../image/block-2.png';
                return Matter.Bodies.rectangle(x, y, 25, 40, {
                    render: {
                        sprite: {
                            texture: texture,
                            xOffset: 20.5,
                            yOffset: 28
                        }
                    }
                });
            });

            var ground2 = Matter.Bodies.rectangle(610, 250, 200, 20, {
                isStatic: true,
                render: {
                    fillStyle: '#edc51e',
                    strokeStyle: '#b5a91c'
                }
            });

            var pyramid2 = Matter.Composites.pyramid(550, 0, 5, 10, 0, 0, function(x, y, column) {
                var texture = column % 2 === 0 ? '../image/block.png' : '../image/block-2.png';
                return Matter.Bodies.rectangle(x, y, 25, 40, {
                    render: {
                        sprite: {
                            texture: texture,
                            xOffset: 20.5,
                            yOffset: 28
                        }
                    }
                });
            });

            Matter.World.add(engine.world, [mouseConstraint, ground, pyramid, ground2, pyramid2, rock, elastic]);

            Matter.Events.on(engine, 'afterUpdate', function() {
                if (mouseConstraint.mouse.button === -1 && (rock.position.x > 190 || rock.position.y < 430)) {
                    rock = Matter.Bodies.polygon(170, 450, 7, 20, rockOptions);
                    Matter.World.add(engine.world, rock);
                    elastic.bodyB = rock;
                }
            });

            //remove测试
            setTimeout(function() {
                Matter.Composite.remove(engine.world, pyramid2, true);
            }, 10000);
        }

        function onResize() {
            // 设置鼠标的坐标缩放
            // Laya.stage.clientScaleX代表舞台缩放
            // Laya.stage._canvasTransform代表画布缩放
            Matter.Mouse.setScale(mouseConstraint.mouse, {
                x: 1 / (Laya.stage.clientScaleX * Laya.stage._canvasTransform.a),
                y: 1 / (Laya.stage.clientScaleY * Laya.stage._canvasTransform.d)
            });
        }
    })();
} else if (window.location.href.indexOf("demo5") > -1) {
    (function() {
        var Sprite = Laya.Sprite;
        var Stage = Laya.Stage;
        var Browser = Laya.Browser;
        var WebGL = Laya.WebGL;
        var Render = Laya.Render;

        var stageWidth = 800;
        var stageHeight = 600;

        var Matter = Browser.window.Matter;
        var RenderLaya = Browser.window.RenderLaya;

        //是否使用线框，使用则不显示图片
        var hideWireFrames = window.location.href.indexOf("hideWireFrames") > -1 ? true : false;

        var mouseConstraint;
        var engine;

        (function() {
            // 不支持WebGL时自动切换至Canvas
            Laya.init(stageWidth, stageHeight, WebGL);

            Laya.stage.alignV = Stage.ALIGN_MIDDLE;
            Laya.stage.alignH = Stage.ALIGN_CENTER;
            Laya.stage.scaleMode = window.location.href.indexOf("noScale") > -1 ? Stage.SCALE_NOSCALE : "showall";
            Laya.stage.bgColor = "#232628";

            setup();
        })();

        function setup() {
            initMatter();
            initWorld();

            Laya.stage.on("resize", this, onResize);
        }

        function initMatter() {
            var gameWorld = new Sprite();
            Laya.stage.addChild(gameWorld);

            // 初始化物理引擎
            engine = Matter.Engine.create({
                enableSleeping: true
            });
            Matter.Engine.run(engine);

            var render = RenderLaya.create({
                engine: engine,
                container: gameWorld,
                width: stageWidth,
                height: stageHeight,
                options: {
                    wireframes: true,
                    showAngleIndicator: true
                }
            });
            RenderLaya.run(render);

            mouseConstraint = Matter.MouseConstraint.create(engine, {
                element: Render.canvas
            });
            Matter.World.add(engine.world, mouseConstraint);
            render.mouse = mouseConstraint.mouse;
        }

        function initWorld() {
            // add bodies
            var Common = Matter.Common;
            var Composite = Matter.Composite;
            var Composites = Matter.Composites;
            var Bounds = Matter.Bounds;
            var Events = Matter.Events;
            var Grid = Matter.Grid;
            var Vector = Matter.Vector;
            var Body = Matter.Body;
            var Bodies = Matter.Bodies;
            var World = Matter.World;
            var Constraint = Matter.Constraint;
            var world = engine.world;
            var Mouse = Matter.Mouse;

            var block = Bodies.rectangle(100, 100, 100, 50, { 
                isStatic: true,
                angle: 45 *  Math.PI/ 180
            });

            World.add(world, [
                block
            ]);

            var sp = new Laya.Sprite();
            // sp.pivot(166/2,90/2)
            // sp.pos(300,200);
            sp.graphics.drawRect(300, 200, 166, 90, "#ffff00");
            Laya.stage.addChild(sp);
            setInterval(function(){
                sp.rotation += 30;
            },2000)

        }

        function onResize() {
            // 设置鼠标的坐标缩放
            Matter.Mouse.setScale(mouseConstraint.mouse, {
                x: 1 / (Laya.stage.clientScaleX * Laya.stage._canvasTransform.a),
                y: 1 / (Laya.stage.clientScaleY * Laya.stage._canvasTransform.d)
            });
        }
    })();
}