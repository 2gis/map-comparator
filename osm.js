const osmApi = {
    type: "osm",
  
    map: undefined,
    container: undefined,
  
    init(elementId) {
      if (!window.L) {
        return;
      }
  
      if (this.map && this.container) {
        this.container.style.display = "block";
        this.update();
        return;
      }
  
      this.container = document.createElement("div");
      this.container.classList.add("map-container");
  
      const wrapper = document.getElementById(elementId);
      wrapper.appendChild(this.container);
  
      this.map = new window.L.Map(this.container, {
        center: [state.lat, state.lng],
        zoom: state.zoom,
        attributionControl: false,
      });
      window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        this.map
      );
  
      const onMove = () => {
        const center = this.map.getCenter();
  
        window.updateAnotherMap(this, {
          lng: center.lng,
          lat: center.lat,
          zoom: this.map.getZoom(),
          rotation: 0,
          pitch: 0,
        });
      };
  
      this.map.on("zoom", onMove);
      this.map.on("move", onMove);
    },
  
    update() {
      if (!this.map) {
        return;
      }
  
      this.map.setView([state.lat, state.lng], state.zoom);
    },
  
    hide() {
      if (this.container) {
        this.container.style.display = "none";
      }
    },
  };
  