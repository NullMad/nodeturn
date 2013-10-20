var Vector = (function () {
    function Vector(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Vector.prototype.toArray = function () {
        return [this.x, this.y, this.z];
    };
    return Vector;
})();
var SceneObject = (function () {
    function SceneObject(id, type, position, scale) {
        this.id = id;
        this.position = position;
        this.scale = scale;
        this.type = type;
    }
    return SceneObject;
})();

var BufferObject = (function () {
    function BufferObject(position_buffer, index_buffer, color_buffer) {
        this.position_buffer = position_buffer;
        this.index_buffer = index_buffer;
        this.color_buffer = color_buffer;
    }
    return BufferObject;
})();

var Scene = (function () {
    function Scene() {
        this.scene_by_type_ = {};
        this.scene_by_id_ = {};
    }
    Scene.prototype.addElement = function (id, type, position, scale) {
        if (!this.scene_by_type_[type])
            this.scene_by_type_[type] = new Array();
        var so = new SceneObject(id, type, position, scale);
        this.scene_by_type_[type].push(so);
        this.scene_by_id_[id] = so;
    };

    Scene.prototype.getAllElementsByType = function (type) {
        return this.scene_by_type_[type];
    };
    Scene.prototype.getElementById = function (id) {
        return this.scene_by_id_[id];
    };
    Scene.prototype.getSceneInTypeOrder = function () {
        return this.scene_by_type_;
    };
    return Scene;
})();
//# sourceMappingURL=scene.js.map
