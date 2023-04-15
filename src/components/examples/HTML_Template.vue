<template>
  <div id="content">
    <p>
      Die Nachricht lautet: <b>{{ message }}</b>
    </p>
    <DynamicButton color="orange" text="Text ändern" @clicked="changeText()" />
    <hr>
    <p>Ein Element kann auch durch html Templates wiederholt werden.</p>
    <span v-for="n in 5" :key="n">Wiederholung: {{ n }}<br></span>
      <hr>
      <p>Nun noch ein kleines Beispiel mit "v-model" und if statements<br>
      Durch diese kann man nicht nur den Text ersetzen, wonach es hier eventuell aussieht, sondern ganze bereiche ersetzen.</p>
      <input type="checkbox" v-model="ifTest" name="IF"/>
      <label for="IF">Zum ändern der zu überprüfenden Variable</label><br>
      <p style="color: #008200" v-if="ifTest">Dieser Text wird angezeigt, wenn die Checkbox <b><u>an</u></b> ist.</p>
      <p style="color: #ff0000" v-else>Dieser Text wird angezeigt, wenn die Checkbox <b><u>aus</u></b> ist.</p>
  </div>
</template>

<script>
import DynamicButton from "@/components/examples/Dynamic Button.vue";

export default {
  name: "HTML_Template",
  components: {
    DynamicButton,
  },
  data() {
    return {
      message: "Das ist der Inhalt einer Variable",

      currentIndex: 0,
      ifTest: true,
    };
  },
  methods: {
    changeText() {
      let options = [
        "Das ist der Inhalt einer Variable",
        "Das ist ein Beispiel Text",
        "Platzhalter",
        "Lorem Ipsum",
      ];
      let randomIndex = Math.floor(Math.random() * options.length);
      if (randomIndex === this.currentIndex) {
        randomIndex = (randomIndex + 1) % options.length;
      }
      this.currentIndex = randomIndex;
      this.message = options[randomIndex];
    },
  },
};
</script>

<style scoped>
#content {
  margin-top: 10px;
  padding: 5px 20px 20px;
  background-color: #bee2ee; /* light blue */
  border-radius: 10px;
  width: fit-content;
}
</style>
