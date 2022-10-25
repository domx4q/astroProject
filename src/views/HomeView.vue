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
      v-on:camera-change="updateZoom"
      @load="planetLoaded">
    <div class="controls">
      <div id="buttons">
        <input type="file" @change="onFileChange" id="textureInput" :accept="allowedFileTypes" class="button" :disabled="!loaded"/>
        <input type="checkbox" v-model="auto_rotate" id="auto_rotate" :disabled="!loaded">
        <label for="auto_rotate">Auto-Rotate</label>
      </div>
      <div class="sliders">
        <input type="range" min="-1" max="1" id="x_slider" v-model="testCoordinates.x" step="any">
        <input type="range" min="-1" max="1" id="y_slider" v-model="testCoordinates.y" step="any">
        <input type="range" min="-1" max="1" id="z_slider" v-model="testCoordinates.z" step="any">
        <input type="number" min="-1" max="1" id="x_text" v-model="testCoordinates.x" step="any">
        <input type="number" min="-1" max="1" id="y_text" v-model="testCoordinates.y" step="any">
        <input type="number" min="-1" max="1" id="z_text" v-model="testCoordinates.z" step="any">
        <label for="x_slider">x</label>
        <label for="y_slider">y</label>
        <label for="z_slider">z</label>
        <input type="range" min="0" :max="currentPlanet.resolution * 1024" v-model="imageCoordinates.x" step="1">
        <input type="range" min="0" :max="currentPlanet.resolution * 512" v-model="imageCoordinates.y" step="1">
        <input type="number" min="0" :max="currentPlanet.resolution * 1024" v-model="imageCoordinates.x" step="1">
        <input type="number" min="0" :max="currentPlanet.resolution * 512" v-model="imageCoordinates.y" step="1">
        <label for="x_slider">x</label>
        <label for="y_slider">y</label>
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
    <button class="hotspot" slot="hotspot-test" data-position="0m 0m 0m" data-normal="0m 0m 0m"></button>
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

      testCoordinates: {
        x: 0,
        y: 0,
        z: 0,
      },
      imageCoordinates: {
        x: 0,
        y: 0,
      },

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
    randomTexture() {
      let curRandom = this.textures[Math.floor(Math.random() * this.textures.length)]
      while (curRandom === this.currentTexture) {
        curRandom = this.textures[Math.floor(Math.random() * this.textures.length)]
      }
      this.currentTexture = curRandom
      return curRandom
    },
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
    getAnnotationPosition(imageX, imageY, resolution = this.currentPlanet.resolution, apply = true){
      // input values are in pixels of the texture image
      // the resolution show the texture resolution so 2means full hd
      // possible values for the resolution are 1, 2, 4, 8, 16, 32
      // sample: X:2000, Y:1500
      // one for the data-position and one for the data-normal
      // the planet / sphere has a radius of 1m
      // sample: Input: X:1503, Y:1204, resolution: 4 Output: [0.6226778616649562, -0.340360073268179, 0.6872144723808735]

      // the max value for every axis is 1 and the lowest is -1 so the center is 0
      const y = ((imageY / (resolution * 512 / 2)) -1) * -1
      const x = (imageX / (resolution * 512 / 2)) -1
      // the z value is calculated with the pythagorean theorem
      const z = Math.sqrt(1 - Math.pow(this.testCoordinates.x, 2) - Math.pow(this.testCoordinates.y, 2))
      if (apply) {
        this.testCoordinates.x = x
        this.testCoordinates.y = y
        this.testCoordinates.z = z
      }
      return [x, y, z]
    },
    makeHotspotString(x, y, z) {
      return `${x}m ${y}m ${z}m`
    },
    test(){
      const coords = [
        3639,
        1829,
      ]
      // TODO: IMPORTANT: NEXT: improve the calculation of the position
      // console.log(this.getAnnotationPosition(3639, 1829, 8))
      this.imageCoordinates.x = coords[0]; // real value 3945
      this.imageCoordinates.y = coords[1]; // real value 1706
      let differeceX = 3945 - 3639
      let differeceY = 1706 - 1829
      this.imageCoordinates.x += differeceX
      this.imageCoordinates.y += differeceY
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
    }
  },
  watch: {
    auto_rotate: function (newVal, oldVal) {
      if (newVal) {
        this.planet.setAttribute("auto-rotate", "")
      } else {
        this.planet.removeAttribute("auto-rotate")
      }
    },
    loaded: function (newVal, oldVal) {
      if (newVal) {
        this.changePlanet(this.findPlanet("moon"), true) //todo: only temporary when merging change this back to jupiter
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
