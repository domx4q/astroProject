<template>
    <div class="content">
        <p>Hier kommt der HTML Template Code rein</p><hr class="maxWidth bold">
        <p>Das sind statische Buttons, diese bleiben immer gleich</p>
        <div class="inline">
            <StaticButton @clicked="test('Static Button clicked')"/>
            <StaticButton @clicked="test('Static Button clicked')"/>
        </div>
        <p>Das sind dynamische Buttons, diese kann man durch einfache Parameter verändern.<br>
        So kann ich Beispielsweise die Farbe, oder den Text ändern.</p>
        <div class="inline">
            <DynamicButton color="darkblue" text="Dieser Text ist variabel" @clicked="test('Dynamic Button clicked')"/>
            <DynamicButton color="tomato" :text="'Counter: ' + counter" @clicked="counter++"/>
        </div>
        <hr>
        Der folgende Inhalt ist aus dem HTML Template Beispiel
        <HTML_Template/>
    </div>
</template>

<script>
// Hier findet die Logik statt
import StaticButton from "@/components/examples/StaticButton.vue";
import DynamicButton from "@/components/examples/Dynamic Button.vue";
import HTML_Template from "@/components/examples/HTML_Template.vue";

export default {
    name: "ExampleView",
    components: {
        StaticButton,
        DynamicButton,
        HTML_Template
    },
    data() {
        return {
            counter: 0
        }
    },
    methods: {
        test(message) {
            alert(message)
        }
    },
    computed: {},
    mounted() {
    },
    watch: {},
}
</script>

<style scoped>
/* Hier kommt der CSS Code rein, also die Styles */
.content {
    padding: 5px 20px 20px;
    background-color: #fff;

    height: 100vh;
    width: 100vw;
}
hr.maxWidth {
    width: 100vw;
    margin-left: -20px;
    margin-bottom: 15px;
}
hr.bold {
    border-top: 2px solid #000;
}
div.inline {
    display: inline-flex;
    gap: 10px;
}
</style>
