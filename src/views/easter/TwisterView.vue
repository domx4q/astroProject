<template>
  <ThemeSwitch only-logic/>
  <div id="container" :class="{mobile:isMobile, computer:!isMobile}">
    <div id="controls">
      <FormKit
        type="taglist"
        name="colors"
        label="Farben"
        v-model="colors"
        :options="defaultColors"
        :allow-new-values="true"
        multiple
        empty-message="Keine Farben gefunden"
        :close-on-select="false"
        />
      <FormKit
        type="checkbox"
        name="climbing"
        :label="climbing ? 'Klettern' : 'Bouldern'"
        v-model="climbing"
        />

      <FormKit
        type="button"
        label="🎲 Würfeln"
        @click="roll"
        style="width: 100%"
        />
    </div>
    <hr v-if="isMobile">
    <div id="content">
      <h1>
        <span id="body">{{bodyResult}} </span> <span v-if="showColorPrefix" id="prefix">{{ prefixText }}</span> <span id="condition">{{conditionResult}}</span>
      </h1>
    </div>
  </div>
</template>

<script>
import Chance from 'chance';
import defaults from "@/mixins/defaults";

import ThemeSwitch from "@/components/themeSwitch.vue";

export default {
  name: 'TwisterView',
  components: {ThemeSwitch},
  mixins: [defaults],
  data() {
    return {
      bodyParts: [
        {name: 'Kopf', color: 'red', probability: .5},

        {name: 'Linke Hand', color: 'blue', probability: 2},
        {name: 'Rechte Hand', color: 'blue', probability: 2},
        {name: 'Linker Fuß', color: 'green', probability: 2},
        {name: 'Rechter Fuß', color: 'green', probability: 2},

        {name: "Beide Füße", color: 'yellow', probability: 1},
        {name: "Beide Hände", color: 'yellow', probability: 1},
        {name: "Rechte Seite", color: 'orange', probability: 1},
        {name: "Linke Seite", color: 'orange', probability: 1},

        {name: "Rechte Hand und Linker Fuß", color: 'purple', probability: 1},
        {name: "Linke Hand und Rechter Fuß", color: 'purple', probability: 1},

        {name: "Joker", color: 'aquamarine', probability: 1.5},
      ],
      baseConditions: [
        {name: "Stein-Wechsel", probability: 1},
        {name: "Farb-Wechsel", probability: 1},

        {name: "Höher", probability: 1, type: "direction"},
        {name: "Tiefer", probability: 1, type: "direction"},
        {name: "Rechts", probability: 1, type: "direction"},
        {name: "Links", probability: 1, type: "direction"},

        {name: "Seil-setzten 1m", probability: .5, type: "rope"},
        {name: "Seil-setzten 2m", probability: .5, type: "rope"},
        {name: "Neuanfang", probability: .5, type: "boulder"},

        {name: "Joker", probability: 1.5},
        {name: "Wand", probability: .75},

        {name: "Free for all", probability: .25, type: "alone"},
      ],

      colors: [],
      colorProbability: 2,
      defaultColors: ["Rot", "Blau", "Grün", "Gelb", "Orange", "Lila"],
      bodyResult: "",
      conditionResult: "",
      prefixText: "auf",
      showColorPrefix: false,

      climbing: false,
    }
  },
  methods: {
    normalizeProbabilities(parts) {
      const totalProbability = parts.reduce((sum, part) => sum + part.probability, 0);
      return parts.map(part => ({
        ...part,
        normalizedProbability: part.probability / totalProbability
      }));
    },
    pickRandom(parts) {
      const chance = new Chance();
      const normalizedParts = this.normalizeProbabilities(parts);

      const partNames = normalizedParts.map(part => part.name);
      const probabilities = normalizedParts.map(part => part.normalizedProbability);

      const randomIndex = chance.weighted(partNames, probabilities);

      return normalizedParts.find(part => part.name === randomIndex);
    },
    roll() {
      const bodyPart = this.pickRandom(this.bodyParts);
      const condition = this.pickRandom(this.conditions);

      if (["rope", "boulder", "alone"].includes(condition.type)) {
        this.bodyResult = ""
      } else {
        this.bodyResult = bodyPart.name;
      }
      this.conditionResult = condition.name;

      this.showColorPrefix = true;
      if (condition.type === "color") {
        this.prefixText = "auf";
      } else if (condition.type === "direction") {
        this.prefixText = "nach";
      }
      else {
        this.prefixText = "";
        this.showColorPrefix = false;
      }
    }
  },
  computed: {
    conditions() {
      let temp = this.baseConditions;
      if (this.climbing) {
        temp = temp.filter(condition => condition.type !== "boulder");
      } else {
        temp = temp.filter(condition => condition.type !== "rope");
      }
      // append colors with probability
      for (let color of this.colors) {
        temp.push({name: color, probability: this.colorProbability, type: "color"});
      }
      return temp;
    },
  }
}
</script>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  font-size: 1.1em;
  font-family: "Roboto", sans-serif;
  font-weight: bold;
  color: hsl(216, 78%, 55%);
  background-color: black;
}
.computer #controls {
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  padding: 10px;
  height: 100%;
  width: calc(15% - 2 * 10px);
}
.computer #content {
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: calc(85% - 2 * 10px);
  height: 100%;
  right: 0;
  top: 0;
  text-align: center;
  position: fixed;
}
.mobile #controls {
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: calc(100% - 2 * 10px);
}
.mobile h1 {
  align-self: center;
  text-align: center;
}

#body {
  color: red;
}
#condition {
  color: blue;
}
#prefix {
  color: white;
}
</style>