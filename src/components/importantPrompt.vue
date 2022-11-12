<template>
  <div class="wrapper" v-if="show">
    <div class="important-prompt">
      <div class="close" v-if="dismissible">
        <button @click="close">&times;</button>
      </div>
      <div class="content">
        <div class="content_title">
          <slot name="title"></slot>
        </div>
        <div class="content_text">
          <slot name="text"></slot>
        </div>
      </div>
      <div class="buttons">
        <slot name="buttons"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "importantPrompt",
  props: {
    dismissible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: true
    };
  },
  methods: {
    close() {
      this.show = false;
    }
  }
};
</script>

<style scoped>
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.important-prompt {
  position: relative;
  width: 80%;
  top: -18%;
  max-width: 500px;
  max-height: 400px;
  height: min-content;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
html[data-theme="dark"] .important-prompt {
  background-color: #1e1e1e;
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.content_title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}
.content_text {
  font-size: 1rem;
  margin-bottom: 10px;
}
.buttons {
  display: flex;
  justify-content: flex-end;
}

.close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 5px;
  cursor: pointer;
  border-top-right-radius: 10px;
}
.close button {
  background-color: transparent !important;
  border: none;
  font-size: 1.2rem;
  font-weight: bold;
}

::v-slotted(button), button {
  background-color: transparent;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 1rem;
  cursor: pointer;
  color: var(--text-color);
}
::v-slotted(button:hover), button:hover {
  background-color: #e7e7e7;
}
html[data-theme="dark"] ::v-slotted(button:hover), html[data-theme="dark"] button:hover {
  background-color: #4f4f4f;
}
.content_title ::v-slotted(h1),.content_title h1, .content_title ::v-slotted(h2), .content_title h2, .content_title ::v-slotted(h3), .content_title h3, .content_title ::v-slotted(h4), .content_title h4, .content_title ::v-slotted(h5), .content_title h5, .content_title ::v-slotted(h6), .content_title h6 {
  margin: 0;
  padding: 0;
}
</style>
