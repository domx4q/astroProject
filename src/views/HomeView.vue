<template>
  <model-viewer
      :src="modelSrc"
      alt="Es ist ein Fehler aufgetreten beim Laden des 3D-Modells."
      ar
      touch-action="pinch-zoom"
      camera-controls
      camera-orbit="70deg"
      auto-rotate
      auto-rotate-delay="2000"
      interaction-prompt="none"
      orbit-sensitivity=".8"
      shadow-intensity="1"
      exposure="1"
      environment-image="neutral"
      background-color="transparent"

      disable-pan

      id="planet"
      style="width: 100%; height: 100%"

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
      currentTexture: null,
      allowedFileTypes: ["image/png", "image/jpeg", "image/jpg"],

      accent_color: "hsl(197, 45%, 49%)",
      bg_color: "#fff",

      auto_rotate: true,
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
        this.changePlanet(this.findPlanet("jupiter"), true)
      }
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
</style>
