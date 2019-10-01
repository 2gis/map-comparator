(() => {
    window.state = {
        lng: 55.14903,
        lat: 25.08736,
        zoom: 17,
        rotation: 0,
        pitch: 0,
    };

    const query = window.parseQuery();
    if (query.lng !== undefined) {
        state.lng = parseFloat(query.lng);
    }
    if (query.lat !== undefined) {
        state.lat = parseFloat(query.lat);
    }
    if (query.zoom !== undefined) {
        state.zoom = parseFloat(query.zoom);
    }
    if (query.rotation !== undefined) {
        state.rotation = parseFloat(query.rotation);
    }
    if (query.pitch !== undefined) {
        state.pitch = parseFloat(query.pitch);
    }

    const list = {
        google: googleApi,
        mapbox: mapboxApi,
    };

    const firstApi = mapglApi;
    let secondApi = list.google;
    if (query.compare !== undefined && list[query.compare]) {
        secondApi = list[query.compare];
    }

    let activeApi;
    let activeTimeout;

    /**
     * Функцию обновляет положение карты, с которой пользователь сейчас не взаимодействует
     * Считается, что пользователь взаимодействует с конкретной картой, если:
     * 1. Другая карта не меняла своего положения в течении последних 500 секунд
     * 2. Ее положение изменилось
     */
    window.updateAnotherMap = (api, params) => {
        if (activeApi === undefined || activeApi === api) {
            activeApi = api;
            clearTimeout(activeTimeout);
            activeTimeout = setTimeout(() => {
                activeApi = undefined;
            }, 500);

            state.lng = params.lng;
            state.lat = params.lat;
            state.zoom = params.zoom;
            state.rotation = params.rotation;
            state.pitch = params.pitch;

            history.replaceState({}, document.title, window.buildQuery(params, secondApi.type));
        }

        if (firstApi === api) {
            if (secondApi && secondApi !== activeApi) {
                secondApi.update();
            }
        } else {
            if (firstApi && firstApi !== activeApi) {
                firstApi.update();
            }
        }
    };

    firstApi.init('map1');
    secondApi.init('map2');

    const select = document.getElementById('select');
    for (const name in list) {
        const option = document.createElement('option');
        option.value = name;
        option.text = name;
        select.appendChild(option);
    }

    const onChange = () => {
        if (secondApi) {
            secondApi.hide();
        }

        secondApi = list[select.value];
        secondApi.init('map2');

        history.replaceState({}, document.title, window.buildQuery(state, secondApi.type));
    };

    select.addEventListener('change', onChange);
    select.value = secondApi.type;

    /**
     * Callback, который вызывается по загрузке скриптов карт
     */
    window.apiLoaded = () => {
        if (firstApi && !firstApi.map) {
            firstApi.init('map1');
        }
        if (secondApi && !secondApi.map) {
            secondApi.init('map2');
        }
    };
})();
