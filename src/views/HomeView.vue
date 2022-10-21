<template>
<!--  <model-viewer-->
<!--      :src="modelSrc"-->
<!--      alt="A 3D model of an astronaut"-->
<!--      ar-->
<!--      ar-modes="webxr scene-viewer quick-look"-->
<!--      touch-action="pan-x"-->
<!--      camera-controls-->
<!--      auto-rotate-->
<!--      shadow-intensity="1"-->
<!--      exposure="1"-->
<!--      environment-image="neutral"-->
<!--      background-color="transparent"-->
<!--      poster="https://modelviewer.dev/shared-assets/models/Astronaut.png"-->
<!--      ios-src="https://modelviewer.dev/shared-assets/models/Astronaut.usdz"-->

<!--      id="planet"-->
<!--      style="width: 100%; height: 100vh"-->

<!--      @load="updatePlanet">-->
<!--    <div class="controls">-->
<!--      <input type="file" @change="onFileChange"/>-->
<!--    </div>-->
<!--    <button slot="ar-button" id="ar-button"></button>-->
<!--  </model-viewer>-->
  <model-viewer src="models/astronaut.glb" ar ar-modes="webxr scene-viewer quick-look" camera-controls poster="poster.webp" shadow-intensity="1">
    <div class="progress-bar hide" slot="progress-bar">
      <div class="update-bar"></div>
    </div>
    <button slot="ar-button" id="ar-button">
      View in your space
    </button>
    <div id="ar-prompt">
      <img src="https://modelviewer.dev/shared-assets/icons/hand.png">
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
