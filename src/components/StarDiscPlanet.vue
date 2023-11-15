<template>
  <div
    v-if="!placed"
    id="planet"
    :class="{ otherRotation: showRotation, dragging: dragging }"
    draggable="false"
    @dragend="dragEnd"
    @dragstart="dragStart"
  >
    <img
      id="image"
      :alt="altText"
      :src="imgSrc"
      :title="altText"
      draggable="true"
    />
  </div>
  <div
    v-else
    id="planet"
    :class="{
      position: showPosition,
      rotation: showPosition && showRotation,
      otherRotation: showRotation && !showPosition,
    }"
    class="placed"
    draggable="false"
    @dblclick="remove"
  >
    <img
      id="image"
      :alt="altText"
      :src="imgSrc"
      :title="altText"
      draggable="false"
    />
  </div>
</template>

<script>
export default {
  name: "StarDiscPlanet",
  components: {},
  emits: ["dragstart", "dragend", "remove"],
  data() {
    return {
      size: 50,
      dragging: false,
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
    entireRotation: {
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
      event.dataTransfer.setData("startOffsetX", event.offsetX);
      event.dataTransfer.setData("startOffsetY", event.offsetY);

      this.$emit("dragstart", event, this);
    },
    dragEnd(event) {
      this.dragging = false;
      this.$emit("dragend", event, this);
    },
    remove() {
      this.dragging = false;
      this.$emit("remove", this);
    },
  },
  computed: {
    positionXStyle() {
      return `${this.position.x}px`;
    },
    positionYStyle() {
      return `${this.position.y}px`;
    },
    rotationStyle() {
      // will be used when the planet is placed
      return `rotate(${-(this.innerDiscRotation + this.entireRotation)}deg)`;
    },
    otherRotationStyle() {
      // used when the planet is not placed to match the grabbed position with the disc rotation
      return `rotate(${this.innerDiscRotation + this.entireRotation}deg)`;
    },
    showPosition() {
      return this.position.x !== 0 && this.position.y !== 0;
    },
    showRotation() {
      return this.innerDiscRotation !== 0;
    },
  },
  watch: {},
};
</script>

<style scoped>
#planet {
  --size: v-bind(size + "px");

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
  transform: v-bind(rotationStyle) !important;
}

#planet.otherRotation > #image {
  transform: v-bind(otherRotationStyle);
}

#image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  cursor: move;
}

.placed #image {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}
</style>
