function deg2Rad(deg) {
    return deg * Math.PI / 180;
}

function rad2Deg(rad) {
    return rad * 180 / Math.PI;
}

const yandexApi = {
    type: 'yandex',

    map: undefined,
    container: undefined,

    init(elementId) {
        if (!window.ymaps3 || !window.ymaps3.YMap || !window.ymaps3.YMapZoomControl) {
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

        this.map = new ymaps3.YMap(this.container, {
            location: {
                center: [state.lng, state.lat],
                zoom: state.zoom,
            },
            camera: {
                azimuth: deg2Rad(state.rotation),
                tilt: deg2Rad(state.pitch), 
            },
            behaviors: [
                'drag',
                'pinchZoom',
                'scrollZoom',
                'dblClick',
                'magnifier',
                'mouseRotate',
                'mouseTilt',
                'pinchRotate',
                'panTilt',
            ],
            mode: 'vector',
        });

        const controls = new ymaps3.YMapControls({
            position: 'top left',
            orientation: 'vertical',
        });
        controls.addChild(
            new ymaps3.YMapZoomControl({ easing: 'linear' })
        );
        this.map.addChild(controls);

        this.map.addChild(new ymaps3.YMapDefaultSchemeLayer({ theme: state.theme }));
        this.map.addChild(
            new ymaps3.YMapListener({
                onUpdate: () => {
                    window.updateAnotherMap(this, {
                        lng: this.map.center[0],
                        lat: this.map.center[1],
                        zoom: this.map.zoom,
                        rotation: rad2Deg(this.map.azimuth),
                        pitch: rad2Deg(this.map.tilt),
                    });
                },
            })
        );
    },

    update() {
        if (!this.map || !window.ymaps3.YMapDefaultSchemeLayer) {
            return;
        }

        this.map.update({
            location: {
                center: [state.lng, state.lat],
                zoom: state.zoom,
            },
            camera: {
                azimuth: deg2Rad(state.rotation),
                tilt: deg2Rad(state.pitch), 
            },
        });

        this.map.children.forEach((child) => {
            if (child instanceof ymaps3.YMapDefaultSchemeLayer) {
                child.update({ theme: state.theme });
            }
        })
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
