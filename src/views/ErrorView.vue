<template>
  <ThemeSwitch only-logic />
  <main>
    <h1 id="code">{{ code }}</h1>
    <h2 id="message">{{ message }}</h2>

    <div v-if="code == 404">
      <p>
        Sie werden in <span id="countdown">{{ countdown }}</span> Sekunden auf
        die Startseite weitergeleitet.
      </p>
    </div>
  </main>
</template>

<script>
import ThemeSwitch from "@/components/themeSwitch.vue";

export default {
  name: "NotFoundView",
  components: {
    ThemeSwitch,
  },
  data() {
    return {
      countdown: 10,
    };
  },
  props: {
    code: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  mounted() {
    if (this.code == 404) {
      this.countdown = 10;
      this.startCountdown();
    }
  },
  methods: {
    startCountdown() {
      let interval = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(interval);
          this.$router.push("/");
        }
      }, 1000);
    },
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
}
#code {
  font-size: 10rem;
  font-weight: 700;
  margin: 0;
}
#message {
  font-size: 2rem;
  font-weight: 400;
  margin: 0;
}
#countdown {
  font-weight: 700;
}
</style>
