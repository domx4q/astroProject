<template>
  <div
    id="stars"
    :class="{ transition: enableTransition }"
    @mousedown="handleMouseDown"
    @mouseleave="handleMouseUp"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
  >
    <div
      id="controls"
      :class="{ 'collapsed fullyCollapsed': !showFullSidePanel }"
      style="height: 843px; width: 200px"
    >
      <div
        v-if="!showFullSidePanel"
        id="controlsCollapse"
        :class="{ pulse: everOpened === false }"
        class="iconHolder"
        @click="
          controlsCollapsed = !controlsCollapsed;
          everOpened = true;
        "
      >
        <Icon class="collapseIcon" icon="ph:caret-double-right-bold" />
      </div>

      <div class="content">
        <FormKit label="Aktuelle Zeit" type="button" @click="setCurrent" />
        <FormKit type="group">
          <FormKit v-model="time" :label="`Zeit (${timezone})`" type="time" />
          <FormKit v-model="date" label="Datum" type="date" />
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
          <p>
            Um die Karte zu drehen, ziehen Sie mit der Maus über die Karte.<br />
            Wenn sie die obere Karte drehen möchten, drücken Sie die
            <b>Strg-Taste</b> und ziehen Sie mit der Maus.
          </p>
          <ThemeSwitch />
          <div style="margin-bottom: 10px"></div>
          <FormKit type="group">
            <FormKit
              v-model="fileInput"
              accept="image/*"
              help="Neue Sternkarte hochladen (1000x1000px)"
              label="Discs"
              type="file"
              @change="uploadDiscs"
            />
          </FormKit>
        </FormKit>
        <p style="margin-top: -5px">
          Diese Anwendung wurde von <u>Dominik Fuchs</u> entwickelt.<br />Für
          weitere Informationen besuchen Sie bitte
          <a
            href="https://github.com/domx4q/astroProject"
            rel="noopener noreferrer"
            target="_blank"
            >GitHub</a
          >
        </p>
        <p style="margin-top: -8px">
          Grundlage der Sternkarte von <u>Dipl.-Phys. Torsten Rahn</u>, mit
          freundlicher Genehmigung
        </p>
      </div>
    </div>

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
        <img
          ref="innerDisc"
          alt="Inner Disc"
          src="@/assets/extra/images/sternenscheibe_inner.png"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ThemeSwitch from "@/components/themeSwitch.vue";
import defaults from "@/mixins/defaults";

function createDateAsUTC(date, offset = 0) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours() - offset,
      date.getMinutes(),
      date.getSeconds()
    )
  );
}

export default {
  name: "StarsView",
  mixins: [defaults],
  components: {
    ThemeSwitch,
  },
  data() {
    return {
      controlsCollapsed: true,
      everOpened: false,

      innerRotation: 0,
      outerRotation: 0,
      entireRotation: 0,
      finalRotation: {
        inner: 0,
        outer: 0,
        entire: 0,
      },

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

      fileInput: null,
    };
  },
  mounted() {
    // noinspection RedundantConditionalExpressionJS
    this.enableTransition = this.enableTransitionDefault ? true : false; // to suppress reactivity

    this.handleResize();
    window.addEventListener("resize", this.handleResize);
    this.setCurrent();
  },
  methods: {
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
      const diff = Math.abs(target - current);
      if (diff > 180) {
        if (current > target) {
          return current + (target + (360 - current));
        } else {
          return -(360 - target);
        }
      }
      return target;
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
            "inner"
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

    // region handlers
    handleResize() {
      // skipcq: JS-0049
      if (this.checkEmpty(this.$refs["entireDisc"])) return;
      this.center = {
        x: this.$refs["entireDisc"].offsetWidth / 2,
        y: this.$refs["entireDisc"].offsetHeight / 2,
      };
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

      if (!event.ctrlKey) {
        rotation = this.getNearestDegree(
          this.innerRotation,
          rotation - startAngle + this.lastAngleInner
        );
        this.innerRotation = rotation;
      } else {
        rotation = this.getNearestDegree(
          this.outerRotation,
          rotation - startAngle + this.lastAngleOuter
        );
        this.outerRotation = rotation;
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
  },
  computed: {
    query() {
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
        screenSize.height - heightOffset
      );

      return Math.min(DEFAULT_SIZE, smallerSide);
    },
    adaptedSizeStyle() {
      return `${this.adaptedSize}px`;
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
        }
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

    dateRotation() {
      const rotationsoffset = 171;
      const dayNumber = Math.floor(
        (new Date(this.convertedDate) -
          new Date(this.convertedDate.getFullYear(), 0, 0)) /
          (1000 * 60 * 60 * 24)
      );
      return -((dayNumber / 365) * 360 - rotationsoffset);
    },
    timeRotation() {
      const rotationsoffset = 75;
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
  },
  watch: {
    controlsCollapsed(newVal) {
      const controls = document.querySelector("#controls");
      const initialHeight = controls.clientHeight - 10; // because padding
      const initialWidth = controls.clientWidth - 10;
      if (newVal) {
        this.controlsInitWidth = initialWidth;
        controls.classList.add("collapsed"); // need to be all done here because if using :class, it will be overwritten by vue
        controls.style.height = `${initialHeight}px`;
        controls.style.width = `${initialWidth}px`;
        setTimeout(() => {
          controls.classList.add("fullyCollapsed");
        }, 400);
      } else {
        controls.style.height = "auto";
        controls.style.width = this.controlsInitWidth + "px";
        controls.classList.remove("collapsed");
        controls.classList.remove("fullyCollapsed");
        controls.classList.add("expanding");
        setTimeout(() => {
          controls.classList.remove("expanding");
          controls.style.width = "auto";
        }, 400);
      }
    },

    innerRotation(newValue, oldValue) {
      this.finalRotation.inner = this.getNearestDegree(oldValue, newValue);
    },
    outerRotation(newValue, oldValue) {
      if (this.orientationLocked) {
        this.setOrientation();
      }
      this.finalRotation.outer = this.getNearestDegree(oldValue, newValue);
    },
    entireRotation(newValue, oldValue) {
      this.finalRotation.entire = this.getNearestDegree(oldValue, newValue);
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
  z-index: 2;
}

#innerDisc {
  z-index: 1;
}

#innerDisc img,
#outerDisc img {
  width: v-bind(adaptedSizeStyle);
  height: v-bind(adaptedSizeStyle);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#entireDisc {
  pointer-events: none;
  width: 100%;
  height: 100%;
}

#outerDisc,
#innerDisc,
#entireDisc {
  width: 100%;
  height: 100%;
  position: absolute;
  color: transparent; /*hide alt text*/
}

#entireDisc {
  scale: v-bind(scale);
}

#stars.transition #outerDisc,
#stars.transition #innerDisc,
#stars.transition #entireDisc {
  transition: transform 1s;
}

#marker {
  --adaptedSize: v-bind(adaptedSizeStyle);
  --adaptedSizeRaw: v-bind(adaptedSize);
  /*creates a marker on the edge of the circle*/
  position: absolute;
  top: 50%;
  left: calc(
    50% + ((var(--adaptedSize) - (60px * (var(--adaptedSizeRaw) / 1000))) / 2)
  );
  width: calc(30px * (var(--adaptedSizeRaw) / 1000));
  height: calc(5px * (var(--adaptedSizeRaw) / 1000));
  background: #ff0000;
  z-index: 7;

  border-top-left-radius: 100%;
  border-bottom-left-radius: 100%;
}

#controls {
  position: absolute;
  top: 5px;
  left: 5px;
  width: auto;
  display: flex;
  flex-direction: column;
  z-index: 5;
  max-width: 200px;
  background-color: white;
  border-radius: 5px;
  padding: 5px;

  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100vh;

  transition: width 0.4s ease-in-out;
}

html[data-theme="dark"] #controls {
  background-color: black;
}

a {
  color: #156dec;
}

.iconHolder,
#controlsCollapse {
  position: absolute;
  top: 5px;
  right: 2px;
  cursor: pointer;
  margin: 4px;
  width: 20px;
  height: 20px;
  z-index: 100;

  transition: transform 0.4s ease-in-out, filter 0.2s ease-in-out;
}

.iconHolder:hover,
#controlsCollapse:hover {
  filter: brightness(5);
}

.iconHolder {
  transform: rotate(180deg);
}

#controls.collapsed .iconHolder {
  transform: rotate(0);
}

#controls.collapsed {
  width: 0;
  padding: 5px;
}

#controls.expanding {
  overflow-y: hidden;
}

#controls.fullyCollapsed {
  width: 0 !important;
  padding: 15px !important;
}

#controls .content {
  opacity: 1;
  transition: opacity 0.4s ease-in-out;
}

#controls.collapsed .content,
#controls.expanding .content {
  opacity: 0;
}

#controls.fullyCollapsed .content {
  display: none;
}

.pulse {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
