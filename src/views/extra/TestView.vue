<template>
  <div style="background-color: #fff; width: 100%; height: 100vh">
    <ThemeSwitch only-logic />
    <button id="normal" @click="normal = !normal;">Normal?</button>
    <CollapsableContainer disable-filler use-pulse :use-as-normal-container="normal">
      <h1>Hallo</h1>
    </CollapsableContainer>
  </div>
</template>

<script>
import ThemeSwitch from "@/components/themeSwitch.vue";
import CollapsableContainer from "@/components/collapsableContainer.vue";

export default {
  name: "TestView",
  components: { CollapsableContainer, ThemeSwitch },
  emits: [],
  data() {
    return {
      normal: false
    };
  },
  props: {},
  methods: {},
};
</script>

<style scoped>
#normal {
  /*anchor on the right sider of the screren*/
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
