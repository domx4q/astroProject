<template>
  <model-viewer
      :src="modelSrc"
      alt="Es ist ein Fehler aufgetreten beim Laden des 3D-Modells."
      ar
      touch-action="pinch-zoom"
      camera-controls
      camera-orbit="90deg"
      auto-rotate
      auto-rotate-delay="2000"
      interaction-prompt="none"
      :orbit-sensitivity="defaultOrbitSensi"
      shadow-intensity="1"
      exposure="1"
      environment-image="neutral"
      background-color="transparent"

      disable-pan

      id="planet"
      style="width: 100%; height: 100%"

      @keyup.space="test"
      @click.ctrl="addHotspot"
      v-on:camera-change="updateZoom"
      @load="planetLoaded">
    <div class="controls">
      <div id="buttons">
        <input type="file" @change="onFileChange" id="textureInput" :accept="allowedFileTypes" class="button" :disabled="!loaded"/>
        <input type="checkbox" v-model="auto_rotate" id="auto_rotate" :disabled="!loaded">
        <label for="auto_rotate">Auto-Rotate</label>
      </div>
      <ul class="planets">
        <template v-for="planet in planets" :key="planet.uuid">
          <li class="planet-selector" v-if="planet.enabled" @click="changePlanet(planet)"
              :class="{active: planet.uuid === currentPlanet.uuid, disabled: !loaded}">
            <span>{{ planet.name }}</span>
          </li>
        </template>
      </ul>
    </div>

    <!-- region hotspots-->
    <template v-for="hotspot in hotspots" :key="hotspot.uuid">
      <button class="hotspot" :slot="'hotspot-' + hotspot.type + '-' + hotspot.uuid"
              :data-position="makeHotspotString(hotspot.position.x, hotspot.position.y, hotspot.position.z)"
              :data-normal="makeHotspotString(hotspot.normal.x, hotspot.normal.y, hotspot.normal.z)">{{ hotspot.name }}</button>
    </template>
    <!-- endregion hotspots-->
  </model-viewer>
</template>

<script>
// @ is an alias to /src
import planets from '@/assets/data/planets.json'

import('@google/model-viewer')
export default {
  name: 'HomeView',
  components: {},
  data() {
    return {
      modelSrc: 'models/sphere.glb',
      planet: null,
      planets: null,
      loaded: false,
      defaultOrbitSensi: 0.8,
      currentTexture: null,
      lastFieldOfView: 0,
      allowedFileTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],

      hotspots: [],

      accent_color: "hsl(197, 45%, 49%)",
      bg_color: "#fff",

      auto_rotate: false,
      currentPlanet: planets.empty
    }
  },
  computed: {},
  mounted() {
    console.log("HomeView mounted")
    // convert dict to array and add uuid and key as property
    this.planets = Object.keys(planets).map(key => {
      return {...planets[key], "key": key, uuid: this.$globals.genUUID()}
    })
    this.planets.sort((a, b) => (a.orderPriority < b.orderPriority) ? 1 : -1)
  },
  methods: {
    async createAndApplyTexture(image) {
      const material = this.planet.model.materials[0]

      const texture = await this.planet.createTexture(image)
      material.pbrMetallicRoughness['baseColorTexture'].setTexture(texture)

    },
    planetLoaded() {
      this.planet = document.querySelector('model-viewer#planet')
      this.loaded = true
    },
    onFileChange(e) {
      const file = e.target.files[0]
      this.currentPlanet = this.findPlanet("empty")
      this.createAndApplyTexture(URL.createObjectURL(file))
    },
    changePlanet(planet, force = false) {
      if (!this.loaded && !force) return;
      this.currentPlanet = planet
      this.currentTexture = `/textures/${planet.texture}`
      this.createAndApplyTexture(`/textures/${planet.texture}`)
    },
    findPlanet(key) {
      return this.planets.find(planet => planet.key === key)
    },
    makeHotspotString(x, y, z) {
      return `${x}m ${y}m ${z}m`
    },
    updateZoom(){
      let fieldOfView = 0;
      try {
        fieldOfView = this.planet.getFieldOfView()
      } catch (e) {
        return
      }
      if (!this.loaded || this.lastFieldOfView === fieldOfView) return;
      this.lastFieldOfView = fieldOfView;
      this.planet.setAttribute("orbit-sensitivity", this.defaultOrbitSensi * Math.pow(this.planet.getFieldOfView() / this.planet.getMaximumFieldOfView(), 2))
    },
    addHotspot(event) {
      const xClick = event.offsetX;
      const yClick = event.offsetY;

      const positionAndNormal = this.planet.positionAndNormalFromPoint(xClick, yClick);
      const position = positionAndNormal.position;
      const normal = positionAndNormal.normal;

      this.hotspots.push({
        position: position,
        normal: normal,
        name: "Hotspot " + Math.floor(Math.random() * 1000),
        uuid: this.$globals.genUUID()
      });
      this.planet.requestFrame();

    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    auto_rotate: function (newVal, oldVal) {
      if (newVal) {
        this.planet.setAttribute("auto-rotate", "")
      } else {
        this.planet.removeAttribute("auto-rotate")
      }
    },
    // eslint-disable-next-line no-unused-vars
    loaded: function (newVal, oldVal) {
      if (newVal) {
        this.changePlanet(this.findPlanet("jupiter"), true)
        setTimeout(() => {
          // do this manually because when set to false in data but not manually changed, then it won't update
          if (this.auto_rotate) {
            this.planet.setAttribute("auto-rotate", "")
          } else {
            this.planet.removeAttribute("auto-rotate")
          }

        }, 1000)
      }
    },
    // test coordinates (search deep)
    testCoordinates: {
      handler: function (newVal, oldVal) {
        if (this.loaded) {
          this.planet.updateHotspot({
            name: "hotspot-test",
            position: this.makeHotspotString(this.testCoordinates.x, this.testCoordinates.y, this.testCoordinates.z),
            normal: "0m 0m 0m"
          })
        }
      },
      deep: true
    },
    imageCoordinates: {
      handler: function (newVal, oldVal) {
        if (this.loaded) {
          this.getAnnotationPosition(newVal.x, newVal.y)
        }
      },
      deep: true
    }

  }
}
</script>
<style scoped>
.button {
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  background-color: v-bind(bg_color);
  color: v-bind(accent_color);
  border: none;
  outline: none;

  transition: background-color 0.2s linear, color 0.2s linear;

  box-shadow: 0 0 0 5px v-bind(accent_color);
}

#textureInput::file-selector-button {
  background-color: inherit;
  color: inherit;
  border: none;
  border-radius: 4px;
  outline: none;

}

.button:hover {
  background-color: v-bind(accent_color);
  color: v-bind(bg_color);
}
input[type='file'] {
  font-size: 0;
}

::file-selector-button {
  font-size: initial;
}

#buttons {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.planets {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 100;
}
li.planet-selector {
  background-color: v-bind(bg_color);
  color: v-bind(accent_color);
}
li.planet-selector.active {
  background-color: v-bind(accent_color);
  color: v-bind(bg_color);
}
li.planet-selector.disabled {
  color: grey;
  background-color: v-bind(bg_color);
}
.disabled, :disabled {
  cursor: not-allowed !important;
  touch-action: none;
  -ms-touch-action: none;
}

.hotspot {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: none;
  background-color: red;
  box-sizing: border-box;
  pointer-events: none;
}
/* This keeps child nodes hidden while the element loads */
:not(:defined) > * {
  display: none;
}
.sliders {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
