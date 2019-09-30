(() => {
    window.state = {
        lng: 55.14903,
        lat: 25.08736,
        zoom: 17,
        rotation: 0,
        pitch: 0,
    };

    const firstApi = mapglApi;
    let secondApi;

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

    const list = {
        Google: googleApi,
        Mapbox: mapboxApi,
    };

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
    };

    select.addEventListener('change', onChange);

    select.value = Object.keys(list)[0];
    onChange();

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
