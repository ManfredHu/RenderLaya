# RenderLaya
在用Laya跟Matter.js做项目的时候发现Laya官方Demo有两个LayaRender文件，一个是LayaRender.js一个是matter-RenderLaya.js，看官网是用的LayaRender.js。所以就先Donwload下来用了，后面发现其中有很多坑，比如看LayaRender.js有很多参数是无用的。再来是一些什么角度指示器之类的，选项没法用。跟Matter.js的原生的渲染器有很大出入，故优化参考了Matter.js的Render写了这个RenderLaya.

# Introduce
而`/test/matter.html` 是写的单纯跑matter的例子，matter原生渲染器，可以看下[matter.js官网的例子](http://brm.io/matter-js/demo/#slingshot)。
这两个应该是一模一样的。

`/test/laya.html` 是跑laya和matter结合的例子，这里用到了新写的RenderLaya渲染器。这里跟[Laya官网的DEMO](https://layaair.ldc.layabox.com/demo/?category=2d&group=Physics&name=Slingshot)应该是一样的

**但是Laya官网却不能实现类似Matter.js官网的例子,因为LayaRender写的有问题，所以要替换成RenderLaya。**

# Init Options

 ```js
 var render = LayaRender.create({
     engine: engine,
     container: gameWorld,
     width: stageWidth,
     height: stageHeight,
     options: {
         hideWireFrames: true, //默认为false，正式环境开启，隐藏线框
         wireframes: false, //是否显示线框
         showAngleIndicator: true, //角度指示器
         showAxes: true, //显示坐标轴,如果显示了坐标轴则角度指示器也会一起显示
         showVelocity: true, //显示速度
         showBounds: true, //显示边框
         showPositions: true, //显示中心点
         showIds: true //显示id
     }
 });
 LayaRender.run(render);
 ```
 
类似上面这里，一些参数的说明在注释已经标明。
- 特别说明hideWireFrames这个参数，是用于**正式环境**的。之前有遇到，因为LayaRender渲染器把调试的线框加入到Laya的舞台上导致舞台顶部多了一像素的白条，排bug排了好久才发现。
- 其他参数大家可以随意测试
- showIds这个参数，因为Laya本身fillText的API会报错，这里先注释掉了，可能是我用的Laya版本有问题

# 一些改进点
1. 修复角度指示器
2. remove元素的时候，遍历子元素的Sprite一起移除
3. 修复setBackground参数为transparent的时候
4. 修复坐标指示器
5. 修复显示速度
6. 修复显示中心点

# Start
直接打开`test/laya.html`和`test/matter.html`就可以看到了。默认显示的是改进后的对比，应该是无大差别的。
![对比](https://github.com/ManfredHu/RenderLaya/raw/master/otherImage/compare.png)






