<template>
  <div>
    <button class="btn btn-primary" @click="$emit('clicked')">
      {{ text }}
    </button>
  </div>
</template>

<script>
export default {
  name: "DynamicButton",
  props: {
    text: {
      type: String,
      default: "Beispiel Button",
    },
    color: {
      type: String,
      default: "green",
    },
  },
};
</script>

<style scoped>
button {
  background-color: v-bind(color);
  border: none;
  border-radius: 10px;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-bottom: 10px;
}
</style>
