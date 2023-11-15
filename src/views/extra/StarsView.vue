<template>
  <div
    id="stars"
    :class="{ transition: enableTransition }"
    @mousedown="handleMouseDown"
    @mouseleave="handleMouseUp"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
  >
    <ThemeSwitch only-logic />
    <!--otherwise, only if the settings are expanded, the Theme will work-->
    <Teleport to="#app">
      <CollapsableContainer
        ref="controls"
        id="controls"
        use-pulse
        :approximate-content-height="652"
        :use-as-normal-container="showFullSidePanel"
      >
        <Details
          title="Zeit / Datum"
          :default_open="detailsConfig.Zeit"
          :negative-margin="30"
          @toggle="toggleDetails('Zeit')"
        >
          <FormKit
            label="Aktuelle Zeit"
            title="Setzt die Sternenkarte auf die aktuelle Zeit"
            type="button"
            @click="setCurrent"
          />
          <FormKit
            label="Aktuell halten"
            title="Hält die Sternenkarte auf der aktuellen Zeit, somit läuft die Karte mit."
            type="checkbox"
            v-model="keepCurrent"
          />

          <Details
            :default_open="detailsConfig.Zeitpunkt"
            title="Zeitpunkt"
            @toggle="toggleDetails('Zeitpunkt')"
          >
            <FormKit v-model="time" :label="`Zeit (${timezone})`" type="time" />
            <div id="mozContainer" title="Mittlere Ortszeit">
              <span>MOZ:</span> <b>{{ mozTime }}</b>
            </div>
            <FormKit v-model="date" label="Datum" type="date" />
          </Details>
        </Details>
        <Details
          title="Ausrichtung"
          :default_open="detailsConfig.Ausrichtung"
          @toggle="toggleDetails('Ausrichtung')"
        >
          <FormKit
            v-model="orientation"
            :options="[
              { value: 'none', label: 'Keine' },
              { value: 'N', label: 'Norden' },
              { value: 'S', label: 'Süden' },
              { value: 'E', label: 'Osten' },
              { value: 'W', label: 'Westen' },
            ]"
            label="Himmelsrichtung"
            type="select"
          />
          <FormKit
            v-model="orientationLocked"
            label="Rotation sperren"
            type="checkbox"
          />
        </Details>
        <Details
          title="Einstellungen"
          :default_open="detailsConfig.Einstellungen"
          @toggle="toggleDetails('Einstellungen')"
        >
          <FormKit
            v-model="showRektaszension"
            label="Rektaszension einblenden"
            type="checkbox"
          />
          <FormKit
            v-model="showDeklination"
            label="Deklinationszeiger einblenden"
            type="checkbox"
          />
          <FormKit
            v-model="fileInput"
            accept="image/*"
            help="Neue Sternkarte hochladen (1000x1000px)"
            label="Discs"
            type="file"
            @change="uploadDiscs"
          />
          <FormKit
            type="slider"
            label="Animations Geschwindigkeit"
            v-model="transitionSpeed"
            :min="0.1"
            :max="5"
            :step="0.1"
          />
          <ThemeSwitch />
        </Details>
        <Details
          :default_open="detailsConfig.Informationen"
          title="Informationen"
          @toggle="toggleDetails('Informationen')"
        >
          <Details
            :default_open="detailsConfig.Anleitung"
            title="Anleitung"
            @toggle="toggleDetails('Anleitung')"
          >
            Um die Karte zu drehen, halten Sie einfach die Karte an einer Stelle
            fest und ziehen Sie diese.<br />
            Um die entsprechenden Ebenen zu kontrollieren, finden sie hier eine
            Auflistung an Tasten pro Ebene. Diese Taste vor dem drehen bis zum
            Ende gedrückt halten.<br />
            <table id="controlTable">
              <tr>
                <td>Innen (Datum)</td>
                <td><i>Keine</i></td>
              </tr>
              <tr>
                <td>Außen (Zeit)</td>
                <td><kbd>Strg</kbd></td>
              </tr>
              <tr>
                <td>Deklinationszeiger</td>
                <td><kbd>Alt</kbd></td>
              </tr>
            </table>
          </Details>
          <Details
            :default_open="detailsConfig.Author"
            title="Autor"
            @toggle="toggleDetails('Author')"
          >
            Diese Anwendung wurde von
            <u>
              <nobr>Dominik Fuchs</nobr>
            </u>
            entwickelt.<br />
            Für weitere Informationen besuchen Sie bitte
            <a
              href="https://github.com/domx4q/astroProject"
              rel="noopener noreferrer"
              target="_blank"
              >GitHub</a
            >
          </Details>
          <Details
            :default_open="detailsConfig.Grundlagen"
            title="Grundlagen"
            @toggle="toggleDetails('Grundlagen')"
          >
            Grundlage der Sternkarte von
            <u>
              <span class="nowrap">Dipl.-Phys.</span>
              <span class="nowrap">Torsten Rahn</span> </u
            >, mit freundlicher Genehmigung
          </Details>
        </Details>
      </CollapsableContainer>
    </Teleport>

    <Teleport to="#app">
      <CollapsableContainer
        id="placePlanets"
        ref="placePlanets"
        :approximate-content-height="440"
        disable-filler
        mirror
      >
        <Details
          :default_open="detailsConfig.pl_Benutzung"
          title="Benutzung"
          @toggle="toggleDetails('pl_Benutzung')"
        >
          <div class="warn" v-if="!isFirefox">
            <b>Warnung:</b> Sie befinden sich momentan nicht im Firefox. Diese
            Funktion klappt im <u class="nowrap">Mozilla Firefox</u> am besten.
            In anderen Browsern kann es zu Problemen kommen. Wodurch die
            Funktionen nicht oder nur eingeschränkt vorhanden sind.
          </div>
          Über dieses Menü, können Planeten auf der Karte platziert werden.<br
            style="margin-bottom: 3px"
          />Die unten dargestellten Planeten, können durch einfaches
          <b>ziehen</b>, auf der Karte angebracht werden.<br
            style="margin-bottom: 3px"
          />Um einen Planeten wieder zu <b>löschen</b>, reicht ein
          <b>doppelklick</b> auf den Planeten (im unteren Menü).
        </Details>
        <Details
          :default_open="detailsConfig.pl_Planeten"
          title="Planeten"
          @toggle="toggleDetails('pl_Planeten')"
        >
          <div id="planetWrapper">
            <div id="planetGrid">
              <Planet
                v-for="planet in planets"
                :key="planet.id"
                :alt-text="planet.altText"
                :img-src="planet.src"
                :item-id="planet.id"
                :placed="planet.placed"
                :inner-disc-rotation="innerRotation"
                :entire-rotation="entireRotation"
                @dragend="planetDragEnd"
                @dragstart="planetDragStart"
                @remove="planet.placed = false"
              />
            </div>
            <button
              type="reset"
              @click="removeAllPlanets"
              id="removeAllPlanets"
            >
              Alle löschen
            </button>
          </div>
        </Details>
      </CollapsableContainer>
    </Teleport>

    <Teleport to="#app">
      <div
        v-if="placingPlanet"
        id="dropContainer"
        class="dropZone"
        :style="dropZoneStyle"
        @drop="dropPlanet"
        @dragover.prevent
        @dragenter.prevent
      />
    </Teleport>

    <div id="entireDisc" ref="entireDisc" :style="entireDiscStyle">
      <div id="marker" ref="marker" />
      <div id="outerDisc" :style="outerDiscStyle">
        <img
          ref="outerDisc"
          alt="Outer Disc"
          src="@/assets/extra/images/sternenscheibe_outer.png"
        />
      </div>
      <div id="innerDisc" :style="innerDiscStyle">
        <div id="planetHolder">
          <Planet
            v-for="planet in placedPlanets"
            :key="planet.id"
            :alt-text="planet.altText"
            :img-src="planet.src"
            :item-id="planet.id"
            :placed="true"
            :position="planet.position"
            :inner-disc-rotation="innerRotation"
            :entire-rotation="entireRotation"
          />
        </div>
        <img
          ref="innerDisc"
          alt="Inner Disc"
          src="@/assets/extra/images/sternenscheibe_inner.png"
        />
        <div
          id="rektaszensionOffset"
          :style="rektaszensionOffsetStyle"
          v-if="showRektaszension"
        >
          <img
            ref="rektaszension"
            id="rektaszension"
            src="@/assets/extra/images/sternenscheibe_rektaszension.png"
            alt="Rektaszension"
          />
        </div>
      </div>
    </div>
    <div
      id="deklination"
      ref="deklination"
      :style="deklinationStyle"
      v-if="showDeklination"
    >
      <img
        ref="deklinationDisc"
        alt="Deklination"
        src="@/assets/extra/images/deklination.png"
      />
    </div>
  </div>
</template>

<script>
import ThemeSwitch from "@/components/themeSwitch.vue";
import Details from "@/components/details.vue";
import defaults from "@/mixins/defaults";
import CollapsableContainer from "@/components/collapsableContainer.vue";
import StarDiscPlanet from "@/components/StarDiscPlanet.vue";
import StarsExtra from "@/mixins/StarsExtra";

function createDateAsUTC(date, offset = 0) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours() - offset,
      date.getMinutes(),
      date.getSeconds(),
    ),
  );
}

export default {
  name: "StarsView",
  mixins: [defaults, StarsExtra],
  components: {
    Planet: StarDiscPlanet,
    CollapsableContainer,
    ThemeSwitch,
    Details,
  },
  data() {
    return {
      keepCurrent: false,
      placingPlanet: false,

      innerRotation: 0,
      outerRotation: 0,
      entireRotation: 0,
      deklinationRotation: 0,
      finalRotation: {
        inner: 0,
        outer: 0,
        entire: 0,
        deklination: 0,
      },
      rektaszensionOffset: -99.8, // 18:46 Uhr (ca.)

      date: "2023-01-01",
      time: "00:00",
      timezone: "MEZ",
      orientation: "none",
      orientationLocked: false,
      endPosition: {
        x: 0,
        y: 0,
      },
      enableTransitionDefault: true,
      enableTransition: true,
      transitionSpeed: 1,
      showRektaszension: false,
      showDeklination: false,

      fileInput: null,

      detailsConfig: {
        Zeit: true,
        Zeitpunkt: false,
        Ausrichtung: false,
        Einstellungen: false,
        Informationen: true,
        Anleitung: true,
        Author: false,
        Grundlagen: false,

        pl_Benutzung: true,
        pl_Planeten: false,
      },
    };
  },
  mounted() {
    // noinspection RedundantConditionalExpressionJS
    this.enableTransition = this.enableTransitionDefault ? true : false; // to suppress reactivity

    this.handleResize();
    window.addEventListener("resize", this.handleResize);
    this.normalizeAngles();
    this.setCurrent();

    setInterval(() => {
      if (this.keepCurrent) {
        this.setCurrent();
      }
    }, 1000);
  },
  methods: {
    toggleDetails(name) {
      this.detailsConfig[name] = !this.detailsConfig[name];
    },

    setCurrent() {
      this.date = this.convertDate(new Date());

      // use utc+1 time
      const MEZ_TIME = createDateAsUTC(new Date(), 1);
      const LOCAL_TIME = new Date();
      this.time = LOCAL_TIME.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
      });
      if (LOCAL_TIME - MEZ_TIME === 0) {
        this.timezone = "MEZ";
      } else {
        this.timezone = "MESZ";
      }

      this.innerRotation = this.dateRotation;
      this.outerRotation = this.timeRotation;
    },
    setTime() {
      this.outerRotation = this.timeRotation;
    },
    setDate() {
      this.innerRotation = this.dateRotation;
    },
    setOrientation() {
      switch (this.orientation) {
        case "S":
          this.entireRotation = 0 - this.outerRotation;
          break;
        case "W":
          this.entireRotation = 90 - this.outerRotation;
          break;
        case "N":
          this.entireRotation = 180 - this.outerRotation;
          break;
        case "E":
          this.entireRotation = 270 - this.outerRotation;
          break;
      }
    },

    convertDate(date) {
      return date.toISOString().slice(0, 10); // format: YYYY-MM-DD not YYYY-M-D
    },

    getNearestDegree(current, target) {
      return target % 360;
      // for the previous implementation, see commit 8169c73dd7fedd0b38f9d928ef7efdcf24d195a6
    },
    uploadDiscs(event) {
      const files = event.target.files;
      if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          let key = "innerDisc";
          let userInput = prompt(
            "Welche Scheibe soll ersetzt werden? (inner/outer)",
            "inner",
          );
          switch (userInput) {
            case "inner": {
              key = "innerDisc";
              break;
            }
            case "outer": {
              key = "outerDisc";
              break;
            }
          }
          this.$refs[key].src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
      this.fileInput = {};
    },

    normalizeAngles() {
      if (!this.mouseDown) this.enableTransition = false;

      this.innerRotation = this.innerRotation % 360;
      this.outerRotation = this.outerRotation % 360;
      this.entireRotation = this.entireRotation % 360;

      if (!this.mouseDown) this.enableTransition = true;
    },

    // region handlers
    handleResize() {
      // skipcq: JS-0049
      if (this.checkEmpty(this.$refs["entireDisc"])) return;
      this.center = {
        x: this.$refs["entireDisc"].offsetWidth / 2,
        y: this.$refs["entireDisc"].offsetHeight / 2,
      };
      this.reevaluatePositions();
    },
    reevaluatePositions() {
      this.planets.forEach((p) => {
        if (!this.checkEmpty(p.adaptedSize)) {
          p.position = {
            x: p.position.x * (this.adaptedSize / p.adaptedSize),
            y: p.position.y * (this.adaptedSize / p.adaptedSize),
          };
          p.adaptedSize = Math.max(this.adaptedSize, 0);
        }
      });
    },
    handleMouseDown(event) {
      this.mouseDown = true;
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
      this.startPosition = {
        x: event.clientX,
        y: event.clientY,
      };
      this.lastAngleInner = this.innerRotation;
      this.lastAngleOuter = this.outerRotation;
      this.lastAngleDeklination = this.deklinationRotation;

      this.enableTransition = false;
    },
    handleMouseMove(event) {
      if (!this.mouseDown) return;

      const getDegree = (value) => {
        let x = value.x - this.center.x;
        let y = value.y - this.center.y;
        const rad = Math.atan2(y, x);
        return this.radiantToDegrees(rad);
      };

      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;

      let rotation = getDegree({ x: this.lastMouseX, y: this.lastMouseY });

      const startAngle = getDegree(this.startPosition);

      if (event.ctrlKey) {
        rotation = this.getNearestDegree(
          this.outerRotation,
          rotation - startAngle + this.lastAngleOuter,
        );
        this.outerRotation = rotation;
      } else if (event.altKey) {
        rotation = this.getNearestDegree(
          this.deklinationRotation,
          rotation - startAngle + this.lastAngleDeklination,
        );
        this.deklinationRotation = rotation;
      } else {
        rotation = this.getNearestDegree(
          this.innerRotation,
          rotation - startAngle + this.lastAngleInner,
        );
        this.innerRotation = rotation;
      }
    },
    handleMouseUp(event) {
      this.mouseDown = false;
      this.endPosition = {
        x: event.clientX,
        y: event.clientY,
      };

      // noinspection RedundantConditionalExpressionJS
      this.enableTransition = this.enableTransitionDefault ? true : false; // to suppress reactivity
    },
    // endregion
    manipulateTime(addHours = 0, addMinutes = 0, time = this.time) {
      const time_c = time.split(":");
      let hours = Number(time_c[0]) + addHours;
      let minutes = Number(time_c[1]) + addMinutes;

      // Calculate the total minutes after modification
      const totalMinutes = hours * 60 + minutes;

      // Calculate the new hours and minutes
      hours = Math.floor(totalMinutes / 60);
      minutes = totalMinutes % 60;

      // Ensure the hours and minutes are in the valid range (0-23 for hours, 0-59 for minutes)
      hours = (hours + 24) % 24;
      minutes = (minutes + 60) % 60;

      // Format the result as a string with leading zeros
      const formattedHours = String(hours).padStart(2, "0");
      const formattedMinutes = String(minutes).padStart(2, "0");

      return `${formattedHours}:${formattedMinutes}`;
    },
    planetDragStart() {
      this.placingPlanet = true;
    },
    planetDragEnd() {
      this.placingPlanet = false;
    },
    dropPlanet(event) {
      const itemID = event.dataTransfer.getData("itemID");
      const planet = this.planets.find((p) => p.id === itemID);
      if (planet) {
        planet.placed = true;
      }
      planet.position = {
        x:
          Number(event.offsetX) -
          Number(event.dataTransfer.getData("startOffsetX")),
        y:
          Number(event.offsetY) -
          Number(event.dataTransfer.getData("startOffsetY")),
      };
      // to suppress reactivity
      planet.adaptedSize = Math.max(this.adaptedSize, 0);
    },
    removeAllPlanets() {
      this.planets.forEach((p) => (p.placed = false));
    },
  },
  computed: {
    query() {
      // noinspection JSUnresolvedReference
      return this.$route.query;
    },
    scale() {
      return this.query.scale ? Number(this.query.scale) : 1;
    },

    adaptedSize() {
      const DEFAULT_SIZE = 1000;
      const widthOffset = 60;
      const heightOffset = -30; // make the region a bit larger to prevent clipping
      const screenSize = this.screenSize;
      const smallerSide = Math.min(
        screenSize.width - widthOffset,
        screenSize.height - heightOffset,
      );
      const result = Math.min(DEFAULT_SIZE, smallerSide);
      if (this.showRektaszension) {
        return result - 90; // the rektaszension disc is 90px wider than the inner disc
      }
      return result;
    },
    adaptedRektaszensionSize() {
      return this.adaptedSize * (1090 / 1000); // 1090 is the size (in px) of the rektaszension disc
    },
    adaptedSizeStyle() {
      return `${this.adaptedSize}px`;
    },
    adaptedRektaszensionSizeStyle() {
      return `${this.adaptedRektaszensionSize}px`;
    },
    showFullSidePanel() {
      return this.screenSize.width - this.adaptedSize > 480;
    },

    convertedTime() {
      return this.time.split(":").reduce(
        (acc, v, i) => {
          acc[i === 0 ? "hours" : "minutes"] = parseInt(v);
          return acc;
        },
        {
          hours: undefined,
          minutes: undefined,
        },
      );
    },
    convertedDate() {
      const a = this.date.split("-");
      const b = new Date();
      b.setFullYear(Number(a[0]));
      b.setMonth(Number(a[1]) - 1);
      b.setDate(Number(a[2]));
      return b;
    },

    innerDiscStyle() {
      return {
        transform: `rotate(${this.finalRotation.inner}deg)`,
      };
    },
    dropZoneStyle() {
      return {
        // translate middle + rotate
        transform: `translate(-50%, -50%) rotate(${
          this.finalRotation.inner + this.finalRotation.entire
        }deg)`,
      };
    },
    outerDiscStyle() {
      return {
        transform: `rotate(${this.finalRotation.outer}deg)`,
      };
    },
    entireDiscStyle() {
      return {
        transform: `rotate(${this.finalRotation.entire}deg)`,
      };
    },
    deklinationStyle() {
      return {
        transform: `rotate(${this.finalRotation.deklination}deg)`,
      };
    },
    rektaszensionOffsetStyle() {
      return {
        transform: `rotate(${this.rektaszensionOffset}deg)`,
      };
    },

    dateRotation() {
      const rotationsoffset = 171;
      const dayNumber = Math.floor(
        (new Date(this.convertedDate) -
          new Date(this.convertedDate.getFullYear(), 0, 0)) /
          (1000 * 60 * 60 * 24),
      );
      return -((dayNumber / 365) * 360 - rotationsoffset);
    },
    timeRotation() {
      const rotationsoffset = 82.5;
      let hourOffset = 0;
      if (this.timezone === "MESZ") {
        hourOffset = -1;
      }
      let hour = this.convertedTime.hours + hourOffset;
      if (hour < 0) {
        hour = 24 + hour;
      }
      const timeNumber = hour * 60 + this.convertedTime.minutes;
      return +((timeNumber / 1440) * 360 + rotationsoffset);
    },
    mezTime() {
      // Mitteleuropäische Zeit
      if (this.timezone === "MESZ") {
        // Mitteleuropäische SommerZeit
        // subtract 1 hour
        return this.manipulateTime(-1);
      }
      return this.time;
    },
    mozTime() {
      // Mittlere Ortszeit
      // subtract 32 minutes
      return this.manipulateTime(0, -32, this.mezTime);
    },
  },
  watch: {
    innerRotation(newValue, oldValue) {
      this.normalizeAngles();
      this.finalRotation.inner = this.getNearestDegree(oldValue, newValue);
    },
    outerRotation(newValue, oldValue) {
      this.normalizeAngles();
      if (this.orientationLocked) {
        this.setOrientation();
      }
      this.finalRotation.outer = this.getNearestDegree(oldValue, newValue);
    },
    entireRotation(newValue, oldValue) {
      this.normalizeAngles();
      this.finalRotation.entire = this.getNearestDegree(oldValue, newValue);
    },
    deklinationRotation(newValue, oldValue) {
      this.normalizeAngles();
      this.finalRotation.deklination = this.getNearestDegree(
        oldValue,
        newValue,
      );
    },

    time() {
      this.setTime();
    },
    date() {
      this.setDate();
    },
    orientation() {
      this.setOrientation();
    },
  },
};
</script>

<style scoped>
* {
  /*hides selection*/
  user-select: none;
}

#stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: hsl(0, 0%, 88%);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

html[data-theme="dark"] #stars {
  background: hsl(0, 0%, 10%);
}

#outerDisc {
  z-index: 3;
}

#innerDisc {
  z-index: 1;
}

#innerDisc img,
#outerDisc img,
#deklination img,
#dropContainer,
#planetHolder {
  width: v-bind(adaptedSizeStyle);
  height: v-bind(adaptedSizeStyle);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
#planetHolder {
  pointer-events: none;
  z-index: 2;

  /*place elements in the center*/
  display: flex;
  justify-content: center;
  align-items: center;
}
#rektaszension {
  width: v-bind(adaptedRektaszensionSizeStyle) !important;
  height: v-bind(adaptedRektaszensionSizeStyle) !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: transparent;
  z-index: 3;
}
#rektaszensionOffset {
  /*keep everything from parent*/
  width: 100%;
  height: 100%;
  position: absolute;
}

#entireDisc,
#deklination {
  pointer-events: none;
  width: 100%;
  height: 100%;
}

#outerDisc,
#innerDisc,
#entireDisc,
#deklination {
  width: 100%;
  height: 100%;
  position: absolute;
  color: transparent; /*hide alt text*/
}

#entireDisc,
#deklination {
  scale: v-bind(scale);
}

#stars.transition #outerDisc,
#stars.transition #innerDisc,
#stars.transition #entireDisc,
#stars.transition #deklination {
  transition: transform v-bind(transitionSpeed + "s");
}

#marker {
  --adaptedSize: v-bind(adaptedSizeStyle);
  --adaptedSizeRaw: v-bind(adaptedSize);
  /*creates a marker on the edge of the circle*/
  position: absolute;
  top: 50%;
  left: calc(
    50% +
      (
        (var(--adaptedSize) - (60px * (var(--adaptedSizeRaw) / (1000 - 90)))) /
          2
      )
  );
  width: calc(30px * (var(--adaptedSizeRaw) / 1000));
  height: calc(5px * (var(--adaptedSizeRaw) / 1000));
  background: #ff0000;
  z-index: 7;

  border-top-left-radius: 100%;
  border-bottom-left-radius: 100%;
}

a {
  color: #0c46d2;
  font-weight: 700;
}

#mozContainer {
  margin-top: -10px;
  margin-bottom: 3px;
  font-size: 0.9em;
  background-color: hsla(0, 0%, 100%, 0.5);
  border-radius: 5px;
  width: min-content;
  white-space: nowrap;
  padding: 2px 5px;
}
html[data-theme="dark"] #mozContainer {
  background-color: hsla(0, 0%, 0%, 0.5);
}

#planetGrid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
#removeAllPlanets {
  margin: 10px;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: hsl(0, 100%, 50%);
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}
#removeAllPlanets:hover {
  background-color: hsl(0, 100%, 40%);
}
#removeAllPlanets:active {
  background-color: hsl(0, 100%, 30%);
}
#planetWrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.warn {
  background-color: hsl(30, 100%, 50%);
  border-radius: 5px;
  padding: 5px;
  margin-bottom: 2px;
}
.nowrap {
  white-space: nowrap;
}
#controlTable {
  margin: 5px 0;
  text-align: center;
  border-collapse: collapse;
  font-size: 0.89em;
}
#controlTable td {
  padding: 5px;
  border: 1px solid #000000;
}
#controlTable td:first-child {
  text-align: left;
}
</style>
