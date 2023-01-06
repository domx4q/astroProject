import defaults from "@/mixins/defaults";
// IMPORTANT: Private properties are not supported in Vue 3 so we can't use getters and setters
export class Hotspot {
    uuid = defaults.methods.genUUID();
    constructor(name, position, normal) {
        this.name = name;
        this.position = new Vector3D(position.x, position.y, position.z);
        this.normal = new Vector3D(normal.x, normal.y, normal.z);

        this.description = "";
        this.classification = ["unknown"];
        this.action = false;
        this.type = "marker";
        this.level = "1";

        this.class = ""
    }
    fromSaveData(data) {
        this.name = data.name;
        this.position = new Vector3D(data.position.x, data.position.y, data.position.z);
        this.normal = new Vector3D(data.normal.x, data.normal.y, data.normal.z);
        this.description = data.description;
        this.classification = data.classification;
        this.action = data.action;
        this.type = data.type;
        this.level = data.level;
        this.class = data.class;
    }
    renewUUID() {
        this.uuid = defaults.methods.genUUID();
    }

}

export class Vector3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    set string(s) {
        const a = s.replaceAll("m", "").split(" ")
        this.x = parseFloat(a[0])
        this.y = parseFloat(a[1])
        this.z = parseFloat(a[2])
    }
    get dict() {
        return {x: this.x, y: this.y, z: this.z}
    }
    get array() {
        return [this.x, this.y, this.z]
    }
    get modelString() {
        return `${this.x}m ${this.y}m ${this.z}m`
    }
}

export const ZERO_VECTOR = new Vector3D(0, 0, 0);
export const EMPTY_HOTSPOT = new Hotspot("", ZERO_VECTOR, ZERO_VECTOR);
