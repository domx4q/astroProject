<template>
    <div>
        <button class="btn btn-primary" @click="$emit('clicked')">Beispiel Button</button>
    </div>
</template>

<script>
export default {
  name: "StaticButton",
}
</script>

<style scoped>
button {
    background-color: #4CAF50; /* Green */
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
