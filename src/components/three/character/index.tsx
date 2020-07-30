// @ts-nocheck
import React, { useState, useEffect, useRef} from 'react'
import './index.less'

import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {Character} from "@/interface";
import {getAllArkCharacters} from "@/services/dataSource";
let scene:any = null
let camera:any = null
let renderer:any = null
let cube:any = null
let controls :any = null
const CharacterCom = (props:any) => {
    const threeDomRef :any = useRef(null)
    const [characterList, setCharacterList] = useState<Character[]>([])
    useEffect(()=>{
        initThree()
        getData()
    },[])

    function initThree() {
        if(!threeDomRef.current){
            initThree()
        }
        console.log(THREE,threeDomRef.current.clientWidth);
        scene =  new THREE.Scene() //创建场景
        addLight()
        addCamera()
        let width = threeDomRef.current.clientWidth; //窗口宽度
        let height = threeDomRef.current.clientHeight; //窗口高度
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);//设置渲染区域尺寸
        renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
        //将渲染器的长宽 设置为我们要显示的容器长宽
        if(threeDomRef){
            threeDomRef.current.appendChild( renderer.domElement );
        }
        //执行渲染操作   指定场景、相机作为参数
        renderer.render(scene, camera);
        //点光源
        let point = new THREE.PointLight(0xffffff);
        point.position.set(400, 200, 300); //点光源位置
        scene.add(point); //点光源添加到场景中
        let axisHelper =new THREE.AxesHelper(200);
        //将坐标系加入到场景中
        scene.add(axisHelper);
        //将整个场景推入我们要显示的元素中
        // camera.position.z = 500;
        controls = new OrbitControls(camera,renderer.domElement);//创建控件对象
        // 我们生成的元素默认和相机的位置是重复的，我们需要将相机移开，这样我们才可以看到渲染的内容
        createCube()
        renderer.render(scene, camera);
        animate()
        checkResize()
    }
    function addLight(){
        //点光源
        let point = new THREE.PointLight(0xffffff);
        point.position.set(400, 200, 300); //点光源位置
        scene.add(point); //点光源添加到场景中
        //环境光
        let ambient = new THREE.AmbientLight(0x444444);
        scene.add(ambient);
    }
    function addCamera(){
        /**
         * 相机设置
         */
        let width = threeDomRef.current.clientWidth; //窗口宽度
        let height = threeDomRef.current.clientHeight; //窗口高度
        let k = width / height; //窗口宽高比
        let s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
        camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 10000);
        camera.position.set(2000, 2000, 2000); //设置相机位置
        camera.lookAt(scene.position); //设置相机方向(指向的场景对象)

    }
    function getData() {
        drawArc()
        // getAllArkCharacters().then((res:any)=>{
        //     console.log({res});
        //     setCharacterList(res)
        // })
    }

    function checkResize() {
        window.onresize=function(){
            // 重置渲染器输出画布canvas尺寸
            renderer.setSize( threeDomRef.current.clientWidth, threeDomRef.current.clientHeight );
        };
    }
    function createCube() {
        const geometry = new THREE.BoxGeometry( 10, 2, 10, 4 );//绘制一个立方体，擦书相当于定点位置 （three自带的对象）
        const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        //定义材质 我们这里用简单的颜色 ， 其他的属性可以写入对象，就可以更改材质
         cube = new THREE.Mesh( geometry, material );
        //我们用到网格将 定义的材质用到定义的立方题上生成cube
        scene.add( cube );//将我们生成的cube放到场景中
    }
    function animate ()  {
        requestAnimationFrame( animate ); //像计时器一样重复的渲染
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01; // 立方体进行 的操作
        renderer.render( scene,camera );
    }

    function drawArc(){
        let points = [],
            length = 100,
            end = 50,
            circle = 40;
        for (let i = 0; i <= end; i++) {
            points.push(new THREE.Vector2(circle * Math.cos(Math.PI * 2 * i / length), circle * Math.sin(Math.PI * 2 * i / length)))
        }
        for (let i = end; i >= 0; i--) {
            points.push(new THREE.Vector2(circle * Math.cos(Math.PI * 2 * i / length), circle * Math.sin(Math.PI * 2 * i / length)))
        }
        let shape = new THREE.Shape(points);
        // shape.lineTo(0,10);//第2点

        var texture = new THREE.TextureLoader().load(require("../../../assets/images/158B.png"));
        console.log(texture);
        console.log();
        let material = new THREE.MeshPhongMaterial({
            // color: 0x333333,
            side: THREE.DoubleSide,
            map: texture,
        });
        texture.needsUpdate = true;
        // 设置材质数组
        var materialArr = [material, material, material, material, material, material];
        /**创建轮廓的扫描轨迹(3D样条曲线)*/
        var curve = new THREE.SplineCurve3([
            new THREE.Vector3( 0, 0, 0),
            new THREE.Vector3( 0, 100, 0)
        ]);
// LineLoop和Line不同，起始点闭合
        var geometry = new THREE.ExtrudeGeometry(//拉伸造型
            shape,//二维轮廓
            //拉伸参数
            {
                bevelEnabled:false,//无倒角
                extrudePath:curve,//选择扫描轨迹
                steps:50//扫描方向细分数
            }
        );
        let line = new THREE.Mesh(geometry, materialArr);//起始点不闭合
        // line.rotateX(Math.PI / 2);//可以旋转圆弧线
        scene.add(line);
    }
    return (
         <div className="three" ref={threeDomRef} />
    )
}

export default CharacterCom
