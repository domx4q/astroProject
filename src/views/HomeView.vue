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
      @keyup.ctrl.space.exact="auto_rotate = !auto_rotate"
      @keyup.alt.space.exact="enable_pan = !enable_pan"
      v-on:camera-change="updateZoom"
      @load="planetLoaded">
    <div class="controls">
      <div id="buttons">
        <div class="flex-column">
          <input type="file" @change="onFileChange" id="textureInput" :accept="allowedFileTypes" class="button" :disabled="!loaded"/>
          <button class="button" @click="downloadHotspots" :disabled="!loaded" style="font-size: 1.04em;box-shadow: 0 0 0 5px red; color: red"
          v-if="!isMobile">Hotspots speichern</button>
        </div>
        <div class="flex-column" style="margin-top: 10px">
          <FormKit
              type="group"
              :disabled="!loaded">
            <FormKit
                type="checkbox"
                label="Automatische Rotation"
                :help="!isMobile ? 'Tastenkombination: Strg + Leertaste' : ''"
                v-model="auto_rotate"/>
            <FormKit
                type="checkbox"
                label="Verschieben aktivieren"
                :help="!isMobile ? 'Tastenkombination: Alt + Leertaste' : ''"
                v-model="enable_pan"/>
          </FormKit>
        </div>

      </div>
      <ul class="planets" v-auto-animate>
        <template v-for="planet in planets" :key="planet.uuid">
          <li class="planet-selector" v-if="planet.enabled" @click="changePlanet(planet)"
              :class="{active: planet.uuid === currentPlanet.uuid, disabled: !loaded}">
            <span>{{ planet.name }}</span>
          </li>
        </template>
      </ul>
      <FormKit
          type="form"
          id="hotspot-settings"
          :form-class="{hidden: hotspots.length === 0}"
          submit-label="Übernehmen"
          @submit="updateLastHotspot"
          :actions="false"
          :disabled="!loaded"
          v-if="!isMobile"
          v-auto-animate>
        <h2>Hotspot Einstellungen</h2>
        <p style="max-width: 225px">Direkt nach dem hinzufügen (<kbd>Alt + Klick auf den Planeten</kbd>) hier die Einstellungen vornehmen.<br>Andernfalls können die Einstellungen nicht mehr geändert werden.</p>
        <FormKit
            type="text"
            id="hotspot_name_input"
            name="name"
            label="Name"
            aria-autocomplete="none"
            autocomplete="off"
            spellcheck="true"
            validation="required|length:3,50"
            v-model="lastHotspot.name"
            @focus="$event.target.select();hotspot_settings_focused=true"
            @blur="hotspot_settings_focused=false"
            @change="updateLastHotspot"
            @keyup="updateLastHotspot"/>
        <FormKit
            type="text"
            name="description"
            label="Beschreibung"
            aria-autocomplete="none"
            autocomplete="off"
            spellcheck="true"
            v-model="lastHotspot.description"
            @focus="hotspot_settings_focused=true"
            @blur="hotspot_settings_focused=false"
            @change="updateLastHotspot"
            @keyup="updateLastHotspot"/>
        <FormKit
          type="select"
          name="type"
          label="Typ"
          :options="{location: 'Ort', marker: 'Markierung'}"
          v-model="lastHotspot.type"
          @change="updateLastHotspot"/>
        <FormKit
            type="select"
            name="level"
            label="Ebene"
            :options="{1: 'Ebene 1', 2: 'Ebene 2', 3: 'Ebene 3', 4: 'Ebene 4', 5: 'Ebene 5'}"
            v-if="lastHotspot.type === 'location'"
            v-model="lastHotspot.level"
            @change="updateLastHotspot"/>
      <FormKit
        type="select"
        name="classification"
        label="Klassifizierung"
        :options="classifications"
        v-model="lastHotspot.classification"
        @change="updateLastHotspot"
        multiple/>
      <FormKit
        type="checkbox"
        name="action"
        label="Aktion"
        help="Nur für besondere Hotspots"
        v-model="lastHotspot.action"
        @change="updateLastHotspot"/>
      </FormKit>
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
      return this.$store.state.client.isMobile
    }
  },
  mounted() {
    console.log("HomeView mounted")
    // convert dict to array and add uuid and key as property
    this.planets = Object.keys(planets).map(key => {
      return {...planets[key], "key": key, uuid: this.$globals.genUUID()}
    })
    this.sortPlanets()
  },
  methods: {
    sortPlanets() {
      // sort by orderPriority plus the active planet to the top
      this.planets.sort((a, b) => {
        if (a.key === this.currentPlanet.key) {
          return -1
        } else if (b.key === this.currentPlanet.key) {
          return 1
        } else {
          return b.orderPriority - a.orderPriority
        }
      })
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
      this.sortPlanets()
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
/* This keeps child nodes hidden while the element loads */
:not(:defined) > * {
  display: none;
}
</style>
<style>
/*this style will be applied global bacause otherwise it won't work with FormKit*/
#hotspot-settings{
  position: absolute;
  top: 0;
  right: 5px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(250, 250, 250, 0.4);
  border-radius: 5px;
}
.hidden {
  display: none !important;
}
.formkit-form#hotspot-settings > .formkit-outer {
  width: 88%;
}
</style>
