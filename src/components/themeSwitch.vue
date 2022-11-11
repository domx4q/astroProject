<template v-if="!onlyLogic">
  <div class="switcher" @click="switchTheme">
    <Icon
      class="switcher__icon"
      :icon="themeIcon"/>
    <span class="switcher__text">
      {{ themeText }}
    </span>
  </div>
</template>

<script>
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
    console.log(this.storedTheme)
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
}

</style>
