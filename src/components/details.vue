<template>
  <div
    v-auto-animate
    :class="{ open: open, disabled: disabled }"
    class="details"
  >
    <div class="header" @click="toggle">
      <div class="icon">
        <Icon icon="formkit:caretright" />
      </div>
      <div class="title">{{ title }}</div>
    </div>
    <div v-if="open" class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
  name: "details",
  components: { Icon },
  emits: ["toggle"],
  data() {
    return {
      open: this.default_open,
    };
  },
  props: {
    title: {
      type: String,
      default: "Details",
    },
    default_open: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggle() {
      this.open = !this.open;
      this.$emit("toggle", this.open);
    },
  },
  computed: {},
  watch: {},
};
</script>

<style scoped>
.details {
  --negativeMargin: v-bind(negativeMargin + "px");

  --bgc: hsla(0, 0%, 20%, 0.2);
  --bgca: hsla(0, 0%, 20%, 0.4);

  border-radius: 10px;
  border: none;
  background-color: var(--bgc);
  padding: 3px;
  margin: 2px 0 10px;
  gap: 5px;

  .header {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 5px;
    gap: 5px;
    border-radius: 10px;
    background-color: var(--bgc);
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: var(--bgca);
    }

    .icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease-in-out;
    }

    .title {
      font-size: 17px;
      font-weight: 700;
      color: var(--text-color);
    }
  }

  .content {
    padding: 5px;
  }
}
.details.open > .header > .icon {
  /* cascaded selector doesnt work, if a parent Details Component is opened */
  transform: rotate(90deg);
}

/*dark*/
html[data-theme="dark"] .details {
  --bgc: hsla(0, 0%, 90%, 0.2);
  --bgca: hsla(0, 0%, 90%, 0.4);
}
</style>
