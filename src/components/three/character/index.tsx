
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
        scene =  new THREE.Scene() //创建场景
        camera = new THREE.PerspectiveCamera( 75, threeDomRef.current.clientWidth / threeDomRef.current.clientHeight, 0.1, 1000 );
        //创建相机  这些参数在官网中都有指出  第一个参数 75 -> 视野角度（单位：度）  第二个参数是长宽比 第三个是近截面 第四个是远截面
        renderer = new THREE.WebGLRenderer({ antialias: true });
        //创建渲染器。讲道理我还没有看这个参数是什么意思。 但是官网中有一个测试浏览器是否可以使用WebGL的方法，需要用到的可看一下
        //这三个赋值是为了方便我们把创建立方体或者其他元素的方法拆分出去，不让代码显得太长
        renderer.setSize( threeDomRef.current.clientWidth, threeDomRef.current.clientHeight );
        //将渲染器的长宽 设置为我们要显示的容器长宽
        if(threeDomRef){
            threeDomRef.current.appendChild( renderer.domElement );
        }
        //将整个场景推入我们要显示的元素中
        camera.position.z = 5;
        controls = new OrbitControls(camera,renderer.domElement);//创建控件对象
        // 我们生成的元素默认和相机的位置是重复的，我们需要将相机移开，这样我们才可以看到渲染的内容
        createCube()
        animate()
        checkResize()
    }

    function getData() {
        getAllArkCharacters().then((res:any)=>{
            setCharacterList(res)
        })
    }

    function checkResize() {
        window.onresize=function(){
            // 重置渲染器输出画布canvas尺寸
            renderer.setSize( threeDomRef.current.clientWidth, threeDomRef.current.clientHeight );
        };
    }
    function createCube() {
        const geometry = new THREE.BoxGeometry( 1, 2, 1, 4 );//绘制一个立方体，擦书相当于定点位置 （three自带的对象）
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
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
    return (
         <div className="three" ref={threeDomRef} />
    )
}

export default CharacterCom
