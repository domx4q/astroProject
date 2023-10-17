<template>
  <div id="planet" v-if="!placed" draggable="true" @dragstart="dragStart" @dragend="dragEnd">
    <img id="image" :alt="altText" :src="imgSrc" :title="altText" draggable="true">
  </div>
  <div v-else id="planet" class="placed" :class="{position : showPosition}" draggable="false">
    <img id="image" :alt="altText" :src="imgSrc" :title="altText" draggable="false">
  </div>
</template>

<script>
export default {
  name: "StarDiscPlanet",
  components: {},
  emits: ["dragstart", "dragend"],
  data() {
    return {
      size: 50,
    };
  },
  props: {
    imgSrc: {
      type: String,
      default: "",
      required: true,
    },
    altText: {
      type: String,
      default: "Planet",
    },
    itemId: {
      type: String,
      default: "",
      required: true,
    },
    placed: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Object,
      required: false,
      default: () => {
        return {
          x: 0,
          y: 0,
        };
      },
    },
  },
  methods: {
    dragStart(event) {
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("itemID", this.itemId);
      event.dataTransfer.setData("startLayerX", event.layerX);
      event.dataTransfer.setData("startLayerY", event.layerY);

      this.$emit("dragstart", event, this);
    },
    dragEnd(event) {
      this.$emit("dragend", event, this);
    },
  },
  computed: {
    positionXStyle() {
      return `${this.position.x}px`
    },
    positionYStyle() {
      return `${this.position.y}px`
    },
    showPosition() {
      return this.position.x !== 0 && this.position.y !== 0
    },
  },
  watch: {},
}
</script>

<style scoped>
#planet {
  --size: v-bind(size + 'px');

  width: var(--size);
  height: var(--size);
  overflow: hidden;
  transition: filter 0.3s ease-in-out;

  &.placed {
    filter: grayscale(80%);
  }
}

#planet.position {
  --positionXStyle: v-bind(positionXStyle);
  --positionYStyle: v-bind(positionYStyle);

  position: absolute;
  left: var(--positionXStyle);
  top: var(--positionYStyle);
  filter: none !important;
}

#image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}


img {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}
</style>
