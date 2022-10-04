(() => {
    window.state = {
        lng: 55.14903,
        lat: 25.08736,
        zoom: 17,
        rotation: 0,
        pitch: 0,
        lang: 'en',
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
    if (query.lang !== undefined) {
        state.lang = query.lang;
    }

    const list = {
        google: googleApi,
        mapbox: mapboxApi,
        here: hereApi,
        yandex: yandexApi,
    };

    const firstApi = mapglApi;
    let secondApi = list.google;
    if (query.compare !== undefined && list[query.compare]) {
        secondApi = list[query.compare];
    }

    let updateUrlTimeout;
    function updateUrl() {
        history.replaceState({}, document.title, window.buildQuery(state, secondApi.type));
    }
    function lazyUpdateUrl() {
        if (updateUrlTimeout) {
            return;
        }

        updateUrlTimeout = setTimeout(() => {
            updateUrl();
            updateUrlTimeout = undefined;
        }, 1000);
    }

    let activeApi;
    let activeTimeout;

    /**
     * Функцию обновляет положение карты, с которой пользователь сейчас не взаимодействует
     * Считается, что пользователь взаимодействует с конкретной картой, если:
     * 1. Другая карта не меняла своего положения в течении последних 200 мс
     * 2. Ее положение изменилось
     */
    window.updateAnotherMap = (api, params) => {
        if (activeApi === undefined || activeApi === api) {
            activeApi = api;
            clearTimeout(activeTimeout);
            activeTimeout = setTimeout(() => {
                activeApi = undefined;
            }, 200);

            state.lng = params.lng;
            state.lat = params.lat;
            state.zoom = params.zoom;
            state.rotation = params.rotation;
            state.pitch = params.pitch;

            lazyUpdateUrl();
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

    const secondApiSelect = document.getElementById('apiSelect');
    for (const name in list) {
        const option = document.createElement('option');
        option.value = name;
        option.text = name;
        secondApiSelect.appendChild(option);
    }

    const secondApiOnChange = () => {
        if (secondApi) {
            secondApi.hide();
        }

        secondApi = list[secondApiSelect.value];
        secondApi.init('map2');

        lazyUpdateUrl();
    };

    secondApiSelect.addEventListener('change', secondApiOnChange);
    secondApiSelect.value = secondApi.type;

    const langSelect = document.getElementById('langSelect');
    for (const lang of ['en', 'ar', 'ru']) {
        const option = document.createElement('option');
        option.value = lang;
        option.text = lang;
        langSelect.appendChild(option);
    }
    langSelect.addEventListener('change', () => {
        state.lang = langSelect.value;
        updateUrl();
        location.reload();
    });
    langSelect.value = state.lang;

    // Вставляем тег google api, потому что только там язык указывается
    const googleScriptTag = document.createElement('script');
    googleScriptTag.setAttribute(
        'src',
        `https://maps.googleapis.com/maps/api/js?key=AIzaSyDHYsg3_w2BODxtEBatRKHeNKm1Z8ZLRdY&callback=apiLoaded&language=${state.lang}`,
    );
    googleScriptTag.setAttribute('async', '');
    googleScriptTag.setAttribute('defer', '');
    document.head.appendChild(googleScriptTag);

    // Вставляем тег yandex api, потому что только там язык указывается
    const yandexScriptTag = document.createElement('script');
    yandexScriptTag.setAttribute(
        'src',
        `https://api-maps.yandex.ru/2.1/?onload=apiLoaded&apikey=0bd53f41-0662-4ef9-a4b2-d4a6d074c1c2&lang=${state.lang}`,
    );
    yandexScriptTag.setAttribute('async', '');
    yandexScriptTag.setAttribute('defer', '');
    document.head.appendChild(yandexScriptTag);

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
