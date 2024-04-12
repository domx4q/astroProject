<template>
  <div v-if="showPopup" class="popup" @click="showPopup = false">
    <div class="popup-content">
      <h2>QR-Code</h2>
      <img :src="src" alt="Der QR-Code konnte nicht geladen werden." />
    </div>
  </div>
</template>
<script>
export default {
  name: "QR-Code",
  props: {
    change: {
      type: String,
      default: "0",
    },
    src: {
      type: String,
      default: "@/assets/qr-codes/main.png",
    },
  },
  data() {
    return {
      showPopup: false,
      image: null,
    };
  },
  watch: {
    change() {
      this.showPopup = true;
    },
  },
};
</script>
<style scoped>
#planetInfo p {
  margin: 0;
  padding: 0;
}

#planetInfo .description a {
  --normalColor: v-bind(accent_color);
  --clickColor: #bb1920;

  color: var(--normalColor);
  transition:
    color 0.14s ease-in-out,
    filter 0.14s ease-in-out;
}

#planetInfo .description a:hover {
  filter: brightness(0.7);
}

#planetInfo .description a:active {
  color: var(--clickColor);
}

#planetInfo hr {
  width: 100%;
  margin: 5px 0;
}

/*region hotspots*/

.hotspot > * {
  pointer-events: none;
  cursor: pointer;
  transform: translateY(-50%);
}

/*endregion hotspots*/
/* This keeps child nodes hidden while the element loads */
:not(:defined) > * {
  display: none;
}

.messages > .wrapper > * {
  margin: 5px 0;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.popup-content img {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 5px;
  margin-bottom: 20px;
}

html[data-theme="dark"] .popup-content {
  background-color: #333;
}
</style>
