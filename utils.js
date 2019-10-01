(() => {
    function coordinatesPrecision(zoom) {
        return Math.ceil((zoom * Math.LN2 + Math.log(256 / 360 / 0.5)) / Math.LN10);
    }

    window.parseQuery = () => {
        const res = {};
        location.search
            .slice(1)
            .split('&')
            .map((str) => str.split('='))
            .forEach((couple) => {
                res[couple[0]] = couple[1];
            });
        return res;
    };

    window.buildQuery = (options, compare) => {
        const params = [];

        const rotation = Math.round(options.rotation);
        const pitch = Math.round(options.pitch);
        const precision = coordinatesPrecision(options.zoom);

        params.push(
            { key: 'lng', value: options.lng.toFixed(precision) },
            { key: 'lat', value: options.lat.toFixed(precision) },
            { key: 'zoom', value: options.zoom.toFixed(3) },
        );

        if (rotation !== 0) {
            params.push({
                key: 'rotation',
                value: rotation.toString(),
            });
        }

        if (pitch !== 0) {
            params.push({
                key: 'pitch',
                value: pitch.toString(),
            });
        }

        params.push({ key: 'compare', value: compare });

        return params.reduce((string, param, index) => {
            return string + (index === 0 ? '?' : '&') + param.key + '=' + param.value;
        }, '');
    };
})();
