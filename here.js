const hereApi = {
    type: 'here',

    map: undefined,
    container: undefined,

    init(elementId) {
        if (this.map && this.container) {
            this.update();
            return;
        }

        this.container = document.createElement('div');
        this.container.classList.add('map-container');

        const wrapper = document.getElementById(elementId);
        wrapper.appendChild(this.container);

        const platform = new H.service.Platform({
            apikey: 'H1o40dF42gBblCC0GUAH_qtINc_siLJD3nmbBhoz-j4',
        });
        const maptypes = platform.createDefaultLayers();
        this.map = new H.Map(this.container, maptypes.vector.normal.map, {
            zoom: state.zoom,
            center: { lng: state.lng, lat: state.lat },
        });

        window.addEventListener('resize', () => this.map.getViewPort().resize());

        new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
        this.map.addEventListener('mapviewchange', () => {
            const center = this.map.getCenter();
            window.updateAnotherMap(this, {
                lng: center.lng,
                lat: center.lat,
                zoom: this.map.getZoom(),
                rotation: 0,
                pitch: 0,
            });
        });
    },

    update() {
        if (!this.map) {
            return;
        }

        const { lng, lat, zoom } = state;
        this.map.setCenter({ lng, lat });
        this.map.setZoom(zoom);
    },

    hide() {
        if (this.container && this.map) {
            this.map.dispose();
            this.container.parentElement.removeChild(this.container);
            this.map = undefined;
            this.container = undefined;
        }
    },
};
