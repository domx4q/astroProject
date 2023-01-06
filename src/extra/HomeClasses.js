import defaults from "@/mixins/defaults";
// IMPORTANT: Private properties are not supported in Vue 3, so we can't use getters and setters
// region Hotspots
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
// endregion Hotspots

//region Solar System
class SpaceObjectInfo {
    constructor({name, description, link, linkText, newLineDot, autoFetch, detailed}) {
        this.name = name;
        this.description = description;
        this.link = link;
        this.linkText = linkText;
        this.newLineDot = newLineDot;
        this.autoFetch = autoFetch;
        this.detailed = detailed;
    }
}

class SpaceObject {
    uuid = defaults.methods.genUUID();
    isChild;
    type;
    moons = []; // need to be declared here because otherwise some moons will raise an error

    constructor({name, texture, resolution, orderPriority, enabled = true, annotationsKey, copyright = "© NASA", key, info, customModel = false, customModelFile = null}) {
        this.name = name;
        this.texture = texture;
        this.resolution = resolution;
        this.orderPriority = orderPriority;
        this.enabled = enabled;
        this.annotationsKey = annotationsKey;
        this.copyright = copyright;
        this.key = key;
        this.customModel = customModel;
        this.customModelFile = customModelFile;
        this.info = info;
    }
}

class Moon extends SpaceObject {
    constructor({name, texture, resolution, orderPriority, enabled = true, annotationsKey, copyright = "© NASA", key, info, customModel = false, customModelFile = null}) {
        super({
            name, texture, resolution, orderPriority, enabled, annotationsKey, copyright, key, info, customModel, customModelFile});
        this.type = "moon";
        this.isChild = true;
    }
}

class Planet extends SpaceObject {
    constructor({name, texture, resolution, orderPriority, enabled = true, annotationsKey, copyright = "© NASA", key, info, customModel = false, customModelFile = null, moons = []}) {
        super({
            name, texture, resolution, orderPriority, enabled, annotationsKey, copyright, key, info, customModel, customModelFile});
        this.type = "planet";
        this.moons = moons;
        this.isChild = false;
    }
}
class SolarSystem {
    constructor(planets) {
        this.planets = planets;
    }

    get empty() {
        return new Planet({
            name: "empty",
            texture: "empty.png",
            resolution: 1,
            orderPriority: -1,
            enabled: false,
            annotationsKey: "empty",
            key: "empty",
        })
    }
    get asArray() {
        return this.planets
    }
    get isEmpty() {
        return this.planets.length === 0
    }

    findPlanet(key) {
        // return this.planets.find(p => p.key === key) || this.empty // cant use because of moons
        for (const planet of this.planets) {
            if (planet.key === key) return planet
            for (const moon of planet.moons) {
                if (moon.key === key) return moon
            }
        }
    }
}

// region Config
export const SOLAR_SYSTEM = new SolarSystem([
    new Planet({
        name: "Neptun",
        texture: "2k_neptune.jpg",
        resolution: 2,
        orderPriority: 1,
        enabled: true,
        annotationsKey: "neptune",
        key: "neptune",
        copyright: "Solar System Scope",
        info: new SpaceObjectInfo({
            name: "Neptun",
            description: "",
            link: "https://de.wikipedia.org/wiki/Neptun_(Planet)",
            linkText: "Wikipedia",
            newLineDot: true,
            autoFetch: true,

            detailed: {
                Oberfläche: "Radius: 24.622 km\nÄquatordurchmesser: 49.528 km\nmittlere Dichte: 1,638 g/cm³\nGravitation: 11,15 m/s²\nTemperatur: −201 °C",
                Allgemeines: "Entfernung: 4.495.000.000 km\nUmlaufzeit: 165 Jahre"
            }
        }),
    }),
    new Planet({
        name: "Uranus",
        texture: "2k_uranus.jpg",
        resolution: 2,
        orderPriority: 1,
        enabled: true,
        annotationsKey: "uranus",
        key: "uranus",
        copyright: "Solar System Scope",
        info: new SpaceObjectInfo({
            name: "Uranus",
            description: "",
            link: "https://de.wikipedia.org/wiki/Uranus_(Planet)",
            linkText: "Wikipedia",
            newLineDot: true,
            autoFetch: true,

            detailed: {
                Oberfläche: "Radius: 25.362 km\nÄquatordurchmesser: 51.118 km\nmittlere Dichte: 1,271 g/cm³\nGravitation: 24,79 m/s²\nTemperatur: –197 °C",
                Allgemeines: "Entfernung: 2.871.00.000 km\nUmlaufzeit: 84 Jahre"
            }
        }),
    }),
    new Planet({
        name: "Venus Atmosphere",
        texture: "4k_venus_atmosphere.jpg",
        resolution: 4,
        orderPriority: 3,
        enabled: true,
        annotationsKey: "venus",
        key: "venus_atm",
        copyright: "Solar System Scope",
        info: new SpaceObjectInfo({
            name: "Venus",
            description: "",
            link: "https://de.wikipedia.org/wiki/Venus_(Planet)",
            linkText: "Wikipedia",
            newLineDot: true,
            autoFetch: true,

            detailed: {
                Eigenschaften: "mittlere Dichte: 5,243 g/cm³\nGravitation: 8,87 m/s²"
            }
        }),
    }),
    new Planet({
        name: "Venus Oberfläche",
        texture: "8k_venus_surface.jpg",
        resolution: 8,
        orderPriority: 3,
        enabled: true,
        annotationsKey: "venus",
        key: "venus_grd",
        copyright: "Solar System Scope",
        info: new SpaceObjectInfo({
            name: "Venus",
            description: "",
            link: "https://de.wikipedia.org/wiki/Venus_(Planet)",
            linkText: "Wikipedia",
            newLineDot: true,
            autoFetch: true,

            detailed: {
                Oberfläche: "Radius: 6.051,8 km\nÄquatordurchmesser: 12.103,6 km\nTemperatur: min.: 437 °C   Mittel.: 464 °C   max.: 497 °C",
                Allgemeines: "Entfernung: 108.200.000 km\nUmlaufzeit: 225 Tage"
            }
        }),
    }),
    new Planet({
        name: "Erde",
        texture: "8k_earth_realistic.png",
        resolution: 8,
        orderPriority: 12,
        enabled: false,
        annotationsKey: "earth",
        key: "earth",
        copyright: "Solar System Scope",
        info: new SpaceObjectInfo({
            name: "Erde",
            description: "",
            link: "https://de.wikipedia.org/wiki/Erde",
            linkText: "Wikipedia",
            newLineDot: true,
            autoFetch: true,

            detailed: {
                Oberfläche: "Radius: 6.371 km\nÄquatordurchmesser: 12.742 km\nmittlere Dichte: 5,514 g/cm³\nGravitation: 9,807 m/s²\nTemperatur: Min.<space>−89 °C  Mittel +15 °C  Max.<space>+57°C",
                Allgemeines: "Entfernung: 149.600.000 km\nUmlaufzeit: 1 Jahr"
            }
        }),
    }),
    new Planet({
        name: "Jupiter",
        texture: "8k_jupiter.jpg",
        resolution: 4,
        orderPriority: 7,
        enabled: true,
        annotationsKey: "jupiter",
        key: "jupiter",
        copyright: "Solar System Scope",
        info: new SpaceObjectInfo({
            name: "Jupiter",
            description: "",
            link: "https://de.wikipedia.org/wiki/Jupiter_(Planet)",
            linkText: "Wikipedia",
            newLineDot: true,
            autoFetch: true,

            detailed: {
                Oberfläche: "Radius: 69.911 km\nÄquatordurchmesser: 142.984 km\nmittlere Dichte: 1,33 g/cm³\nGravitation: 24,79 m/s²\nTemperatur: −108 °C",
                Allgemeines: "Entfernung: 778.500.000 km\nUmlaufzeit: 12 Jahre"
            }
        }),
        moons: [
            new Moon({
                name: "Io",
                texture: "2k_io.jpg",
                resolution: 2,
                orderPriority: 1,
                enabled: true,
                annotationsKey: "io",
                key: "io",
                copyright: "NASA 3D Resources",
                info: new SpaceObjectInfo({
                    name: "Io (Jupitermond)",
                    description: "",
                    link: "https://de.wikipedia.org/wiki/Io_(Mond)",
                    linkText: "Wikipedia",
                    newLineDot: true,
                    autoFetch: true,

                    detailed: {
                        Oberfläche: "Radius: 1.821,6 km\nÄquatordurchmesser: 3.643,2 km\nmittlere Dichte: 3,528 g/cm³\nGravitation: 1,796 m/s²\nTemperatur: Min.<space>? °C  Mittel -143,15 °C  Max.<space>-73,15 °C",
                        Allgemeines: "Entfernung zur Erde: 628.300.000 km\nUmlaufzeit: 42 Stunden"
                    }
                }),
            }),
            new Moon({
                name: "Europa",
                texture: "2k_europa.jpg",
                resolution: 2,
                orderPriority: 1,
                enabled: true,
                annotationsKey: "europa",
                key: "europa",
                copyright: "NASA 3D Resources",
                info: new SpaceObjectInfo({
                    name: "Europa (Jupitermond)",
                    description: "",
                    link: "https://de.wikipedia.org/wiki/Europa_(Mond)",
                    linkText: "Wikipedia",
                    newLineDot: true,
                    autoFetch: true,

                    detailed: {
                        Oberfläche: "Radius: 1.560,8 km\nÄquatordurchmesser: 3.121,6 km\nmittlere Dichte: 3,010 g/cm³\nGravitation: 1,314 m/s²\nTemperatur: Min.<space>-223,15 °C  Mittel -171,15 °C  Max.<space>-133,15 °C",
                        Allgemeines: "Entfernung zur Erde: 628.300.000 km\nUmlaufzeit: 3,551 Tage"
                    }
                }),
            }),
            new Moon({
                name: "Ganymed",
                texture: "2k_ganymed.jpg",
                resolution: 2,
                orderPriority: 1,
                enabled: true,
                annotationsKey: "ganymede",
                key: "ganymede",
                copyright: "NASA 3D Resources",
                info: new SpaceObjectInfo({
                    name: "Ganymed (Jupitermond)",
                    description: "",
                    link: "https://de.wikipedia.org/wiki/Ganymed_(Mond)",
                    linkText: "Wikipedia",
                    newLineDot: true,
                    autoFetch: true,

                    detailed: {
                        Oberfläche: "Radius: 2.634,1 km\nÄquatordurchmesser: 5.268,2 km\nmittlere Dichte: 1,940 g/cm³\nGravitation: 1,428 m/s²\nTemperatur: Min.<space>-183,15 °C  Mittel -163,15 °C  Max.<space>-113,15 °C",
                        Allgemeines: "Entfernung zur Erde: 628.300.000 km\nUmlaufzeit: 172 Stunden"
                    }
                }),
            }),
            new Moon({
                name: "Kallisto",
                texture: "2k_callisto.jpg",
                resolution: 2,
                orderPriority: 1,
                enabled: true,
                annotationsKey: "callisto",
                key: "callisto",
                copyright: "NASA 3D Resources",
                info: new SpaceObjectInfo({
                    name: "Kallisto (Jupitermond)",
                    description: "",
                    link: "https://de.wikipedia.org/wiki/Kallisto_(Mond)",
                    linkText: "Wikipedia",
                    newLineDot: true,
                    autoFetch: true,

                    detailed: {
                        Oberfläche: "Radius: 2.410,3 km\nÄquatordurchmesser: 4.820,6 km\nmittlere Dichte: 1,830 g/cm³\nGravitation: 1,236 m/s²\nTemperatur: -139,15 °C",
                        Allgemeines: "Entfernung zur Erde: 628.300.000 km\nUmlaufzeit: 17 Tage"
                    }
                }),
            }),
        ]
    }),
    new Planet({
        name: "Mars",
        texture: "8k_mars.jpg",
        resolution: 8,
        orderPriority: 6,
        enabled: true,
        annotationsKey: "mars",
        key: "mars",
        copyright: "Solar System Scope",
        info: new SpaceObjectInfo({
            name: "Mars / der Rote Planet",
            description: "",
            link: "https://de.wikipedia.org/wiki/Mars_(Planet)",
            linkText: "Wikipedia",
            newLineDot: true,
            autoFetch: true,

            detailed: {
                Oberfläche: "Radius: 3.389,5 km\nÄquatordurchmesser: 6.792,4 km\nmittlere Dichte: 3,933 g/cm³\nGravitation: 3,721 m/s²\nTemperatur: Min.<space>–153 °C  Mittel −63 °C  Max.<space>+20 °C",
                Allgemeines: "Entfernung: 227.900.000 km\nUmlaufzeit: 687 Tage"
            }
        }),
    }),
    new Planet({
        name: "Merkur",
        texture: "8k_mercury.jpg",
        resolution: 8,
        orderPriority: 2,
        enabled: true,
        annotationsKey: "mercury",
        key: "mercury",
        copyright: "Solar System Scope",
        info: new SpaceObjectInfo({
            name: "Merkur",
            description: "",
            link: "https://de.wikipedia.org/wiki/Merkur_(Planet)",
            linkText: "Wikipedia",
            newLineDot: true,
            autoFetch: true,

            detailed: {
                Oberfläche: "Radius: 2.439,7 km\nÄquatordurchmesser: 4.879,4 km\nmittlere Dichte: 5,427 g/cm³\nGravitation: 24,79 m/s²\nTemperatur: Min.<space>−173 °C  Mittel +167 °C  Max.<space>+427 °C",
                Allgemeines: "Entfernung: 58.000.000 km\nUmlaufzeit: 88 Tage"
            }
        }),
    }),
    new Planet({
        name: "Mond",
        texture: "8k_moon.jpg",
        resolution: 8,
        orderPriority: 13,
        enabled: true,
        annotationsKey: "moon",
        key: "moon",
        copyright: "Solar System Scope",
        info: new SpaceObjectInfo({
            name: "Mond",
            description: "",
            link: "https://de.wikipedia.org/wiki/Mond",
            linkText: "Wikipedia",
            newLineDot: true,
            autoFetch: true,

            detailed: {
                Zusammensetzung: "Der Mond besteht zu <b>81 % aus Silizium</b>, <b>13 % aus Sauerstoff</b>, <b>3 % aus Eisen</b> und 3 % aus anderen Elementen.",
                Durchmesser: "Der Durchmesser des Mondes beträgt <b>3476 km</b>.",
                Temperatur: "Die Temperatur auf dem Mond beträgt <b>-173 °C</b> bei Tag und <b>-233 °C</b> bei Nacht.",
                "Entfernung zur Erde": "Der Mond ist <b>384.400 km</b> von der Erde entfernt."
            }
        }),
    }),
    new Planet({
        name: "Saturn",
        texture: "8k_saturn.jpg",
        resolution: 4,
        orderPriority: 5,
        enabled: true,
        annotationsKey: "saturn",
        key: "saturn",
        copyright: "Solar System Scope",
        info: new SpaceObjectInfo({
            name: "Saturn",
            description: "",
            link: "https://de.wikipedia.org/wiki/Saturn_(Planet)",
            linkText: "Wikipedia",
            newLineDot: true,
            autoFetch: true,

            detailed: {
                Oberfläche: "Radius: 58.232 km\nÄquatordurchmesser: 120.536km\nmittlere Dichte: 0,687 g/cm³\nGravitation: 10,44 m/s²\nTemperatur: −139 °C",
                Allgemeines: "Entfernung: 1.434.000.000 km\nUmlaufzeit: 29 Jahre"
            }
        }),
        customModel: true,
        customModelFile: "models/saturn.glb",
    }),
    new Planet({
        name: "Leer",
        texture: "empty.png",
        resolution: 1,
        orderPriority: -1,
        enabled: false,
        annotationsKey: "empty",
        key: "empty",
    }),
]);
// endregion Config
//endregion Solar System
