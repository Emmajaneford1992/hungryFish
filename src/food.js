import * as THREE from 'three';
import { geScreentDimension } from './utils';


export default class Food {
  
    constructor(props) {
        //super(props);

        this.props = props;
        this.scene = this.props.scene;
        this.camera = this.props.camera;

        this.food;
        this.showing = false;
        
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.eatFood = this.eatFood.bind(this);

        this.create();
    }

    create(){
        console.log('CREATE FOOD');
        const geo = new THREE.CapsuleGeometry(0.1, 0.1, 4, 8, 1 );
        const mat = new THREE.MeshBasicMaterial({color: new THREE.Color(0.5,1,0.5), transparent: true});


        this.food = new THREE.Mesh(geo, mat);
        this.scene.add(this.food);
        //this.food.visible = false;
    } 

    show(x,y){
        this.food.visible = true;
        this.food.position.set(x, y, 0);
        this.showing = true;
        this.food.material.opacity = 1;
    }

    eatFood(){
        console.log('EAT FOOD');
        this.showing = false;
        this.food.visible = false;
    }
 
    update() {
        const height = geScreentDimension(this.camera, 'height');
        if(this.food.position.y > -(height/2)  + (this.food.scale.y/2)){
            this.food.position.y -= 0.01
        } else {
            
            if( this.food.material.opacity > 0){
                this.food.material.opacity -= 0.01;
            } else {
                this.food.visible = false;
                this.showing = false;
            }       
        }
    }
}

