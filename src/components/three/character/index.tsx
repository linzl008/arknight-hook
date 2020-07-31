// @ts -nocheck
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
let position = { x: 0 , y: 0, z:0}
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
        // createCube()
        renderer.render(scene, camera);
        animate()
        checkResize()
    }
    function addLight(){
        //点光源
       /* let point = new THREE.PointLight(0xffffff);
        point.position.set(0, 0, 0); //点光源位置
        scene.add(point); //点光源添加到场景中
        // 平行光
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
        directionalLight.position.set(0, 0, 0);
        scene.add(directionalLight);*/
        //环境光
        let ambient = new THREE.AmbientLight(0x000000);
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
        camera.position.set(0, 0, 500); //设置相机位置
        camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
        /**透视投影相机对象*/
        // camera = new THREE.PerspectiveCamera(90, width / height, 1, 1000);
        // camera.position.set(0, 0, 0); //设置相机位置
        // camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
    }
    function getData() {
        // for (let i = 0; i < 16; i++) {
        //     drawCard( 22.5*i )
        // }
        const LEVELNUMBER = 16
        getAllArkCharacters().then((res:any)=>{
            console.log({res});
            setCharacterList(res)
            for (let i = 0; i < res.length; i++) {
                const re = res[i];
                try{
                    drawCard(re, (360 / LEVELNUMBER ) * ( i % LEVELNUMBER), Math.floor(i/LEVELNUMBER))
                }catch (e) {
                    console.log(e);
                }
            }
        })
    }

    function checkResize() {
        window.onresize=function(){
            // 重置渲染器输出画布canvas尺寸
            renderer.setSize( threeDomRef.current.clientWidth, threeDomRef.current.clientHeight );
            // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
            camera.aspect =  threeDomRef.current.clientWidth/threeDomRef.current.clientHeight;
            // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
            // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
            // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
            camera.updateProjectionMatrix ();
        };
    }
    function animate ()  {
        requestAnimationFrame( animate ); //像计时器一样重复的渲染
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01; // 立方体进行 的操作
        // position.x++
        // position.y++
        // position.z++
        // camera.position.set( position); //设置相机位置
        // camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
        renderer.render( scene,camera );
    }

    function drawCard( character: Character, angle: number, level: number){
        angle = level * 10 + angle
        // var texture_2 = new THREE.TextureLoader().load(require("../../../assets/images/158B.png"));
        // var texture_2 = new THREE.TextureLoader().load(require("../../../assets/images/158B.png"));
        console.log(require("../../../assets/characters/images/"+character.card_a));
        console.log(require("../../../assets/characters/images/"+character.card_b));
        var texture_1 = new THREE.TextureLoader().load(require("../../../assets/characters/images/"+character.card_a));
        var texture_2 = new THREE.TextureLoader().load(require("../../../assets/characters/images/"+character.card_b));
        let material_1 = new THREE.MeshPhongMaterial({
            map: texture_1,
            transparent: true,
        });
        let material_2 = new THREE.MeshPhongMaterial({
            map: texture_2,
            color: 0x333333,
            transparent: true,
        });
        let material = new THREE.MeshPhongMaterial({
            transparent: true,
            color: 0x00000000
        });
        // texture_1.needsUpdate = true;
        // texture_2.needsUpdate = true;
        const geometry = new THREE.BoxGeometry( 25, 50, 1);//绘制一个立方体，擦书相当于定点位置 （three自带的对象）
        let card = new THREE.Mesh(geometry, [ material, material,material ,material,material_1 ,material_2]);//起始点不闭合
        let angelPI = Math.PI * angle / 180
        card.translateX(200 * Math.sin(angelPI))
        card.translateZ(200 * Math.cos(angelPI))
        card.rotateY(angelPI);//可以旋转圆弧线
        card.translateY(level*50)
        scene.add(card);
    }
    return (
         <div className="three" ref={threeDomRef} />
    )
}

export default CharacterCom
