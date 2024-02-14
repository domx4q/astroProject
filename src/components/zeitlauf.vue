<template>
  <div>
    <kbd>{{this.timeString}}</kbd>
    <button type="submit" @click="start">Start</button>
    <button type="reset" @click="stop">Stop</button>
    <FormKit
        type="slider"
        label="Animations Geschwindigkeit"
        v-model="timeScale"
        :min="60"
        :max="600000"
        :step="1"
    />
  </div>
</template>

<script>
export default {
  emits: ["tick"],
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Zeitlauf",
  data() {
    return {
      timeScale: 60,
      simulate: false,
      lastTime: new Date(),

      interval: 1,
      timer: null,
    }
  },
  computed: {
    timeString() {
      return this.lastTime.toLocaleTimeString()
    },
  },
  methods: {
    addTime() {
      this.addMs(this.timeScale * this.interval)
    },
    addMs(ms) {
      this.lastTime = new Date(this.lastTime.getTime() + ms)
    },
    start() {
      this.simulate = true
    },
    stop() {
      this.simulate = false
    },
  },
  watch: {
    simulate() {
      if (this.simulate) {
        this.timer = setInterval(this.addTime, this.interval)
      } else {
        clearInterval(this.timer)
      }
    },
    timeString() {
      this.$emit("tick", this.lastTime)
    },
  },
}
</script>

<style scoped>

</style>