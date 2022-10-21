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

      @load="updatePlanet">
    <div class="controls">
      <input type="file" @change="onFileChange" id="textureInput" accept="image/*"/>
    </div>
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

      textures: [
          "/textures/8k_mercury.jpg",
          "/textures/8k_venus_surface.jpg",
          "/textures/4k_venus_atmosphere.jpg",
          "/textures/8k_mars.jpg",
          "/textures/8k_jupiter.jpg",
          "/textures/8k_saturn.jpg",
          "/textures/2k_uranus.jpg",
          "/textures/2k_neptune.jpg",
      ]
    }
  },
  computed: {},
  mounted () {},
  methods: {
    randomTexture() {
      return this.textures[Math.floor(Math.random() * this.textures.length)]
    },

    async createAndApplyTexture (image) {
      const material = this.planet.model.materials[0]

      const texture = await this.planet.createTexture(image)
      material.pbrMetallicRoughness['baseColorTexture'].setTexture(texture)

    },
    updatePlanet () {
      this.planet = document.querySelector('model-viewer#planet')
      this.loaded = true

      this.planet.addEventListener('keyup', () => {
        // console.log('click')
        // console.log(this.planet.model.materials[0])
        this.createAndApplyTexture(this.randomTexture())
      })

      this.createAndApplyTexture(this.randomTexture())
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
  #textureInput {
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
  #textureInput:hover {
    background-color: hsl(197, 45%, 49%);
    color: #fff;
  }
  input[type='file'] { font-size: 0; }
  ::file-selector-button { font-size: initial; }
</style>
