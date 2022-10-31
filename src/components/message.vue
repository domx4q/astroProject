<template>
  <div class="message">
    <div class="message__header">
      <div class="message__header__title">
        <h3>{{ title }}</h3>
      </div>
      <div class="message__header__close">
        <button @click="closeMessage">
          &times;
        </button>
      </div>
    </div>
    <div class="message__body" v-if="message !== ''">
      <div class="message__body__content">
        <p>{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "message",
  props: {
    title: {
      type: String,
      default: "Nachricht",
    },
    message: {
      type: String,
      default: "Das ist eine Nachricht",
    },
    timeout: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {};
  },
  mounted() {
    if (this.timeout !== -1) {
      setTimeout(() => {
        this.closeMessage();
      }, this.timeout);
    }
  },
  computed: {},
  methods: {
    closeMessage() {
      this.$emit("close");
    },
  },
}
</script>

<style scoped>
.message {
  position: relative;
  width: 30%;
  min-width: 280px;
  max-width: 500px;
  height: auto;
  min-height: 50px;
  max-height: 500px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  padding: 0;
  margin: 0;
  overflow: hidden;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  /*transition: all 0.3s ease-in-out;*/
}
html[data-theme="dark"] .message {
  background-color: rgba(0, 0, 0, 0.6);
}
.message__header {
  width: 100%;
  height: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
}
.message__header__title {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 5px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.message__header__title h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
  padding: 0;
}
.message__header__close {
  width: 15px;
  height: 15px;
  display: flex;
  margin-top: -5px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.message__header__close button {
  width: 100%;
  height: 100%;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 500;
  color: #000;
}
html[data-theme="dark"] .message__header__close button {
  color: #fff;
}
.message__header__close button:hover {
  color: #f00 !important;
}
.message__body {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
}
.message__body__content {
  width: 100%;
  height: auto;
  display: flex;
  font-size: 1rem;
  font-weight: 400;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.message__body__content p {
  margin: 0;
  padding: 0;
}
</style>
<style>
.message.info {}
.message.success .message__body__content {
  color: #3bff00;
}
.message.error .message__body__content {
  color: #ff0000;
}
.message.warning .message__body__content {
  color: #ff9f00;
}
</style>
