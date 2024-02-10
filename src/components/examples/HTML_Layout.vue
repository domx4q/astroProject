<template>
  <div id="site">
    <div id="holder">
      <div class="wrapper">
        <div id="box">
          <p class="red">Normaler Ursprung</p>
          <p class="green">Ursprung ohne translate</p>
          <p class="blue">Versetzter Ursprung</p>
          <div class="marker"></div>
          <div id="second" class="marker"></div>
          <div id="third" class="marker"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HTML_Layout",
  data() {
    return {}
  }
}
</script>

<style>
</style>

<style scoped>
#site {
  width: 100%;
  height: 100%;
  background-color: #212121;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 0;
}

#holder {
  height: 55%;
}

#box {
  width: 200px;
  //height: 370px;

  border: 3px dashed #8c8c8c;
  z-index: 2;
  position: relative;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;

  //border-radius: 50%;
  aspect-ratio: 3 / 4;
}

.marker {
  width: 25px;
  height: 25px;
  background-color: rgba(255, 0, 0, .7);
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  z-index: 1;
}

#second {
  top: 50%;
  left: 50%;
  background-color: rgba(0, 0, 255, .7);
  z-index: 3;
}
#third {
  top: 50%;
  left: 50%;
  background-color: rgba(0, 255, 0, .7);
  z-index: 2;
  transform: none;
}

p {
  color: #fff;
  margin: 0;
  padding: 0;
  font-size: 1.2em;
  white-space: nowrap;
}

.red {
  color: #ff0000;
}

.blue {
  color: #6464ff;
}
.green {
  color: #00ff00;
}

.wrapper {
  padding: 20px;
}
</style>
