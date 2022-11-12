<template>
  <div class="switcher" :class="theme" v-if="!onlyLogic">
    <span class="title">Theme:</span>
    <div class="hittable" @click="switchTheme">
      <Icon
          class="switcher__icon"
          :icon="themeIcon"/>
      <span class="switcher__text">
      {{ themeText }}
    </span>
    </div>
  </div>
</template>

<script>
// todo until 03.12.2022: FormKit PRO will be available, so then change the switcher to FormKit
export default {
  name: "themeSwitch",
  components: {},

  props: {
    onlyLogic: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      enableAutoTheme: false,

      theme: "light",
      themeList: [
        {
          name: "light",
          label: "Hell",
          icon: "mdi-brightness-7",
        },
        {
          name: "dark",
          label: "Dunkel",
          icon: "mdi-brightness-4",
        },
      ],
    };
  },
  mounted() {
    this.setTheme();
  },
  computed: {
    storedTheme() {
      return this.$store.state.theme;
    },
    themeIcon() {
      return this.themeList.find((theme) => theme.name === this.theme).icon;
    },
    themeText() {
      return this.themeList.find((theme) => theme.name === this.theme).label;
    },
  },
  methods: {
    setTheme() {
      if (this.storedTheme === "auto") {
        if (this.enableAutoTheme) {
          if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            this.theme = "dark";
          } else {
            this.theme = "light";
          }
        } else {
          this.theme = "dark";
        }
      } else {
        this.theme = this.storedTheme;
      }
    },
    switchTheme() {
      if (this.theme === "light") {
        this.theme = "dark";
      } else {
        this.theme = "light";
      }
    },
  },
  watch: {
    theme() {
      this.$store.state.theme = this.theme;
      this.$emit("theme", this.theme);
      document.documentElement.setAttribute("data-theme", this.theme);
    },
  },
}
</script>
<style scoped>
.switcher {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}
.switcher.light {
  --accent-color: #e08016;
}
.switcher.dark {
  --accent-color: #4216b4;
}
.switcher__icon {
  margin-right: 5px;
  color: var(--accent-color);
}
.switcher__text {
  font-size: 1.2rem;
}
.title {
  font-size: 1.2rem;
  margin-right: 10px;
  text-decoration: underline var(--accent-color) 2px;
  /*position on start of the line*/
  left: 0;
  position: absolute;
}
</style>
