import * as THREE from 'three';
import { geScreentDimension } from './utils';


export default class Money {
  
    constructor(props) {
        //super(props);

        this.props = props;
        this.scene = this.props.scene;
        this.camera = this.props.camera;

        this.money;
        
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);

        this.create();
    }

    create(){
        console.log('CREATE MONEY');
        const geo = new THREE.CylinderGeometry( 0.3, 0.3, 0.15, 32 );
        const mat = new THREE.MeshBasicMaterial({color: new THREE.Color(1,1,0)});

        this.money = new THREE.Mesh(geo, mat);
        this.money.rotation.x = Math.PI/2;
        this.scene.add(this.money);
        this.money.name = "money";
        //this.money.visible = false;
    } 

    reset(x, y){
        this.money.position.set(x, y ,0);
    }

    show(x,y){
        this.money.visible = true;
        this.money.position.set(x, y, 0);
    }
 
    update() {
        const height = geScreentDimension(this.camera, 'height');
        if(this.money.position.y > -(height/2) +  + (this.money.scale.y/2)){
            this.money.position.y -= 0.01
        }
    }
}

