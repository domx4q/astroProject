<template>
  <div id="planet" v-if="!placed" draggable="false" @dragstart="dragStart" @dragend="dragEnd" :class="{otherRotation:showRotation}">
    <img id="image" :alt="altText" :src="imgSrc" :title="altText" draggable="true">
  </div>
  <div v-else id="planet" class="placed" :class="{position : showPosition, rotation:showRotation}" draggable="false">
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
    innerDiscRotation: {
      type: Number,
      default: 0,
      required: false,
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
    rotationStyle() {
      return `rotate(${-this.innerDiscRotation}deg)`
    },
    otherRotationStyle() {
      return `rotate(${this.innerDiscRotation}deg)`
    },
    showPosition() {
      return this.position.x !== 0 && this.position.y !== 0
    },
    showRotation() {
      return this.innerDiscRotation !== 0
    }
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
    filter: grayscale(80%) brightness(80%);
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
#planet.rotation {
  transform: v-bind(rotationStyle)
}
#planet.otherRotation > #image {
  transform: v-bind(otherRotationStyle)
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
