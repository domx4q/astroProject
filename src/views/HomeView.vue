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

      @keyup.enter="test"
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
              :data-normal="makeHotspotString(hotspot.normal.x, hotspot.normal.y, hotspot.normal.z)"
              data-visibility-attribute="visible">
        <span class="hotspot-text">{{ hotspot.name }}</span>
      </button>
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

      hotspots: [{"position":{"x":-0.5048961828394458,"y":-0.3059022371704292,"z":-0.7913548894067033},"normal":{"x":-0.5082978851214086,"y":-0.3117534775964816,"z":-0.8027720904388763},"name":"Hotspot 767","uuid":"a9ba3141-b35c-45fc-b434-8d7e4ba631c0"},{"position":{"x":-0.532006362490459,"y":-0.5519292728896721,"z":-0.6248767382994962},"normal":{"x":-0.5528869067062027,"y":-0.5323925703080227,"z":-0.6409947109560763},"name":"Hotspot 848","uuid":"3ad46b0f-ef35-4e3a-9082-14031a395ab2"},{"position":{"x":-0.8620799833468453,"y":-0.34124131731265805,"z":-0.3401830265936292},"normal":{"x":-0.8712602180422704,"y":-0.35774966360012994,"z":-0.3360369185832555},"name":"Hotspot 361","uuid":"5acae835-f90a-4db9-98bd-bf62b8e6f5c6"},{"position":{"x":-0.25114431407941895,"y":-0.49673001031156017,"z":-0.8168877753274382},"normal":{"x":-0.27335165646221005,"y":-0.49035763059948717,"z":-0.8275435130687828},"name":"Hotspot 264","uuid":"38b9799a-6138-456c-a0d7-862e0c0b54dd"},{"position":{"x":-0.36556099877139814,"y":0.011466709118559404,"z":-0.9165008074299466},"normal":{"x":-0.359747526206349,"y":0.024421363174281827,"z":-0.9327300329726294},"name":"Hotspot 562","uuid":"eb69fd91-0614-4c8f-9690-16ceea0f82c5"},{"position":{"x":0.5579087926361967,"y":0.819177937070048,"z":0.016034766801493128},"normal":{"x":0.5782590059662104,"y":0.815729241813197,"z":0.014224136874942759},"name":"Hotspot 503","uuid":"1382d699-7499-43a4-acbb-12c2b775021b"},{"position":{"x":0.6724351908980171,"y":0.5509489491979003,"z":-0.4715118693870646},"normal":{"x":0.6920605260190628,"y":0.5323931046669481,"z":-0.4874523673440374},"name":"Hotspot 269","uuid":"bb551b4f-13ff-47f4-91d5-8683de0634fe"},{"position":{"x":0.7684649266127768,"y":0.5307060834629622,"z":0.3244165120540841},"normal":{"x":0.7738615714107577,"y":0.5323916052487003,"z":0.34307061511354314},"name":"Hotspot 187","uuid":"43d6dad8-4135-4a19-87d8-4f510fef3c69"},{"position":{"x":-0.00811388222680387,"y":0.8024571847954647,"z":0.5816908615384468},"normal":{"x":-0.0142193117926155,"y":0.8157304227611749,"z":0.5782574587102349},"name":"Hotspot 305","uuid":"97ad8534-1d88-401d-a1a2-7004bb236d56"},{"position":{"x":-0.39493947153266407,"y":0.36772841193893724,"z":0.8273696623910132},"normal":{"x":-0.4198816892523404,"y":0.35775138041716303,"z":0.8340943093201245},"name":"Hotspot 959","uuid":"ba5fa57a-0344-4188-b482-474c569da613"}],

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
    },
    test() {
      console.log(JSON.stringify(this.hotspots))
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
  --hotspot-color: red;

  display: block;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: var(--hotspot-color);
  box-sizing: border-box;
  pointer-events: none;
  border: none;

  transition: background-color .2s linear, border .1s linear;
}
.hotspot:not([data-visible]) { /*todo apsprache mit Louis, wie dke verschiedenen Hotspots dargestellt werden*/
  background-color: transparent;
  border: 3px solid var(--hotspot-color);
}
/* This keeps child nodes hidden while the element loads */
:not(:defined) > * {
  display: none;
}
</style>
