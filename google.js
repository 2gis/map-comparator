const googleApi = {
    type: 'google',

    map: undefined,
    container: undefined,

    init(elementId) {
        if (!window.google) {
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

        this.map = new google.maps.Map(this.container, {
            center: { lng: state.lng, lat: state.lat },
            zoom: state.zoom,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
        });

        const onMove = () => {
            const center = this.map.getCenter();
            window.updateAnotherMap(this, {
                lng: center.lng(),
                lat: center.lat(),
                zoom: this.map.getZoom(),
                rotation: 0,
                pitch: 0,
            });
        };
        this.map.addListener('center_changed', onMove);
        this.map.addListener('zoom_changed', onMove);
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
        if (this.container) {
            this.container.style.display = 'none';
        }
    },
};
