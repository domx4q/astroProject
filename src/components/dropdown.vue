<template>
  <div class="dropdown" v-auto-animate>
    <div class="title" @click="toggle" v-if="showTitle">
      <h4 v-if="italic">
        <i>{{ title }}</i>
      </h4>
      <h3 v-else>{{ title }}</h3>
    </div>
    <div class="content" v-if="open">
      <slot>Platzhalter für den Inhalt des Dropdowns</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "dropdown",
  props: {
    title: {
      type: String,
      default: "Dropdown",
    },
    openOverride: {
      type: Boolean,
      default: false,
    },
    onlyShowTitleOnClose: {
      type: Boolean,
      default: false,
    },
    italic: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      open: false,
    };
  },
  mounted() {
    this.open = this.openOverride;
  },
  computed: {
    showTitle() {
      if (this.onlyShowTitleOnClose) {
        return !this.open;
      } else {
        return true;
      }
    },
  },
  methods: {
    toggle() {
      this.open = !this.open;
      if (this.open) {
        this.$emit("open");
      } else {
        this.$emit("close");
      }
    },
  },
  watch: {
    openOverride: function (val) {
      this.open = val;
    },
  },
};
</script>

<style scoped>
.dropdown {
  --bg-color: rgba(147, 147, 147, 0.1);

  position: relative;
  width: 100%;
  height: auto;
  max-height: 400px;
  margin: 5px 0;
  padding: 0;
  border-radius: 5px;
  background-color: var(--bg-color);
  overflow-y: auto;
  overflow-x: hidden;
}
html[data-theme="dark"] .dropdown {
  --bg-color: rgba(0, 0, 0, 0.1);
}
.dropdown .title {
  position: relative;
  width: 100%;
  height: auto;
  padding: 10px;
  background-color: var(--bg-color);
  cursor: pointer;
}
.dropdown .title h3,
.dropdown .title h4 {
  margin: 0;
  padding: 0;
  font-size: 1.2rem;
  font-weight: 400;
}
.dropdown .title h4 {
  font-size: 1rem;
  font-weight: 300;
}
.dropdown .content {
  position: relative;
  width: calc(100% - 20px);
  height: auto;
  padding: 10px;
  background-color: var(--bg-color);
}
</style>
