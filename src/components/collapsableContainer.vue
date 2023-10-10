<template>
  <div>
    <div
      id="container"
      :class="{ collapsed: collapsed && !useAsNormalContainer, mirror: mirror }"
    >
      <div
        v-if="!useAsNormalContainer"
        id="controlsCollapse"
        :class="{ pulse: usePulse && everOpened === false }"
        class="iconHolder"
        @click="
          collapsed = !collapsed;
          everOpened = true;
        "
      >
        <Icon v-if="mirror" class="collapseIcon" icon="ph:caret-double-left-bold" />
        <Icon v-else class="collapseIcon" icon="ph:caret-double-right-bold" />
      </div>
      <div v-auto-animate id="contentWrapper">
        <div class="content" v-if="!collapsed || useAsNormalContainer">
          <div
            v-if="!disableFiller"
            :style="'width: ' + fillerWidth"
            style="height: 0; margin: 0; padding: 0"
          />
          <slot id="slot" ref="slot">
            Es gab ein Problem beim Laden des Inhalts.
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "collapsableContainer",
  components: {},
  emits: [],
  data() {
    return {
      collapsed: true,
      everOpened: false,

      oldCollapsedState: true,
    };
  },
  props: {
    disableFiller: {
      type: Boolean,
      description:
        "By default there will be inserted a filler div on the top with 0 height but a width of 200px. With this you can disable it.",
      default: true,
    },
    fillerWidth: {
      type: String,
      description: "The width of the filler div. Default is 200px.",
      default: "200px",
    },
    usePulse: {
      type: Boolean,
      default: false,
    },
    useAsNormalContainer: {
      type: Boolean,
      description:
        "If true, the container will not be collapsable. It will just be a normal container.\n" +
        "Helpful for specific screen sizes.",
      default: false,
    },
    mirror: {
      type: Boolean,
      description:
        "This can be useful if the container is placed on the right screen side. The Content won't be mirrored.",
      default: false,
    },
    minWidth: {
      type: String,
      description:
        "The minimum width of the container. Default is 20px. This is useful if you want to use the container as a normal container.",
      default: "20px",
    },
    minHeight: {
      type: String,
      description:
        "The minimum height of the container. Default is 20px. This is useful if you want to use the container as a normal container.",
      default: "20px",
    },
    approximateContentHeight: {
      type: Number,
      description:
        "Pass this for a smoother transition. If it matsches the real size, it only expands to the side and not to the bottom. When this property is used, the minHeight property is ignored. The default is 0.",
      default: 0,
    },
  },
  methods: {},
  computed: {
    minHeightStyle() {
      if (!this.collapsed || this.useAsNormalContainer) {
        return this.minHeight;
      }
      if (this.approximateContentHeight !== 0) {
        return Number(this.approximateContentHeight) + 10 + "px"; // +10 for the padding
      } else {
        return this.minHeight;
      }
    },
  },
  watch: {
    useAsNormalContainer(newVal) {
      if (newVal) {
        this.oldCollapsedState = this.collapsed;
        this.collapsed = false;
      }
      else {
        this.collapsed = this.oldCollapsedState;
      }
    },
  },
};
</script>

<style scoped>
#container {
  position: absolute;
  top: 5px;
  left: 5px;
  width: auto;
  display: flex;
  flex-direction: column;
  z-index: 5;
  max-width: 200px;
  background-color: white;
  border-radius: 5px;
  padding: 5px;

  min-width: v-bind(minWidth);
  min-height: v-bind(minHeightStyle);

  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100vh;

  transition: width 0.4s ease-in-out;
}

html[data-theme="dark"] #container {
  background-color: black;
}

.iconHolder {
  position: absolute;
  top: 2px;
  right: 2px;
  cursor: pointer;
  margin: 4px;
  z-index: 100;

  transition:
    transform 0.25s ease-in-out,
    filter 0.2s ease-in-out;
}
#container.mirror .iconHolder {
  left: 2px;
  right: unset;
}

#container.mirror {
  right: 5px;
  left: unset;
}

.iconHolder:hover,
#controlsCollapse:hover {
  filter: brightness(5);
}

.iconHolder {
  transform: rotate(180deg);
}

#container.collapsed .iconHolder {
  transform: rotate(0);
}

.pulse {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    scale: 1;
  }
  50% {
    scale: 1.2;
  }
  100% {
    scale: 1;
  }
}
</style>
