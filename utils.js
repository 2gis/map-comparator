(() => {
    function coordinatesPrecision(zoom) {
        return Math.ceil((zoom * Math.LN2 + Math.log(256 / 360 / 0.5)) / Math.LN10);
    }

    window.buildNextURL = (options, compare) => {
        const nextURL = new URL(window.location.href);
        const searchParams = nextURL.searchParams;

        const rotation = Math.round(options.rotation);
        const pitch = Math.round(options.pitch);
        const precision = coordinatesPrecision(options.zoom);

        searchParams.set('lng', options.lng.toFixed(precision));
        searchParams.set('lat', options.lat.toFixed(precision));
        searchParams.set('zoom', options.zoom.toFixed(precision));

        if (rotation !== 0) {
            searchParams.set('rotation', rotation.toString());
        }

        if (pitch !== 0) {
            searchParams.set('pitch', pitch.toString());
        }

        searchParams.set('compare', compare);
        searchParams.set('lang', options.lang);

        return nextURL.toString();
    };
})();
