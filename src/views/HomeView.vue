<template>
  <model-viewer
      :src="modelSrc"
      alt="Es ist ein Fehler aufgetreten beim Laden des 3D-Modells."
      ar
      touch-action="none"
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

      @click.alt="addHotspot"
      @keyup.space="auto_rotate = !auto_rotate"
      v-on:camera-change="updateZoom"
      @load="planetLoaded">
    <div class="controls">
      <div id="buttons">
        <div class="flex-column">
          <input type="file" @change="onFileChange" id="textureInput" :accept="allowedFileTypes" class="button" :disabled="!loaded"/>
          <button class="button" @click="downloadHotspots" :disabled="!loaded" style="font-size: 1.04em;box-shadow: 0 0 0 5px red; color: red"
          v-if="!isMobile">Hotspots speichern</button>
        </div>
        <div class="flex-column">
          <div class="inline"><input type="checkbox" v-model="auto_rotate" id="auto_rotate" :disabled="!loaded">
            <label for="auto_rotate">Automatische Rotation</label></div>
          <div class="inline"><input type="checkbox" v-model="enable_pan" id="enable_pan" :disabled="!loaded">
            <label for="enable_pan">Verschieben aktivieren</label></div>
        </div>

      </div>
      <ul class="planets">
        <template v-for="planet in planets" :key="planet.uuid">
          <li class="planet-selector" v-if="planet.enabled" @click="changePlanet(planet)"
              :class="{active: planet.uuid === currentPlanet.uuid, disabled: !loaded}">
            <span>{{ planet.name }}</span>
          </li>
        </template>
      </ul>
      <div class="hotspot-settings" :class="{hidden: hotspots.length === 0}" v-if="!isMobile">
        <h2>Hotspot Einstellungen</h2>
        <form action="#" @submit.prevent="updateLastHotspot" class="flex-column">
          <input type="text" v-model="lastHotspot.name" placeholder="Name" :disabled="!loaded" id="hotspot_name_input" aria-autocomplete="none" autocomplete="off" spellcheck="true"
                 @focus="$event.target.select();hotspot_settings_focused=true" @change="updateLastHotspot" @keyup="updateLastHotspot" @blur="hotspot_settings_focused=false">
          <input type="text" v-model="lastHotspot.description" placeholder="Beschreibung" :disabled="!loaded" aria-autocomplete="none" autocomplete="off" spellcheck="true"
                 @focus="hotspot_settings_focused=true" @change="updateLastHotspot" @keyup="updateLastHotspot" @blur="hotspot_settings_focused=false">
          <select v-model="lastHotspot.type" :disabled="!loaded" @change="updateLastHotspot">
<!--            <option selected value="default">Standart</option>-->
            <option value="location">Ort</option>
            <option value="marker">Markierung</option>
          </select>
          <select v-model="lastHotspot.level" :disabled="!loaded" @change="updateLastHotspot" v-if="lastHotspot.type === 'location'">
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
            <option value="5">Level 5</option>
          </select>
          <select v-model="lastHotspot.classification" :disabled="!loaded" @change="updateLastHotspot" multiple>
            <option v-for="classification in classifications" :value="classification.value" :key="classification.value">{{ classification.label }}</option>
          </select>
          <div class="inline"><input type="checkbox" id="hotspot_action_setting" v-model="lastHotspot.action" @change="updateLastHotspot">
            <label for="hotspot_action_setting">Aktion</label></div>
<!--          <button type="submit" :disabled="!loaded" style="background-color: dodgerblue;">Speichern</button>-->
        </form>
      </div>
    </div>

    <!-- region hotspots-->
    <template v-for="hotspot in hotspots" :key="hotspot.uuid">
      <button class="hotspot" :slot="'hotspot-' + hotspot.type + '-' + hotspot.uuid"
              :data-position="makeHotspotString(hotspot.position.x, hotspot.position.y, hotspot.position.z)"
              :data-normal="makeHotspotString(hotspot.normal.x, hotspot.normal.y, hotspot.normal.z)"
              :class="[hotspot.class, {action: hotspot.action}]" data-visibility-attribute="visible">
        <span class="hotspot-annotation">{{ hotspot.name }}</span>
      </button>
    </template>
    <!-- endregion hotspots-->
  </model-viewer>
</template>

<script>
// @ is an alias to /src
import planets from '@/assets/data/planets.json'
import annotations from '@/assets/data/annotations.json'

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
      allowedFileTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp", "application/json", "text/plain"],
      hotspot_settings_focused: false,
      zoomFactor: 1,
      lastHotspot: {
        name: "",
        description: "",
        classification: ["unknown"],
        action: false,
        position: {
          x: 0,
          y: 0,
          z: 0
        },
        normal: {
          x: 0,
          y: 0,
          z: 0
        },
        type: "marker",
        level: "1", // desto höher, desto detaillierter / kleiner
      },

      hotspots: [],

      accent_color: "hsl(197, 45%, 49%)",
      bg_color: "#fff",

      auto_rotate: true,
      enable_pan: false,
      currentPlanet: planets.empty
    }
  },
  computed: {
    classifications() {
      return annotations.data.classifications
    },
    isMobile() {
      return this.$store.state.isMobile
    }
  },
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
      if (file && this.allowedFileTypes.includes(file.type)) {
        if (file.type === "application/json" || file.type === "text/plain") {
          const fileReader = new FileReader()
          let json;
          fileReader.readAsText(file, "UTF-8")
          fileReader.onload = e => {
            json = JSON.parse(fileReader.result)
            this.hotspots = json.map(hotspot => {
              return {...hotspot, uuid: this.$globals.genUUID()}
            })
          }
        } else {
          this.createAndApplyTexture(URL.createObjectURL(file))
          this.hotspots = []
        }
      }
    },
    changePlanet(planet, force = false) {
      if (!this.loaded && !force) return;
      this.currentPlanet = planet
      this.currentTexture = `/textures/${planet.texture}`
      this.createAndApplyTexture(`/textures/${planet.texture}`)

      // update hotspots
      this.hotspots = annotations.planets[this.currentPlanet.key]
      if (this.hotspots === undefined) this.hotspots = []
        this.hotspots = this.hotspots.map(hotspot => {
          return {...hotspot, uuid: this.$globals.genUUID()}
        })
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
      const zoom = this.planet.getFieldOfView() / this.planet.getMaximumFieldOfView()
      this.planet.setAttribute("orbit-sensitivity", this.defaultOrbitSensi * Math.pow(zoom, 2))
      this.zoomFactor = zoom

    },
    addHotspot(event) {
      const xClick = event.offsetX;
      const yClick = event.offsetY;

      const positionAndNormal = this.planet.positionAndNormalFromPoint(xClick, yClick);
      const position = positionAndNormal.position;
      const normal = positionAndNormal.normal;

      const name = "Hotspot " + Math.floor(Math.random() * 1000)
      this.hotspots.push({
        position: position,
        normal: normal,
        name: name,
        uuid: this.$globals.genUUID(),
        type: "marker",
        class: "marker",
      });
      this.lastHotspot.name = name;
      this.lastHotspot.position = position;
      this.lastHotspot.normal = normal;
      this.lastHotspot.description = "";

      const nameInput = document.querySelector("#hotspot_name_input")
      nameInput.focus()
      setTimeout(() => {
        nameInput.select()
      }, 100)
    },
    downloadHotspots() {
      let hotspots = JSON.parse(JSON.stringify(this.hotspots));
      // rmove from every hotspot the uuid and the type
      hotspots = hotspots.map(hotspot => {
        delete hotspot.uuid;
        return hotspot;
      })
      this.$globals.download("hotspots-" + this.currentPlanet.annotationsKey + ".txt", JSON.stringify(hotspots))
    },
    updateLastHotspot() {
      // remove last hotspot
      this.hotspots.pop();
      this.hotspots.push({
        ...this.lastHotspot,
        uuid: this.$globals.genUUID(),
        class: this.lastHotspot.type === "location" ? "location level-" + this.lastHotspot.level : this.lastHotspot.type,
        level: this.lastHotspot.type === "location" ? this.lastHotspot.level : undefined,
      })
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
    enable_pan: function (newVal, oldVal) {
      if (!newVal) {
        this.planet.setAttribute("disable-pan", "")
      } else {
        this.planet.removeAttribute("disable-pan")
      }
    },
    // eslint-disable-next-line no-unused-vars
    loaded: function (newVal, oldVal) {
      if (newVal) {
        this.changePlanet(this.findPlanet("moon"), true)
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
    hotspot_settings_focused: function (newVal, oldVal) {
      if (newVal) {
        this.planet.setAttribute("data-settings-active", "true")
      } else {
        this.planet.removeAttribute("data-settings-active")
      }
    },
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

/*region hotspots*/
.hotspot {
  --hotspot-color: rgba(255, 255, 255, 0.9);
  /*--min-hotspot-opacity: .2;*/
  --min-hotspot-opacity: 0;
  --max-hotspot-opacity: 1;
  --hotspot-base-scale: 1;
  --levelOpacityMultiplier: 1;
  --hotspot-zoom: v-bind(zoomFactor);
  --hotspot-scale: var(--hotspot-base-scale);

  position: relative;
  cursor: pointer;
  width: calc(20px * var(--hotspot-scale));
  height: calc(20px * var(--hotspot-scale));
  border-radius: 10px;
  border: none;
  background-color: var(--hotspot-color);
  box-sizing: border-box;
  pointer-events: none;
  opacity: var(--max-hotspot-opacity);

  transition: height .2s linear, width .2s linear, opacity .2s linear;
}
.hotspot:not([data-visible]) { /*todo absprache mit Louis, wie dke verschiedenen Hotspots dargestellt werden*/
  --hotspot-scale: calc(var(--hotspot-base-scale) * 0.5);
  opacity: var(--min-hotspot-opacity);
}
.hotspot > * {
  pointer-events: none;
  cursor: pointer;
  transform: translateY(-50%);
}
.hotspot-annotation {
  background: var(--hotspot-color);
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 2px 4px;
  color: rgba(0, 0, 0, 0.8);
  display: block;
  font-family: Futura, Helvetica Neue, sans-serif;
  font-size: 16px;
  font-weight: 700;
  left: calc(100% + 1em);
  max-width: 128px;
  overflow-wrap: break-word;
  padding: 0.5em 1em;
  position: absolute;
  top: 50%;
  width: max-content;
  scale: 1;

  transition: all .5s ease, opacity .2s ease; /*transition applied to every object because scale is not available*/
}
.hotspot.action, .hotspot.action > * {
  cursor: pointer;
  pointer-events: initial;
}
.hotspot:not([data-visible]) .hotspot-annotation {
  opacity: 0;
  pointer-events: none;
  transform: translateX(1em);
}
.hotspot.normal {
  --hotspot-base-scale: 1;
}
.hotspot.small {
  --hotspot-base-scale: 0.5;
}
.hotspot.large {
  --hotspot-base-scale: 1.5;
}
.hotspot.xxl {
  --hotspot-base-scale: 2;
}
.hotspot.location {
  --hotspot-color: rgba(255, 255, 255, 0.9);
}
.hotspot.rover {
  --hotspot-color: rgba(201, 99, 99, 0.9);
}
.hotspot.marker {
  --hotspot-color: rgba(255, 213, 0, 0.9);
}

.hotspot-settings{
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.hotspot.location[data-visible], .hotspot.location[data-visible] .hotspot-annotation {
  opacity: calc(var(--max-hotspot-opacity) * (1 / var(--hotspot-zoom)) * var(--levelOpacityMultiplier)) !important;
}
#planet[data-settings-active] .hotspot, #planet[data-settings-active] .hotspot-annotation {
  transition: none !important; /*fixes the blinking when fast typing and updating the hotspot*/
}
.hotspot.location.level-1 {
  --levelOpacityMultiplier: 1;
}
.hotspot.location.level-2 {
  --levelOpacityMultiplier: 0.8;
}
.hotspot.location.level-3 {
  --levelOpacityMultiplier: 0.6;
}
.hotspot.location.level-4 {
  --levelOpacityMultiplier: 0.4;
}
.hotspot.location.level-5 {
  --levelOpacityMultiplier: 0.2;
}
/*endregion hotspots*/
form > * {
  font-size: 1em;
  margin: 5px;
  width: 100%;
  border: none;
  outline: none;
  border-radius: 4px;
  background-color: #eaeaea;
}
/* This keeps child nodes hidden while the element loads */
:not(:defined) > * {
  display: none;
}
.hidden {
  display: none;
}
</style>
