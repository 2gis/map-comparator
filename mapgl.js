const mapglApi = {
    type: '2gis',

    map: undefined,
    container: undefined,

    init(elementId) {
        if (!window.mapgl) {
            return;
        }

        if (this.map && this.container) {
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
            rotation: state.rotation,
            pitch: state.pitch,
            zoomControl: false,
            key: '042b5b75-f847-4f2a-b695-b5f58adc9dfd',
            style: 'eb10e2c3-3c28-4b81-b74b-859c9c4cf47e',
            useRtlTextPlugin: 'always-on',
            lang: state.lang,
        });

        https: new mapgl.ZoomControl(this.map, { position: 'topLeft' });

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
        if (this.container && this.map) {
            this.map.destroy();
            this.container.parentElement.removeChild(this.container);
            this.map = undefined;
            this.container = undefined;
        }
    },
};
