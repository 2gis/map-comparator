const mapglApi = {
    type: 'mapgl',

    map: undefined,
    container: undefined,

    init(elementId) {
        if (!window.mapgl) {
            return;
        }

        if (this.map && this.container) {
            this.container.style.display = 'block';
            this.update();
            return;
        }

        this.container = document.createElement('div');
        this.container.classList.add('map-container');

        const wrapper = document.getElementById(elementId);
        wrapper.appendChild(this.container);

        this.map = new mapgl.Map(this.container, {
            center: [state.lng, state.lat],
            zoom: state.zoom,
        });

        window.addEventListener('resize', () => this.map.invalidateSize());

        this.map.on('move', () => {
            const center = this.map.getCenter();
            window.updateAnotherMap(this, {
                lng: center[0],
                lat: center[1],
                zoom: this.map.getZoom(),
                rotation: this.map.getRotation(),
                pitch: this.map.getPitch(),
            });
        });
    },

    update() {
        if (!this.map) {
            return;
        }

        const { lng, lat, zoom, pitch, rotation } = state;
        this.map.setCenter([lng, lat], { animate: false });
        this.map.setZoom(zoom);
        this.map.setRotation(rotation, { animate: false });
        this.map.setPitch(pitch, { animate: false });
    },

    hide() {
        this.container.style.display = 'none';
    },
};
