class Vector{
    x: number;
    y: number;
    z: number;
    constructor(x:number,y:number,z:number){
        this.x=x;this.y=y;this.z=z;
    }
    toArray(){
        return [this.x,this.y,this.z];
    }
}
class SceneObject{
    id: string;
    position: Vector;
    scale: Vector;
    rotation_axis:Vector;//expand this to multiple rotations
    rotation_angle: number;
    type:string;

    constructor(id:string,type:string,position: Vector,scale: Vector){
        this.id=id;
        this.position = position;
        this.scale = scale;
        this.type = type;
    }
}

class BufferObject{
    position_buffer: Object;
    index_buffer: Object;
    color_buffer: Object;
    constructor(position_buffer:Object,index_buffer:Object,color_buffer:Object){
        this.position_buffer = position_buffer;
        this.index_buffer = index_buffer;
        this.color_buffer = color_buffer;
    }
}

class Scene{
    private scene_by_type_: { [index: string]: Array<SceneObject>; } = {};
    private scene_by_id_: {[index:string]:SceneObject}={};
    addElement(id:string,type:string,position: Vector,scale: Vector){
        if(!this.scene_by_type_[type])this.scene_by_type_[type] = new Array<SceneObject>();
        var so=new SceneObject(id,type,position,scale);
        this.scene_by_type_[type].push(so);
        this.scene_by_id_[id]=so;
    }

    getAllElementsByType(type:string){
        return this.scene_by_type_[type];
    }
    getElementById(id:string){
        return this.scene_by_id_[id];
    }
    getSceneInTypeOrder(){
        return this.scene_by_type_;
    }

}