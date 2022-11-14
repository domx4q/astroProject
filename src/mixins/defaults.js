export default {
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
    }
};
