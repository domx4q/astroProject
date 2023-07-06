<template>
  <model-viewer
      id="planet"
      :exposure="theme === 'dark' ? 0.5 : 1"
      :orbit-sensitivity="defaultOrbitSensi"
      :poster="isProduction ? 'img/jupiter_poster.png' : ''"
      :src="modelSrc"
      alt="Es ist ein Fehler beim Laden des 3D-Modells aufgetreten."
      ar
      auto-rotate
      auto-rotate-delay="2000"
      camera-controls
      camera-orbit="90deg"
      disable-pan
      environment-image="neutral"
      interaction-prompt="none"

      shadow-intensity="1"

      style="width: 100%; height: 100%"
      touch-action="none"

      @error="errorHandler"
      @load="planetLoaded"
      @progress="progress = $event.detail.totalProgress"
      @click.alt="addHotspot"
      @keyup.ctrl.space.exact="auto_rotate = !auto_rotate"
      @keyup.shift.ctrl.space.exact="enable_pan = !enable_pan"
      v-on:camera-change="updateZoom">
    <div id="progress-bar" slot="progress-bar" :class="{hide: hideProgressBar}"
         :style="{width: ourProgress + '%'}"></div>
    <div class="controls">
      <div id="buttons" class="formCollection">
        <Transition enter-active-class="animate__animated animate__fadeInLeftBig" mode="in-out">
          <div v-if="showOverlays" id="settings" class="wrapper" style="margin-top: 10px; margin-left: 10px">
            <div id="settingsCollapse" class="iconHolder" @click="settingsCollapsed = !settingsCollapsed">
              <Icon class="collapseIcon" icon="ph:caret-double-left-bold"/>
            </div>
            <div class="flex-column content">
              <FormKit
                  :disabled="!loaded"
                  type="group">
                <FormKit v-model="textureInputForm" :disabled="!loaded" type="group">
                  <!--              needed because otherwise the file input can't be cleared-->
                  <FormKit id="textureInput" :accept="allowedFileTypes" help="Textur oder Hotspot-Datei auswählen" label="Datei auswählen"
                           type="file"
                           @change="onFileChange"/>
                </FormKit>
                <FormKit v-if="!isMobile" :disabled="lastHotspot.name === ''" label="Hotspots speichern" type="button"
                         @click="downloadHotspots"/>
                <FormKit v-model="auto_rotate" :help="!isMobile ? 'Tastenkombination: Strg + Leertaste' : ''"
                         label="Automatische Rotation" type="checkbox"/>
                <FormKit v-model="enable_pan" :help="!isMobile ? 'Tastenkombination: Strg + Shift + Leertaste' : ''"
                         label="Verschieben aktivieren" type="checkbox"/>
              </FormKit>
              <hr>
              <ThemeSwitch/>

            </div>
          </div>
        </Transition>

      </div>
      <Transition v-if="(screenSize.height > (((totalPlanetCount*30)+10)+380)) && !isMobile"
                  enter-active-class="animate__animated animate__fadeInLeftBig"
                  mode="in-out">
        <ul v-if="showOverlays" id="planets" v-auto-animate>
          <template v-for="planet in planets" :key="planet.uuid"> <!--skipcq: JS-V001-->
            <li v-if="planet.enabled"
                :class="{active: planet.uuid === currentPlanet.uuid, disabled: !loaded, parent: planet.moons.length > 0}"
                class="planet-selector">
              <span @click="changePlanet(planet)">{{ planet.name }}</span> <span
                class="resolution_badge">{{ planet.resolution }}k</span>
            </li>
            <template v-for="(moon, index) in planet.moons" :key="moon.uuid"> <!--skipcq: JS-V001-->
              <li v-if="moon.enabled && moon.uuid !== currentPlanet.uuid" :class="{active: moon.uuid === currentPlanet.uuid, disabled: !loaded,
                      parentActive: planet.uuid === currentPlanet.uuid, last: index === planet.moons.length - 1}"
                  class="planet-selector moon">
                <span @click="changePlanet(moon)">{{ moon.name }}</span> <span
                  class="resolution_badge">{{ moon.resolution }}k</span>
              </li>
            </template>
          </template>
        </ul>
      </Transition>
      <teleport v-else-if="showOverlaysSlow" to="#buttons .flex-column">
        <hr>
        <FormKit
            :options="convertPlanetsFormKit(planets)"
            label="Planet auswählen"
            type="select"
            @change="changePlanet(SOLAR_SYSTEM.findPlanet($event.target.value))"
        />
      </teleport>

      <Transition
          enter-active-class="animate__animated animate__fadeInRight"
          leave-active-class="animate__animated animate__fadeOutRight">
        <div
            v-if="!(hotspots.length === 0 || !loaded || (lastHotspot.position.x === 0 && lastHotspot.position.y === 0 && lastHotspot.position.z === 0)) && sidePanelType === 'hotspotSettings'"
            class="wrapper">
          <FormKit v-if="!isMobile" id="hotspot-settings" v-auto-animate :actions="false"
                   :disabled="!loaded" form-class="formCollection" submit-label="Übernehmen" type="form"
                   @submit="updateLastHotspot();blur()">
            <h2>Hotspot Einstellungen</h2>
            <p v-if="windowHeight >= 913" style="max-width: 225px">
              Direkt nach dem hinzufügen (<kbd>Alt + Klick auf den Planeten</kbd>) hier die Einstellungen vornehmen.<br>
              Um einen Hotspot zu bearbeiten, einfach (mit gedrückter <kbd>Strg</kbd>-Taste) auf den Hotspot klicken.
            </p>
            <FormKit id="hotspot_name_input" v-model="lastHotspot.name" aria-autocomplete="none" autocomplete="off"
                     label="Name"
                     name="name" spellcheck="true" type="text" validation="required|length:3,50"
                     @blur="hotspot_settings_focused=false"
                     @change="updateLastHotspot"
                     @focus="$event.target.select();hotspot_settings_focused=true" @keyup="updateLastHotspot()"
                     @keyup.enter="updateLastHotspot();blur()"/>
            <FormKit v-model="lastHotspot.description" aria-autocomplete="none" autocomplete="off" label="Beschreibung"
                     name="description" spellcheck="true" type="text"
                     @blur="hotspot_settings_focused=false" @change="updateLastHotspot"
                     @focus="hotspot_settings_focused=true" @keyup="updateLastHotspot"
                     @keyup.enter="updateLastHotspot();blur()"/>
            <FormKit v-model="lastHotspot.type" :options="{location: 'Ort', marker: 'Markierung'}" label="Typ"
                     name="type"
                     type="select" @change="updateLastHotspot"/>
            <FormKit v-if="lastHotspot.type === 'location'" v-model="lastHotspot.level"
                     :options="{1: 'Ebene 1', 2: 'Ebene 2', 3: 'Ebene 3', 4: 'Ebene 4', 5: 'Ebene 5'}"
                     label="Ebene"
                     name="level" type="select" @change="updateLastHotspot"/>

            <FormKit v-model="lastHotspot.classification" :disabled="!loaded" :options="classifications"
                     help="Strg + Klick zur Mehrfachauswahl"
                     label="Klassifizierung" name="classification" type="taglist"
                     @change="updateLastHotspot"/>

            <FormKit v-model="lastHotspot.action" help="Nur für besondere Hotspots" label="Aktion" name="action"
                     type="checkbox" @change="updateLastHotspot"/>
            <FormKit id="deleteButton" :disabled="!loaded" label="Löschen" prefix-icon="trash" type="button"
                     @click="deleteCurrentHotspot"/>
            <hr>
            <FormKit :disabled="!loaded" label="Panel schließen" type="button" @click="sidePanelType = 'planetInfo'"/>
          </FormKit>
        </div>
      </Transition>
      <Transition v-if="!isMobile" enter-active-class="animate__animated animate__fadeInRightBig"
                  leave-active-class="animate__animated animate__fadeOutRightBig">
        <div v-if="sidePanelType === 'planetInfo' && showOverlays" id="planetInfo" class="wrapper">
          <div class="iconHolder" @click="planetInfoCollapsed = !planetInfoCollapsed">
            <Icon class="collapseIcon" icon="ph:caret-double-right-bold"/>
          </div>
          <div class="content">
            <span v-if="currentPlanet.mag !== 1.00001"
                  class="mag_badge"
                  title="Magnitude (scheinbare Helligkeit)">Mag: {{ round(currentPlanet.mag, 2) }}</span>
            <h2 :title="planetInfo.nameTooltip" class="name">{{ planetInfo.name }}</h2>
            <div class="description">
              <Dropdown :onlyShowTitleOnClose="true" :open-override="openPlanetInfoDropdown === 'none'"
                        title="Beschreibung"
                        @close="openPlanetInfoDropdown = 'none'" @open="openPlanetInfoDropdown = 'none'">
                <template v-if="connectionAlive">
                  <p v-html="planetDescription"/><br> <!-- // skipcq: JS-0693 -->
                  <p v-if="planetInfo.link">Quelle: <a :href="planetInfo.link" rel="noopener noreferrer"
                                                       target="_blank">{{ planetInfo.linkText }}</a></p>
                </template>
                <template v-else>
                  <p style="color: red">Keine Verbindung zum Internet</p>
                </template>
              </Dropdown>
            </div>
            <template v-if="planetInfo.detailed !== undefined && Object.keys(planetInfo.detailed).length > 0">
              <hr>
              <div v-for="(value, key) in planetInfo.detailed" :key="key" class="dropdowns">
                <Dropdown :open-override="openPlanetInfoDropdown === key" :title="key"
                          @close="openPlanetInfoDropdown = 'none'" @open="openPlanetInfoDropdown = key">
                  <p v-html="formatJSON(value, planetInfo.newLineDot)"/> <!-- // skipcq: JS-0693 -->
                </Dropdown>
              </div>
            </template>
            <Dropdown :open-override="openPlanetInfoDropdown === 'appinfo'" italic title="App-Info"
                      @close="openPlanetInfoDropdown = 'none'" @open="openPlanetInfoDropdown = 'appinfo'">
              <p>Die App wurde von <u>Dominik Fuchs</u> entwickelt und ist Open Source. Der Quellcode ist auf <a
                  href="https://github.com/domx4q/astroProject" rel="noopener noreferrer" target="_blank">GitHub</a>
                verfügbar.</p>
            </Dropdown>
          </div>
        </div>
      </Transition>
    </div>

    <!-- region hotspots-->
    <button v-for="hotspot in hotspots" :key="hotspot.uuid"
            :slot="'hotspot-' + hotspot.type + '-' + hotspot.uuid" :class="[hotspot.class, {action: hotspot.action}]"
            :data-normal="hotspot.normal.modelString"
            :data-position="hotspot.position.modelString"
            class="hotspot" data-visibility-attribute="visible"
            @click.ctrl="modifyHotspot(hotspot)">
      <span class="hotspot-annotation">{{ hotspot.name }}</span>
    </button>
    <!-- endregion hotspots-->
  </model-viewer>
  <div class="messages">
    <div v-auto-animate class="wrapper">
      <Message v-for="message in messages" :key="message.uuid" :class="message.class" :message="message.text"
               :timeout="message.timeout"
               :title="message.title"
               @close="removeMessage(message)"/>
    </div>
  </div>

  <Transition appear enter-active-class="animate__animated animate__fadeInRightBig"
              leave-active-class="animate__animated animate__fadeOutRightBig">
    <div id="textureCopyright" class="badge"> Copyright: {{ currentPlanet.copyright }}</div>
  </Transition>
</template>

<script>
// @ is an alias to /src
import "animate.css";

import {EMPTY_HOTSPOT, Hotspot, SOLAR_SYSTEM, ZERO_VECTOR} from "@/extra/HomeClasses";

import defaults from "@/mixins/defaults";
import message from "@/components/message";
import dropdown from "@/components/dropdown";
import themeSwitch from "@/components/themeSwitch";

// import planets from "@/assets/data/planets.json"
import annotations from "@/assets/data/annotations.json"
import axios from "axios";

import("@google/model-viewer")
export default {
  name: "HomeView",
  components: {
    Message: message,
    Dropdown: dropdown,
    ThemeSwitch: themeSwitch
  },
  mixins: [defaults],
  data() {
    return {
      devDefaultPlanet: "moon",
      modelSrc: require("@/assets/models/sphere.glb").default,
      defaultOrbitSensi: 0.8,
      allowedFileTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp", "application/json", "text/plain"],
      zoomFactor: 1,
      accent_color: "hsl(197,85%,55%)",
      auto_rotate: true,
      enable_pan: false,

      currentPlanet: SOLAR_SYSTEM.empty,
      lastPlanetChild: false,
      defaultPlanet: null,
      totalPlanetCount: 0,
      planet: null,
      planetType: "normal",
      modelDefaultTexture: "jupiter",
      planets: null,
      loaded: false,
      showOverlays: false,
      showOverlaysSlow: false,
      progress: 1,
      hideProgressBar: true,
      textureLoadingProgress: 1, // every progress has to be 1 on init, because always the smallest progress is used
      wikiLoadingProgress: 1,
      currentTexture: null,
      sidePanelType: "planetInfo",
      planetInfoCollapsed: false,
      settingsCollapsed: false,
      settingsInitWidth: 0,
      ctrlDown: false,
      openPlanetInfoDropdown: "none",
      lastFieldOfView: 0,
      hotspot_settings_focused: false,
      lastHotspot: EMPTY_HOTSPOT,
      hotspots: [],
      messages: [],
      textureInputForm: null,

      SOLAR_SYSTEM: SOLAR_SYSTEM,
    }
  },
  computed: {
    classifications() {
      return annotations.data.classifications
    },
    ourProgress() {
      const valueList = [this.progress,
        this.textureLoadingProgress,
        this.wikiLoadingProgress,
        1
      ]
      return Math.min(...valueList) * 100
    },
    planetInfo() {
      if (this.currentPlanet === undefined || this.currentPlanet === null || this.currentPlanet === SOLAR_SYSTEM.empty || this.currentPlanet.key === "empty") {
        return {
          name: "Kein Planet ausgewählt",
          description: "Wähle einen Planeten aus, um mehr Informationen zu erhalten.",

          newLineDot: false
        }
      } else if (this.currentPlanet.info === undefined) {
        return {
          name: this.currentPlanet.name,
          description: "Keine Informationen verfügbar.",

          newLineDot: false
        }
      }
      return this.currentPlanet.info
    },
    planetDescription() {
      let description = this.planetInfo.description
      if (this.planetInfo.autoFetch) {
        const url = this.planetInfo.link
        const title = url.substring(url.lastIndexOf("/") + 1)
        const wikiUrl = "https://de.wikipedia.org/api/rest_v1/page/summary/" + title
        axios.get(wikiUrl, {
          onDownloadProgress: (progressEvent) => {
            this.wikiLoadingProgress = progressEvent.loaded / progressEvent.total
          }
        })
            .then(response => {
              description = response.data.extract_html
              if (description.includes("<p>")) {
                description = description.substring(description.indexOf("<p>") + 3)
                description = description.substring(0, description.indexOf("</p>"))
              }
              this.planetInfo.description = description
            })
      }
      return this.formatJSON(description, this.planetInfo.newLineDot)
    },
    windowHeight() {
      return window.innerHeight
    },
  },
  created() {
    if (this.isProduction) {
      this.defaultPlanet = this.modelDefaultTexture
    } else {
      this.defaultPlanet = this.devDefaultPlanet
    }
  },
  mounted() {
    const keyDown = (e) => {
      if (e.key === "Control") {
        this.ctrlDown = true
      }
    }
    const keyUp = (e) => {
      if (e.key === "Control") {
        this.ctrlDown = false
      }
    }
    window.addEventListener("keydown", keyDown)
    window.addEventListener("keyup", keyUp)

    this.planets = SOLAR_SYSTEM.asArray
    this.sortPlanets()
    this.addMessage("Willkommen!", "Willkommen auf der Planeten-App")

    if (this.isMobile) {
      // only allow images on mobile so camera can be used in app
      this.allowedFileTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"]
    }

    setTimeout(() => {
      this.showOverlays = true
    }, 220)
    setTimeout(() => {
      this.showOverlaysSlow = true
    }, 340)

    this.totalPlanetCount = this.getTotalPlanetCount()
  },
  methods: {
    errorHandler(error) {
      console.error(error)
      let messageContent = "Ein Fehler ist aufgetreten."

      switch (error.detail.type) {
        case "loadfailure":
        case "parseerror":
          messageContent = "Das Modell konnte nicht geladen werden."
          break
        case "networkerror":
          messageContent = "Das Modell konnte nicht geladen werden. Bitte überprüfe deine Internetverbindung."
          break
      }
      const defaultAppend = "Das neu laden der Seite könnte helfen. Andernfalls versuche es später noch einmal."
      this.addMessage("Fehler", `${messageContent} ${defaultAppend}`, 10000, "error")
    },
    removeMessage(message) {
      this.messages = this.messages.filter(m => m.uuid !== message.uuid)
    },
    addMessage(title = null, message, timeout = -1, pClass = "info") {
      this.messages.push({uuid: this.genUUID(), text: message, title: title, timeout: timeout, class: pClass})
    },
    blur() {
      document.activeElement.blur()
    },
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
      this.textureLoadingProgress = 0
      const material = this.planet.model.materials[0]
      this.textureLoadingProgress = Math.random() * 0.2 + 0.1
      const increaser = () => {
        this.textureLoadingProgress += 0.006
      }
      const a = setInterval(increaser, 200)

      const texture = await this.planet.createTexture(image)
      this.textureLoadingProgress = Math.max(Math.random() * 0.25 + 0.4, this.textureLoadingProgress)
      clearInterval(a)
      const b = setInterval(increaser, 200)
      material.pbrMetallicRoughness["baseColorTexture"].setTexture(texture)
      this.textureLoadingProgress = 1
      clearInterval(b)
    },
    planetLoaded() {
      console.log("planet loaded", new Date().toLocaleTimeString())
      this.planet = document.querySelector("model-viewer#planet")
      this.loaded = true
    },
    onFileChange(e) {
      try {
        const file = e.target.files[0]
        if (file && this.allowedFileTypes.includes(file.type)) {
          if (file.type === "application/json" || file.type === "text/plain") {
            const fileReader = new FileReader()
            let json;
            fileReader.readAsText(file, "UTF-8")
            fileReader.onload = () => {
              json = JSON.parse(fileReader.result)
              this.hotspots = json.map(hotspot => {
                const temp = new Hotspot("", ZERO_VECTOR, ZERO_VECTOR)
                temp.fromSaveData(hotspot)
                return temp
              })
            }
          } else {
            this.currentPlanet = SOLAR_SYSTEM.empty
            this.createAndApplyTexture(URL.createObjectURL(file))
            this.hotspots = []
          }
          this.addMessage("Status", "Datei erfolgreich geladen", 3000, "success")
        }
      } catch (e) {
        this.addMessage("Fehler", "Datei konnte nicht geladen werden", 3000, "error")
      }
      this.sortPlanets()
      this.textureInputForm = {}
    },
    changePlanet(planet, force = false, firstLoad = false) {
      this.sidePanelType = "planetInfo"
      this.openPlanetInfoDropdown = "none"

      if (!this.loaded && !force) return;
      if (planet.customModel) {
        this.modelSrc = planet.customModelFile
        this.currentTexture = null
        this.planetType = "custom"
      } else {
        const texturePATH = `textures/${planet.texture}` // IMPORTANT: no trailing slash
        this.currentTexture = texturePATH
        if (this.planetType === "custom") {
          this.modelSrc = require("@/assets/models/sphere.glb").default;
          this.planetType = "normal"
          if (!(planet.key === this.modelDefaultTexture && firstLoad)) {
            setTimeout(() => {
              this.createAndApplyTexture(texturePATH)
            }, 100)
          }
        } else {
          if (!(planet.key === this.modelDefaultTexture && firstLoad)) {
            this.createAndApplyTexture(texturePATH)
          }
        }
      }
      if (this.lastPlanetChild) {
        this.planets = this.planets.filter(p => p.uuid !== this.currentPlanet.uuid)
      }
      if (planet.isChild) {
        this.planets.push(planet)

        this.lastPlanetChild = true
      } else {
        this.lastPlanetChild = false
      }
      this.currentPlanet = planet
      this.sortPlanets()

      // update hotspots
      this.hotspots = annotations.planets[this.currentPlanet.key]
      if (this.hotspots === undefined) this.hotspots = []
      this.hotspots = this.hotspots.map(hotspot => {
        const temp = new Hotspot("", ZERO_VECTOR, ZERO_VECTOR)
        temp.fromSaveData(hotspot)
        return temp
      })
    },
    updateZoom() {
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
    addHotspot(event) { // todo bug, when adding new hotspot and panel is closed, last one will be overwritten
      const condition = this.hotspots.length === 0 && (this.lastHotspot.position.x === 0 && this.lastHotspot.position.y === 0 && this.lastHotspot.position.z === 0) || this.sidePanelType !== "hotspotSettings"
      const xClick = event.offsetX;
      const yClick = event.offsetY;

      this.sidePanelType = "hotspotSettings";

      const positionAndNormal = this.planet.positionAndNormalFromPoint(xClick, yClick);
      const position = positionAndNormal.position;
      const normal = positionAndNormal.normal;

      const name = "Hotspot " + Math.floor(Math.random() * 1000)
      const hotspot = new Hotspot(name, position, normal)
      this.hotspots.push(hotspot);
      // make this one by another to keep previous settings
      hotspot.copySettings(this.lastHotspot);
      this.lastHotspot = hotspot;
      this.updateLastHotspot();

      if (condition) {
        setTimeout(() => {
          const nameInput = document.querySelector("#hotspot_name_input")
          nameInput.focus()
          setTimeout(() => {
            nameInput.select()
          }, 100)
        }, 1000)
      } else {
        const nameInput = document.querySelector("#hotspot_name_input")
        nameInput.focus()
        setTimeout(() => {
          nameInput.select()
        }, 100)
      }
    },
    modifyHotspot(hotspot) {
      if (this.sidePanelType !== "hotspotSettings") return;

      // remove old hotspot and append to the end
      this.deleteHotspot(hotspot)
      this.hotspots.push(hotspot)

      this.lastHotspot = hotspot;

      const nameInput = document.querySelector("#hotspot_name_input")
      nameInput.focus()
      setTimeout(() => {
        nameInput.select()
      }, 100)
    },
    deleteHotspot(hotspot) {
      this.hotspots = this.hotspots.filter(h => h.uuid !== hotspot.uuid)
    },
    deleteCurrentHotspot() {
      this.hotspots.pop()
      try {
        this.lastHotspot = this.hotspots[this.hotspots.length - 1];
      } catch (e) {
        this.lastHotspot = EMPTY_HOTSPOT;
      }
    },
    downloadHotspots(event) {
      let hotspots = JSON.parse(JSON.stringify(this.hotspots));
      // remove from every hotspot the uuid and the type
      hotspots = hotspots.map(hotspot => {
        delete hotspot.uuid;
        return hotspot;
      })
      // on ctrl press, only log the hotspots
      if (event.ctrlKey) {
        console.log(hotspots)
        return;
      }
      this.download("hotspots-" + this.currentPlanet.annotationsKey + ".txt", JSON.stringify(hotspots))
    },
    updateLastHotspot() {
      this.hotspots.pop();
      this.lastHotspot.renewUUID();
      this.lastHotspot.class = this.lastHotspot.type === "location" ? "location level-" + this.lastHotspot.level : this.lastHotspot.type;
      this.hotspots.push(this.lastHotspot);
    },
    convertPlanetsFormKit(planets) {
      const planetDict = {}
      planets.forEach(planet => {
        if (planet.enabled) {
          planetDict[planet.key] = planet.name
        }
        if (planet.moons.length > 0) {
          planet.moons.forEach(moon => {
            if (moon.enabled) {
              planetDict[moon.key] = `${planet.name} - ${moon.name}`
            }
          })
        }
      })
      return planetDict
    },
    getTotalPlanetCount() {
      let count = 0;
      for (let planet of Object.values(this.planets)) {
        if (planet.enabled) {
          count++;
        }
        if (planet.moons.length > 0) {
          for (let moon of planet.moons) {
            if (moon.enabled) {
              count++;
            }
          }
        }
      }
      return count;
    }
  },
  watch: {
    auto_rotate: function (newVal) {
      if (newVal) {
        this.planet.setAttribute("auto-rotate", "")
      } else {
        this.planet.removeAttribute("auto-rotate")
      }
    },
    enable_pan: function (newVal) {
      if (!newVal) {
        this.planet.setAttribute("camera-target", "0 0 0")
        this.planet.setAttribute("disable-pan", "")

        this.updateZoom()
      } else {
        this.planet.removeAttribute("disable-pan")
      }
    },
    loaded: function (newVal) {
      if (newVal) {
        this.firstLoad = true
        this.changePlanet(SOLAR_SYSTEM.findPlanet(this.defaultPlanet), true, true)
        setTimeout(() => {
          // do this manually because when set to false in data but not manually changed, then it won't update
          if (this.auto_rotate) {
            this.planet.setAttribute("auto-rotate", "")
          } else {
            this.planet.removeAttribute("auto-rotate")
          }

        }, 1000)
      }

      this.addMessage("Status", "Modell geladen", 3000, "success")
    },
    hotspot_settings_focused: function (newVal) {
      if (newVal) {
        this.planet.setAttribute("data-settings-active", "true")
      } else {
        this.planet.removeAttribute("data-settings-active")
      }
    },
    planetInfoCollapsed: function (newVal) {
      const planetInfo = document.querySelector("#planetInfo")
      const initialHeight = planetInfo.clientHeight
      if (newVal) {
        planetInfo.classList.add("collapsed") // need to be all done here because if using :class, it will be overwritten by vue
        planetInfo.style.height = `${initialHeight}px`
        setTimeout(() => {
          planetInfo.classList.add("fullyCollapsed")
        }, 400)
      } else {
        planetInfo.style.height = "auto"
        planetInfo.classList.remove("collapsed")
        planetInfo.classList.remove("fullyCollapsed")
        planetInfo.classList.add("expanding")
        setTimeout(() => {
          planetInfo.classList.remove("expanding")
        }, 400)
      }
    },
    settingsCollapsed: function (newVal) {
      const settings = document.querySelector("#settings")
      const initialHeight = settings.clientHeight
      const initialWidth = settings.clientWidth
      if (newVal) {
        this.settingsInitWidth = initialWidth
        settings.classList.add("collapsed") // need to be all done here because if using :class, it will be overwritten by vue
        settings.style.height = `${initialHeight}px`
        settings.style.width = `${initialWidth}px`
        setTimeout(() => {
          settings.classList.add("fullyCollapsed")
        }, 400)
      } else {
        settings.style.height = "auto"
        settings.style.width = this.settingsInitWidth + "px"
        settings.classList.remove("collapsed")
        settings.classList.remove("fullyCollapsed")
        settings.classList.add("expanding")
        setTimeout(() => {
          settings.classList.remove("expanding")
          settings.style.width = "auto"
        }, 400)
      }
    },
    ourProgress: function (newVal) {
      this.hideProgressBar = false
      if (newVal === 100) {
        setTimeout(() => {
          this.hideProgressBar = true
        }, 1000)
      }
      if (newVal >= 100) {
        this.ourProgress = 100
      }
    },
    ctrlDown: function (newVal) {
      if (newVal) {
        document.body.classList.add("ctrlDown")
      } else {
        document.body.classList.remove("ctrlDown")
      }
    },
  }
}
</script>
<style scoped>
#planetInfo {
  position: absolute;
  top: 8%;
  right: 10px;
  width: 350px;
  height: auto;
  z-index: 100;
  border-radius: 5px;
  /*pointer-events: none;*/
  background-color: rgba(250, 250, 250, 0.6);
  padding: 20px;
  /*box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);*/
  font-size: 1.1em;

  transition: width 0.4s ease-in-out;
}

#settings {
  /*i need to set a with, otherwise the transition is not working, but i want it to still be responsible*/
  transition: width 0.4s ease-in-out;
}

#planetInfo .iconHolder, #settingsCollapse {
  position: absolute;
  top: 10px;
  right: 2px;
  cursor: pointer;
  margin: 4px;
  width: 20px;
  height: 20px;
  z-index: 1000;

  transition: transform 0.4s ease-in-out, filter 0.2s ease-in-out;
}

#planetInfo .iconHolder:hover, #settingsCollapse:hover {
  filter: brightness(5);
}

html[data-theme="dark"] #planetInfo .iconHolder:hover, html[data-theme="dark"] #settingsCollapse:hover {
  filter: brightness(.4);
}

#planetInfo.collapsed .iconHolder, #settings.collapsed .iconHolder {
  transform: rotate(180deg);
}

#planetInfo.collapsed {
  width: 0;
  padding: 15px;
}

#settings.fullyCollapsed {
  width: 0 !important;
  padding: 5px;
}

#planetInfo .content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: normal;
  width: 350px;
  height: 100%;
  padding: 0;
  margin: 0;

  transition: opacity 0.4s ease-in-out;
}

#settings .content {
  transition: opacity 0.4s ease-in-out;
}

#planetInfo.collapsed .content, #settings.collapsed .content {
  opacity: 0;
}

#planetInfo.fullyCollapsed .content, #settings.fullyCollapsed .content {
  display: none;
}

html[data-theme="dark"] #planetInfo {
  background-color: rgba(101, 101, 101, 0.6);
}

#planetInfo h2.name {
  align-self: center;
  margin: 0;
  padding: 0;
}

#planetInfo p {
  margin: 0;
  padding: 0;
}

#planetInfo .description a {
  --normalColor: v-bind(accent_color);
  --clickColor: #bb1920;

  color: var(--normalColor);
  transition: color 0.14s ease-in-out, filter 0.14s ease-in-out;
}

#planetInfo .description a:hover {
  filter: brightness(.7);
}

#planetInfo .description a:active {
  color: var(--clickColor);
}

#planetInfo hr {
  width: 100%;
  margin: 5px 0;
}

#planetInfo .dropdowns {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: normal;
  width: 100%;
  overflow: auto;
}

#textureCopyright {
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 5px;
  font: 0.8em sans-serif monospace;
  color: #bebebe;
}

#buttons {
  position: absolute;
  margin: 5px;
  padding: 10px;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

#planets {
  padding-left: 20px;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 100;
}

li.planet-selector {
  list-style: none;
  padding: 5px;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 440;
  border: none;
  outline: none;

  transition: background-color 0.2s linear, color 0.2s linear;
}

li.planet-selector.moon {
  padding-left: 20px;
}

li.planet-selector.active {
  color: v-bind(accent_color);
}

li.planet-selector.disabled {
  color: darkgray;
}

li.planet-selector:first-of-type.active:not(.parent), li.planet-selector.moon.parentActive.last {
  margin-bottom: 10px;
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
  z-index: 5000;

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
  box-shadow: rgba(0, 0, 0, 0.25) 0 2px 4px;
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

body.ctrlDown .hotspot, body.ctrlDown .hotspot > * {
  cursor: move;
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

.messages {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: auto;
  height: auto;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  padding: 10px;
  box-sizing: border-box;
}

.messages > .wrapper > * {
  margin: 5px 0;
}

.messages > .wrapper > .message:first-of-type {
  /*  hide it but dont use display: none, because it must be existent*/
  opacity: 0;
  pointer-events: none;
  height: 50px;
}

.resolution_badge {
  border: 2px solid var(--text-color);
  padding: 1px 3px;
  border-radius: 3px;
  color: var(--text-color);
  text-transform: uppercase;
}

.mag_badge {
  position: absolute;
  top: 20px;
  left: 5px;

  border: 2px solid var(--text-color);
  padding: 1px 3px;
  border-radius: 3px;
  color: var(--text-color);
}
</style>
<style>
/*this style will be applied global bacause otherwise it won't work with FormKit*/
#hotspot-settings {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 300px;
}

.formCollection {
  background-color: rgba(250, 250, 250, 0.4);
  border-radius: 5px;
}

html[data-theme="dark"] .formCollection {
  background-color: rgba(0, 0, 0, 0.4);
}

.hidden {
  display: none !important;
}

.formkit-form#hotspot-settings > .formkit-outer {
  width: 88%;
}

.disabled, :disabled {
  cursor: not-allowed !important;
  touch-action: none;
  -ms-touch-action: none;
}

/*region animations*/
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.animate__animated.animate__fadeInRight {
  --animate-delay: 0s;
}

/*endregion animations*/
.close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  cursor: pointer;
  border: 0;
  border-top-right-radius: 5px;
}

.close:hover {
  background-color: #ff0000;
}

#progress-bar, model-viewer::part(default-progress-bar) {
  background-color: #6c8bda;
  border-radius: 10px; /*might be look smoother*/
}

#progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  z-index: 5000;
  /*surprisingly a longer duration on the width is looking really good*/
  transition: opacity 0.5s ease, width 0.7s ease;
}

#progress-bar.hide {
  opacity: 0;
  width: 0;

  transition: opacity 0.3s ease, width 0.7s ease;
}

#planetInfo .accent {
  color: #1353d7;
}

#planetInfo .highlight {
  font-size: 115%;
  font-family: 'Roboto Mono', monospace;
  border: 1px dashed #1353d7;
  border-radius: 5px;
  background: rgba(19, 83, 215, 0.2);
  color: #4d84fc;
}

#deleteButton {
  background-color: var(--fk-color-danger);
}
</style>
