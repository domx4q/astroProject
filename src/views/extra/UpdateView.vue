<template>
  <ThemeSwitch only-logic/>
  <main>
    <h1>Update Verfügbar ({{ version }})</h1>
    <p>Bitte aktualisieren Sie die Anwendung um die neuesten Funktionen zu erhalten.<br>
      Besuchen sie dazu die
      <a :href="url" target="_blank" rel="noopener noreferrer">Releases</a>
      Seite auf GitHub. Und laden Sie die neueste Version herunter.
    </p>
  </main>
</template>

<script>
import ThemeSwitch from "@/components/themeSwitch.vue";

export default {
  name: "UpdateView",
  components: {ThemeSwitch},
  data() {
    return {};
  },
  methods: {},
  computed: {
    version() {
      return this.$route.params.version;
    },
    url() {
      return "https://github.com/domx4q/astroProject/releases/tag/" + this.version;
    },
  },
  watch: {},
  mounted() {
  },
};
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  top: 14%;
  scale: 120%;
}

a, a:visited {
  color: #007bff;
}

a:hover {
  color: #0056b3;
}

a:active {
  color: #002ab3;
}
</style>
