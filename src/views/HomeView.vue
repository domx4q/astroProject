<template>
  <model-viewer
      :src="modelSrc"
      alt="A 3D model of an astronaut"
      ar
      touch-action="pan-y pinch-zoom"
      camera-controls
      auto-rotate
      shadow-intensity="1"
      exposure="1"
      environment-image="neutral"
      background-color="transparent"

      disable-pan

      id="planet"
      style="width: 100%; height: 100vh"

      @load="updatePlanet"
      @keyup.space="applyRandomTexture">
    <div class="controls">
      <div id="buttons">
        <input type="file" @change="onFileChange" id="textureInput" accept="image/*" class="button"/>
        <button @click="applyRandomTexture" class="button" id="randomTextureButton">Zufällige Textur</button>
      </div></div>
  </model-viewer>
</template>

<script>
// @ is an alias to /src
import('@google/model-viewer')
export default {
  name: 'HomeView',
  components: {},
  data () {
    return {
      modelSrc: 'models/sphere.glb',
      planet: null,
      loaded: false,
      currentTexture: "/textures/8k_jupiter.jpg",

      textures: [
        "/textures/2k_neptune.jpg",
        "/textures/2k_uranus.jpg",
        "/textures/4k_venus_atmosphere.jpg",
        // "/textures/8k_earth_clouds.jpg",
        // "/textures/8k_earth_daymap.jpg",
        // "/textures/8k_earth_nightmap.jpg",
        "/textures/8k_jupiter.jpg",
        "/textures/8k_mars.jpg",
        "/textures/8k_mercury.jpg",
        "/textures/8k_moon.jpg",
        "/textures/8k_saturn.jpg",
        // "/textures/8k_sun.jpg",
        "/textures/8k_venus_surface.jpg",
      ]
    }
  },
  computed: {},
  mounted () {},
  methods: {
    randomTexture() {
      let curRandom = this.textures[Math.floor(Math.random() * this.textures.length)]
      while (curRandom === this.currentTexture) {
        curRandom = this.textures[Math.floor(Math.random() * this.textures.length)]
      }
      this.currentTexture = curRandom
      return curRandom
    },

    async createAndApplyTexture (image) {
      const material = this.planet.model.materials[0]

      const texture = await this.planet.createTexture(image)
      material.pbrMetallicRoughness['baseColorTexture'].setTexture(texture)

    },
    applyRandomTexture () {
      this.createAndApplyTexture(this.randomTexture())
    }, updatePlanet () {
      this.planet = document.querySelector('model-viewer#planet')
      this.loaded = true

      // this.applyRandomTexture();
    },
    onFileChange (e) {
      const file = e.target.files[0]
      this.createAndApplyTexture(URL.createObjectURL(file))
    }
  }
}
</script>
<!--create the style-->
<style scoped>
  .button {
    border-radius: 10px;
    padding: 10px;
    margin: 10px;
    background-color: #fff;
    color: hsl(197, 45%, 49%);
    border: none;
    outline: none;

    transition: background-color 0.2s linear, color 0.2s linear;

    box-shadow: 0 0 0 5px hsl(197, 45%, 49%);
  }
  #textureInput::file-selector-button {
    background-color: inherit;
    color: inherit;
    border: none;
    border-radius: 4px;
    outline: none;

  }
  .button:hover {
    background-color: hsl(197, 45%, 49%);
    color: #fff;
  }
  input[type='file'] { font-size: 0; }
  ::file-selector-button { font-size: initial; }

  #buttons{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  #randomTextureButton {
    font-size: 1.05em;
  }
</style>
