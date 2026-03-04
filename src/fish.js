import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Money from './money';
import { geScreentDimension } from './utils';
import Food from './food';

export default class Fish {
  
    constructor(props) {
        //super(props);

        this.props = props;
        this.scene = this.props.scene;
        this.camera = this.props.camera;

        this.fish;
        this.isHungry = false;
        this.isStarving = false;
        this.age = 0;
    

        this.destination;
        this.numOfMoves = 0;
        this.speed = 0.02;
        
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.setColour = this.setColour.bind(this);
        this.getRandomPos = this.getRandomPos.bind(this);

        this.clock = new THREE.Clock();
        this.elapsed = 0;
        this.duration = 4000;
        this.money;

        this.count = 0;

        this.mixer;

        this.create();
    }

    create(){
        //console.log('CREATE FISH PROPS', this.props?.state?.numOfFish);
        const modelSrc = new URL("./assets/models/fish.glb", import.meta.url).href;
        const loader = new GLTFLoader();
       
        
        const height = geScreentDimension(this.camera, 'height');
        const width = geScreentDimension(this.camera, 'width');


        // const geo = new THREE.BoxGeometry(0.5,0.5,0.5);
        // const mat = new THREE.MeshBasicMaterial({color: new THREE.Color(0.5,1,0.5)});
        // this.fish = new THREE.Mesh(geo, mat);
        // this.scene.add(this.fish);

        loader.load(modelSrc, (gltf) => {
            console.log(gltf);
            this.fish = gltf.scene;
            //this.fish.position.set(this.getRandomPos(-width/2, width/2), this.getRandomPos(-height/2, height/2), 0);
            
            this.fish.scale.set(0.5, 0.5, 0.5);
            this.scene.add(this.fish);
            this.fish.name = 'fish';

            this.mixer = new THREE.AnimationMixer(gltf.scene);
            const action = this.mixer.clipAction(gltf.animations[0]);
            action.play();
                
            this.fish.position.set(this.getRandomPos((-width/2)+0.5, (width/2)-0.5), this.getRandomPos(-(height/2)+0.5, (height/2)-0.5), 0);
            this.destination = new THREE.Vector3(this.getRandomPos((-width/2)+0.5, (width/2)-0.5), this.getRandomPos(-(height/2)+0.5, (height/2)-0.5), 0);
            
            this.direction = this.fish.position.x < this.destination.x ? 'right' : 'left';
            this.fish.rotation.set(0, this.direction == 'left' ? -Math.PI/2 : Math.PI/2, 0);
         
            
            this.numOfMoves = this.fish.position.distanceTo(this.destination)/this.speed;
            console.log(this.numOfMoves);
            console.log('create', this.numOfMoves, this.destination.x, this.fish.position.x, this.destination.y, this.fish.position.y  );

            this.money = new Money({scene: this.scene, camera: this.camera, props: this.props});
            this.money.reset(this.fish.position.x, this.fish.position.y);

            this.setColour();
            setTimeout(() => {
                this.isHungry = true;
                this.setColour();
            }, 1200);

        }); 
    } 

 
    update() {
        if(this.fish){
            const delta = this.clock.getDelta();
            if (this.mixer) this.mixer.update(delta);

            this.elapsed += delta;
            const t = Math.min(this.elapsed / this.duration, 1);
            const height = geScreentDimension(this.camera, 'height');
            const width = geScreentDimension(this.camera, 'width');

            this.count += 1;

            if(this.isHungry) {
                let closestFood = 0;
                let smallestDistance = width; // change later
                this.props.food.forEach((food, index) => {
                    console.log (index, this.fish.position.distanceTo(food.food.position), smallestDistance)
                    if(this.fish.position.distanceTo(food.food.position) < smallestDistance && food.showing){
                        closestFood = index;
                        smallestDistance = this.fish.position.distanceTo(food.food.position);
                        //console.log (closestFood,  smallestDistance)
                    }

                })

                if(this.props.food[closestFood].showing){

                    this.destination = new THREE.Vector3(this.props.food[closestFood].food.position.x, this.props.food[closestFood].food.position.y, 0);
                    this.direction = this.fish.position.x < this.destination.x ? 'right' : 'left';
                    this.fish.rotation.set(0, this.direction == 'left' ? -Math.PI/2 : Math.PI/2, 0);
                    this.numOfMoves = this.fish.position.distanceTo(this.destination)/this.speed;
                    this.count = 0;



                    if (this.fish.position.distanceTo(this.props.food[closestFood].food.position) < 0.1 && this.props.food[closestFood].showing) {
                        console.log('FEED');
                        this.isHungry = false;
                        this.setColour();
                        this.props.food[closestFood].eatFood();
                        setTimeout(() => {
                            this.isHungry = true;
                            this.setColour();
                        }, 1200);
                    }
                }
            }

            this.fish.position.x += (this.destination.x - this.fish.position.x)/(this.numOfMoves-this.count);
            this.fish.position.y += (this.destination.y - this.fish.position.y)/(this.numOfMoves-this.count);;
            

            if (this.fish.position.distanceTo(this.destination) < 0.1) {
                console.log('END OF ANIM');

                this.destination = new THREE.Vector3(this.getRandomPos((-width/2)+0.5, (width/2)-0.5), this.getRandomPos(-(height/2)+0.5, (height/2)-0.5), 0);
                this.direction = this.fish.position.x < this.destination.x ? 'right' : 'left';
                this.fish.rotation.set(0, this.direction == 'left' ? -Math.PI/2 : Math.PI/2, 0);
                
                this.numOfMoves = this.fish.position.distanceTo(this.destination)/this.speed;
                this.count = 0;

            }
            this.money.update();
        }
    }

    setColour() {
        if (!this.fish) return;

        this.fish.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const materials = Array.isArray(child.material)
                    ? child.material
                    : [child.material];

                materials.forEach((material) => {
                    if (material.name === 'fish_material') {
                        material.color.set(
                            this.isHungry ? 0xF0E68C : 0xFFA500
                        );
                        material.needsUpdate = true;
                    }
                });
            }
        });
    }

    getRandomPos(min, max) {
        return Math.random() * (max - min) + min;
    }


 
}

