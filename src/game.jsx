import * as THREE from 'three';

import { h, Component } from 'preact';
import Fish from './fish';
import Food from './food';
import { element } from 'three/tsl';
import { geScreentDimension } from './utils';

class Game extends Component {
    constructor(props) {
        super(props);

        console.log('props', props);

        this.renderer;
        //this.controls;
        this.$game;
        this.fishes = [];
        this.food = [];
       
        console.log('GAME');
        this.init = this.init.bind(this);
        this.resize = this.resize.bind(this);
        this.animate = this.animate.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        console.log('Component mounted test');
        window.addEventListener('resize', () => {
            this.resize()
        });
        window.addEventListener('click', (event) => {
            this.onClick(event)
        });

        this.init();
        this.resize();
        this.animate();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
        window.removeEventListener('click', this.onClick)
    }   

    init(){
        console.log('INIT');
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0,0.5,1);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 10);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.$game.appendChild(this.renderer.domElement);

        //this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        //this.controls.enableDamping = true;

        const ambientLight = new THREE.AmbientLight(0xffffff, 2);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(10, 20, 10);
        this.scene.add(directionalLight);

        const {numOfFish, maxFood} = this.props?.state;
        console.log('INIT:', numOfFish);

        for(let i = 0; i < numOfFish; i++){
            this.increaseFish();
        }
       
        for(let i = 0; i < maxFood; i++){
            const food = new Food({scene: this.scene, camera: this.camera, props: this.props});
            this.food.push(food);
        }


        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

    }

    increaseFish(){
        console.log('increase fish')
        const fish = new Fish({scene: this.scene, camera: this.camera, props: this.props, food: this.food});
        this.fishes.push(fish);
    }

    onClick(event){
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const height = geScreentDimension(this.camera, 'height');
        const width = geScreentDimension(this.camera, 'width');

        let shownFood = false;
        this.food.forEach((food, index) => {
            if(!shownFood && !food.showing){
                shownFood = true;
                food.show(this.mouse.x * (width/2), this.mouse.y * (height/2));
            }
        });

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            console.log("Hit object:", intersects[0].object.name);
            if(intersects[0].object.name == "money") {
                this.props.increaseMoney();
                intersects[0].object.visible = false;

            }       
        }
    }

    resize(){
        console.log('RESIZE');
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate);
        //this.controls.update();
        this.renderer.render(this.scene, this.camera);
        if(this.fishes.length > 0){
            this.fishes.forEach(fish => {
                fish.update(); 
            });
        }

        if(this.food.length > 0){
            this.food.forEach(food => {
                food.update(); 
            });
        }
    }

    render(props, state) {
        return (
            <div class="game" ref={(el) => {this.$game = el; }}/>
        );
    }
        
}

export default Game;

