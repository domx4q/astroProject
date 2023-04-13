<template>
    <div id="all" v-if="!admin">
        <main>
            <div id="showAnswer" v-if="showAnswer"><span id="pre">The answer is: </span><br><span id="answer">{{ answer }}</span></div>
            <div id="showTimer" v-else>
                <span id="pre">The answer will be revealed in: </span><br>
                <span id="answer" class="notCool">{{ niceFormatedTimeLeft }}</span>
            </div>
        </main>
    </div>
    <div id="all" v-else>
        <main>
            <input type="datetime-local" id="datetimeIn" v-model="dateTimeIn">
            <select v-model="answerIn">
                <option v-for="(value, key) in possibleAnswers" :value="key">{{ value }}</option>
            </select>
            <button @click="generateToken">Generate Token</button>
            <span id="pre">The token is: </span><span id="answer">{{ generatedToken }}</span>
        </main>
    </div>
</template>

<script>
export default {
    name: 'RevealView',
    props: {
        token: {
            type: String,
            required: true
        },
        admin: {
            type: Boolean,
            required: false
        }
    },
    data() {
        return {
            reveal: false,

            dateTimeIn: '',
            answerIn: '',
            generatedToken: '',

            timeLeft: 0,
            timePassed: false,

            possibleAnswers: {
                "01": "ja",
                "02": "nein",
                "03": "vielleicht",
                "04": "wenn es sein muss",
                "05": "okay",
            }
        }
    },
    methods: {
        // token Format: unix-timestamp-x(random number 2 digits)answerCode(random number 2 digits)
        generateToken() {
            let timestamp = this.convertToUnixTimestamp(new Date(this.dateTimeIn));
            if (this.dateTimeIn === '') {
                let date = new Date();
                timestamp = date.getTime();
            }
            if (this.answerIn === '') {
                alert('Please select an answer code!');
                return;
            }
            const random1 = Math.floor(Math.random() * 100)-1;
            random1.toString().padStart(2, '0');
            const random2 = Math.floor(Math.random() * 100)-1;
            random2.toString().padStart(2, '0');
            const answerCode = this.answerIn;
            this.generatedToken = `${timestamp}-${random1}${answerCode}${random2}`;
            return this.generatedToken;
        },
        convertToUnixTimestamp(date) {
            return date.getTime();
        },

        calculateTimeLeft() {
            let timeLeft = this.tokenDate - new Date();
            timeLeft = Math.floor(timeLeft / 1000);
            this.timeLeft = timeLeft;
            return timeLeft;
        }
    },
    computed: {
        answer() {
            if (!this.timePassed) return '';
            let indexOfFirstDash = this.token.indexOf('-');

            return this.possibleAnswers[this.token.substring(indexOfFirstDash + 3, indexOfFirstDash + 5)];
        },
        tokenDate() {
            let indexofFirstDash = this.token.indexOf('-');
            let timestamp = this.token.substring(0, indexofFirstDash);
            return new Date(parseInt(timestamp));
        },
        showAnswer() {
            return this.timeLeft <= 0;
        },

        niceFormatedTimeLeft() {
            let timeLeft = this.timeLeft;
            let seconds = timeLeft % 60;
            timeLeft = (timeLeft - seconds) / 60;
            let minutes = timeLeft % 60;
            timeLeft = (timeLeft - minutes) / 60;
            let hours = timeLeft % 24;
            timeLeft = (timeLeft - hours) / 24;
            let days = timeLeft;
            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    },
    mounted() {
        setInterval(() => {
            this.calculateTimeLeft();
        }, 1000);

        setTimeout(() => {
            this.timePassed = true;
        }, 6000); // to prevent the answer from being shown before the timer is shown
    },
    watch: {}
}
</script>

<style scoped>
#all {
    height: 100vh;
    width: 100vw;
    background-color: #000;
    color: #fff;
    font-size: 5rem;
    font-family: 'Roboto', sans-serif;
}
main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 70%;
}
#pre {
    font-size: 2rem;
}
#answer {
    font-size: 5rem;
    /*upper*/
    text-transform: uppercase;
}
#answer.notCool {
    text-transform: none;
}
</style>
