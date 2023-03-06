export default {
    data() {
        return {
            version: "x.x.x",

            __resizeUUID: this.genUUID(),
        }
    },
    mounted() {
        import("../../package.json").then(pkg => {
            this.version = pkg.version;
        })

        window.addEventListener("resize", this.__onResize);
    },
    computed: {
        isProduction() {
            return process.env.NODE_ENV === "production";
        },
        isMobile() {
            return this.$store.state.client.isMobile
        },
        theme() {
            return this.$store.state.theme
        },
        beta() {
            return this.version[0] < 1;
        },

        screenSize() {
            const uuid = this.__resizeUUID; // through this dependency, the computed property will be re-evaluated on resize
            return {
                x: window.innerWidth,
                y: window.innerHeight,

                width: window.innerWidth,
                height: window.innerHeight,
            }
        }
    },
    methods: {
        genUUID: () => {
            let d = new Date().getTime();
            let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == "x" ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        },
        mod(n, m) {
            return ((n % m) + m) % m;
        },
        download(filename, text) {
            var element = document.createElement("a");
            element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
            element.setAttribute("download", filename);

            element.style.display = "none";
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        },
        formatJSON(json, newLineDot = false) {
            let jsonA = json
            if (newLineDot) {
                jsonA = jsonA.replaceAll(". ", ".<br>")
            }
            jsonA = jsonA
                .replaceAll("\n", "<br>")
                .replaceAll("<accent>", "<span class='accent'>")
                .replaceAll("</accent>", "</span>")
                .replaceAll("<highlight>", "<span class='highlight'>")
                .replaceAll("</highlight>", "</span>")

                .replaceAll("<space>", " ")
            return jsonA
        },
        radiantToDegrees(radians) {
            return radians * (180 / Math.PI);
        },

        __onResize() {
            this.__resizeUUID = this.genUUID();
        },
        round(number, digits=2, asNum=false){
            const out = Number(number).toFixed(digits);
            if (asNum) {
                return Number(out);
            }
            return out;
        }
    }
};
