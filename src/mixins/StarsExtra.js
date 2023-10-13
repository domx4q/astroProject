export default {
  data() {
    const planets = [
      {
        id: 'mars',
        altText: 'Mars',
        src: require("@/assets/extra/images/planets/OSIRIS_Mars_true_color_DOWNSIZED.png"),
      },
      {
        id: 'uranus',
        altText: 'Uranus',
        src: require("@/assets/extra/images/planets/Uranus2_DOWNSIZED.png"),
      }
    ];
    return {
      planets: planets.map(planet => ({ ...planet, placed: false })),
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
