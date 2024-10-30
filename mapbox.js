const mapboxApi = {
    type: 'mapbox',

    map: undefined,
    container: undefined,

    init(elementId) {
        if (!window.mapboxgl) {
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

        mapboxgl.accessToken =
            'pk.eyJ1IjoidHJ1ZmkiLCJhIjoiY2lrcW1pdzU4MDEyanUwbTIwZzJ1bmY4dSJ9.5qW-pRcgah2nQIWpGKwHRg';
        mapboxgl.setRTLTextPlugin(
            'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
            null,
        );

        this.map = new mapboxgl.Map({
            center: [state.lng, state.lat],
            zoom: state.zoom - 1,
            pitch: state.pitch,
            bearing: -state.rotation,
            container: this.container,
        });

        this.map.once('load', () => {
            // Костыль меняющий язык в карте с английского на нужный
            const style = this.map.getStyle();
            const newStyle = JSON.parse(
                JSON.stringify(style).replaceAll('name_en', `name_${state.lang}`),
            );
            this.map.setStyle(newStyle);
        });

        this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

        this.map.on('move', () => {
            const center = this.map.getCenter();
            updateAnotherMap(this, {
                lng: center.lng,
                lat: center.lat,
                zoom: this.map.getZoom() + 1,
                rotation: -this.map.getBearing(),
                pitch: this.map.getPitch(),
            });
        });
    },

    update() {
        if (!this.map) {
            return;
        }

        const { lng, lat, zoom, pitch, rotation } = state;
        this.map.setCenter([lng, lat]);
        this.map.setZoom(zoom - 1);
        this.map.setPitch(pitch);
        this.map.setBearing(-rotation);
    },

    hide() {
        if (this.container && this.map) {
            this.map.remove();
            this.container.parentElement.removeChild(this.container);
            this.map = undefined;
            this.container = undefined;
        }
    },
};
