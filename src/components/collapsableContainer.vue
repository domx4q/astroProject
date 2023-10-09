<template>
  <div>
    <div
      id="container"
      :class="{ 'collapsed fullyCollapsed': !useAsNormalContainer }"
      style="width: 210px"
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
        <Icon class="collapseIcon" icon="ph:caret-double-right-bold" />
      </div>
      <div v-auto-animate class="content">
        <div
          v-if="!disableFiller"
          style="width: 200px; height: 0; margin: 0; padding: 0"
        />
        <slot></slot>
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
    };
  },
  props: {
    disableFiller: {
      type: Boolean,
      default: true,
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
  },
  methods: {},
  computed: {},
  watch: {
    collapsed(newVal) {
      const controls = document.querySelector("#container");
      const initialHeight = controls.clientHeight - 10; // because padding
      const initialWidth = controls.clientWidth - 10;
      if (newVal) {
        this.controlsInitWidth = initialWidth;
        controls.classList.add("collapsed"); // need to be all done here because if using :class, it will be overwritten by vue
        controls.style.height = `${initialHeight}px`;
        controls.style.width = `${initialWidth}px`;
        setTimeout(() => {
          controls.classList.add("fullyCollapsed");
        }, 400);
      } else {
        controls.style.height = "auto";
        controls.style.width = this.controlsInitWidth + "px";
        controls.classList.remove("collapsed");
        controls.classList.remove("fullyCollapsed");
        controls.classList.add("expanding");
        setTimeout(() => {
          controls.classList.remove("expanding");
          controls.style.width = "auto";
        }, 400);
      }
    },
    "useAsNormalContainer"(newVal){
      if(newVal){
        this.collapsed = false;
      }
    }
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

  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100vh;

  transition: width 0.4s ease-in-out;
}

html[data-theme="dark"] #container {
  background-color: black;
}

.iconHolder,
#controlsCollapse {
  position: absolute;
  top: 5px;
  right: 2px;
  cursor: pointer;
  margin: 4px;
  width: 20px;
  height: 20px;
  z-index: 100;

  transition:
      transform 0.4s ease-in-out,
      filter 0.2s ease-in-out;
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

#container.collapsed {
  width: 0;
  padding: 5px;
}

/*noinspection CssUnusedSymbol*/
#container.expanding {
  overflow-y: hidden;
}

#container.fullyCollapsed {
  width: 0 !important;
  padding: 15px !important;
}

#container .content {
  opacity: 1;
  transition: opacity 0.4s ease-in-out;
}

#container.collapsed .content,
#container.expanding .content {
  opacity: 0;
}

#container.fullyCollapsed .content {
  display: none;
}

.pulse {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
