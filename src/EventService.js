class EventService {
  // FIXME: Maybe make some Promise Based event subscriber? 
  // Probably not yet  🥴;

  constructor(config) {
    this.addEventListener = this.addEventListener.bind(this)
    this.listener = this.listener.bind(this);
    this.listeners = {}
    this.config = config;
  }


  bindEventListener(eventName, handler) {
    this.listeners[eventName] = handler;
  }

  listener(event) {
    if (this.listeners[event.data]) {
      this.listeners[event.data](this.config)
    }
  }

  addEventListener() {
    if (window.addEventListener) {
      window.addEventListener("message", this.listener);
    } else {
      // IE8
      window.attachEvent("onmessage", this.listener);
    }
  }
}

export default EventService  