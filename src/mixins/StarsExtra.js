export default {
  data() {
    const planets = [
      {
        id: 'merkur',
        altText: 'Merkur',
        src: require("@/assets/extra/images/planets/mercury-from-messenger-pia15160-1920x640-1_DOWNSIZED.png"),
      },
      {
        id: 'venus',
        altText: 'Venus',
        src: require("@/assets/extra/images/planets/Venus_Earth_Comparison_DOWNSIZED.png"),
      },
      {
        id: 'mars',
        altText: 'Mars',
        src: require("@/assets/extra/images/planets/OSIRIS_Mars_true_color_DOWNSIZED.png"),
      },
      {
        id: 'jupiter',
        altText: 'Jupiter',
        src: require("@/assets/extra/images/planets/jupiter-mainIcon_DOWNSIZED.png"),
      },
      {
        id: 'saturn',
        altText: 'Saturn',
        src: require("@/assets/extra/images/planets/heic1917a_DOWNSIZED.png"),
      },
      {
        id: 'neptun',
        altText: 'Neptun',
        src: require("@/assets/extra/images/planets/neptunex_DOWNSIZED.png"),
      },
      {
        id: 'uranus',
        altText: 'Uranus',
        src: require("@/assets/extra/images/planets/Uranus2_DOWNSIZED.png"),
      },
      {
        id: 'pluto',
        altText: 'Pluto',
        src: require("@/assets/extra/images/planets/PlutoEnhancedHiRes_NewHorizons_5000_DOWNSIZED.png"),
      }
    ];
    return {
      planets: planets.map(planet => ({ ...planet, placed: false, position: { x: 0, y: 0,adaptedSize: null}})),
    }
  },
  computed: {
    placedPlanets() {
      return this.planets.filter(planet => planet.placed);
    },
    unplacedPlanets() {
      return this.planets.filter(planet => !planet.placed);
    }
  },
}
