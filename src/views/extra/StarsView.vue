<template>
  <div id="stars">
    <div id="controls">
      <FormKit type="group">
        <FormKit
            v-model="innerRotation"
            type="range"
            label="Inner Rotation"
            help="The rotation of the inner circle"
            min="0"
            max="360"
            step="1"
        />
        <FormKit
            v-model="outerRotation"
            type="range"
            label="Outer Rotation"
            help="The rotation of the outer circle"
            min="0"
            max="360"
            step="1"
        />
        <FormKit
            v-model="entireRotation"
            type="range"
            label="Entire Rotation"
            help="The rotation of the entire circle"
            min="0"
            max="360"
            step="1"
        />
      </FormKit>
      <FormKit
        type="button"
        label="Aktuelle Zeit"
        @click="setCurrent"/>
      <FormKit type="group">
        <FormKit
          type="time"
          label="Zeit"
          v-model="time"
          @input="setTime"/>
        <FormKit
          type="date"
          label="Datum"
          v-model="date"
          @input="setDate"/>
        <FormKit
          type="select"
          label="Himmelsrichtung"
          v-model="orientation"
          :options="[
            {value: 'none', label: 'Keine'},
            {value: 'N', label: 'Norden'},
            {value: 'S', label: 'Süden'},
            {value: 'E', label: 'Osten'},
            {value: 'W', label: 'Westen'},
          ]"
          @input="setOrientation"
          @inputRaw="setOrientation"/>
      </FormKit>
    </div>

    <div id="entireDisc" :style="entireDiscStyle">
      <div id="marker"/>
      <div id="outerDisc" :style="outerDiscStyle"/>
      <div id="innerDisc" :style="innerDiscStyle"/>
    </div>
  </div>
</template>

<script>
import defaults from "@/mixins/defaults";

export default {
  name: "StarsView",
  mixins: [defaults],
  data() {
    return {
      innerRotation: 0,
      outerRotation: 0,
      entireRotation: 0,

      date: "2020-01-01",
      time: "00:00",
      orientation: "none",
      orientationLocked: false,
    }
  },
  mounted() {},
  methods: {
    setCurrent() {
      // get the 01.01.2000 00:00:00
      this.date = this.convertDate(new Date());

      const tempDate = new Date();
      tempDate.setFullYear(2000);
      tempDate.setMonth(0);
      tempDate.setDate(1);
      tempDate.setHours(0);
      tempDate.setMinutes(0);
      tempDate.setSeconds(0);
      tempDate.setMilliseconds(0);
      // this.date = this.convertDate(tempDate);

      this.time = this.convertedDate.toLocaleTimeString("de-DE", {hour: "2-digit", minute: "2-digit"});

      this.innerRotation = this.dateRotation
      this.outerRotation = this.timeRotation
      // this.entireRotation = -this.timeRotation
    },
    setTime() {
      this.outerRotation = this.timeRotation
      // this.entireRotation = -this.timeRotation
    },
    setDate() {
      this.innerRotation = this.dateRotation
    },
    setOrientation() {
      switch (this.orientation) {
        case "S":
          this.entireRotation = 0 - this.outerRotation
          break
        case "W":
          this.entireRotation = 90 - this.outerRotation
          break
        case "N":
          this.entireRotation = 180 - this.outerRotation
          break
        case "E":
          this.entireRotation = 270 - this.outerRotation
          break
      }
    },

    convertDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    },
  },
  computed: {
    convertedTime() {
      return this.time.split(":").reduce((acc, v, i) => {
        acc[i === 0 ? "hours" : "minutes"] = parseInt(v);
        return acc;
      }, {});
    },
    convertedDate() {
      const a = this.date.split("-");
      const b = new Date();
      b.setFullYear(a[0]);
      b.setMonth(a[1] - 1);
      b.setDate(a[2]);
      return b;
    },

    innerDiscStyle() {
      return {
        transform: `rotate(${this.innerRotation}deg)`
      }
    },
    outerDiscStyle() {
      return {
        transform: `rotate(${this.outerRotation}deg)`
      }
    },
    entireDiscStyle() {
      return {
        transform: `rotate(${this.entireRotation}deg)`
      }
    },

    dateRotation() {
      const rotationsoffset = 170;
      const dayNumber = Math.floor((this.convertedDate - new Date(this.convertedDate.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
      return -((dayNumber / 365) * 360 - rotationsoffset);
    },
    timeRotation() {
      const rotationsoffset = 74;
      const timeNumber = this.convertedTime.hours * 60 + this.convertedTime.minutes;
      return +((timeNumber / 1440) * 360 + rotationsoffset);
    },
  },
  watch: {
    orientation(value) {
      this.orientationLocked = value !== "none";
    },

    outerRotation() {
      if (this.orientationLocked) {
        this.setOrientation()
      }
    },

  },
}
</script>

<style scoped>
#stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ea7f2e;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

#outerDisc {
  background-image: url("@/assets/extra/images/sternenscheibe_outer.png");
  z-index: 2;
}
#innerDisc {
  background-image: url("@/assets/extra/images/sternenscheibe_inner.png");
  z-index: 1;
}
#entireDisc {
  pointer-events: none;
}
#outerDisc, #innerDisc, #entireDisc {
  width: 100%;
  height: 100%;

  background-repeat: no-repeat;
  background-position: center;
  background-size: auto;
  position: absolute;

  transition: transform 1s;
}
#marker {
  /*cratee a marker on the edge of the circle*/
  position: absolute;
  top: 50%;
  left: calc(50% + (940px / 2));
  width: 30px;
  height: 5px;
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
  justify-content: center;
  align-items: center;
  z-index: 5;
}
</style>
