export default {
    data() {
        return {
            registration: null,
            updateExists: false,
        }
    },
    created() {
        document.addEventListener('swUpdated', this.updateAvailable, { once: true })
    },
    methods: {
        updateAvailable(event) {
            this.registration = event.detail
            this.updateExists = true
        }
    }
}
