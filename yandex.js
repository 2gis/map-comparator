const yandexApi = {
    type: 'yandex',

    map: undefined,
    container: undefined,

    init(elementId) {
        if (!window.ymaps || !window.ymaps.Map) {
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

        this.map = new ymaps.Map(this.container, {
            center: [state.lat, state.lng],
            zoom: state.zoom,
            controls: ['zoomControl', 'typeSelector'],
        });

        const typeSelector = this.map.controls.get('typeSelector');
        typeSelector.options.set('position', { top: 10, left: 10 });

        this.map.events.add('boundschange', () => {
            const center = this.map.getCenter();
            window.updateAnotherMap(this, {
                lng: center[1],
                lat: center[0],
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
        this.map.setCenter([lat, lng]);
        this.map.setZoom(zoom);
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
