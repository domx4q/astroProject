<template>
  <div id="background">
    <div id="text" v-html="formattedText">
    </div>
    <div v-if="showInput" id="inputContainer">
      <textarea id="input" v-model="text" ref="input"></textarea>
    </div>
  </div>
</template>

<script>
import defaults from "@/mixins/defaults";

export default {
  name: 'LargeTextView',
  mixins: [defaults],
  props: {
    raw_text: {
      type: String,
      required: false,
    }
  },
  data() {
    return {
      text: "",
      showInput: false,
    }
  },
  methods: {
  },
  computed: {
    formattedText() {
      return this.text.replace(/\r\n|\r|\n/g, '<br>');
    },
    calculatedFontSize() {
      if (this.text.length === 0) {
        return 50;
      }
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const padding = 100; // Adjust this value as needed

      const lines = this.text.split(/\r\n|\r|\n/);
      const longestLine = lines.reduce((a, b) => a.length > b.length ? a : b, '');
      const longestLineWidth = longestLine.length;

      // Calculate the font size based on the smaller dimension (width or height)
      const widthCalc = (viewportWidth - padding) / longestLineWidth * 2
      return Math.min(widthCalc, (viewportHeight - padding) / (lines.length + 1.2));
    },
  },
  mounted() {
    console.log(this.raw_text)
    this.showInput = this.checkEmpty(this.raw_text)
    if (!this.showInput) {
      this.text = this.raw_text
    }
  },
  watch: {}
}
</script>

<style scoped>
#background {
  position: fixed;
  top: 0;
  left: 0;
  background-color: black;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;

  color: white;
}

* {
  font-family: 'Roboto', sans-serif;
}

#text {
  z-index: 40;
  text-overflow: ellipsis;
  color: white;
}

#text, #input {
  font-size: v-bind(calculatedFontSize+ 'px');
}

#input {
  background-color: transparent;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  border: none;
  color: transparent;
  outline: none;
  text-align: center;
  width: 100%;
  height: 100%;
}

#input::selection {
  background: transparent;
  color: transparent;
}
</style>
