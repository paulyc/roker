// The magic code
var oldAddEventListener = EventTarget.prototype.addEventListener;

EventTarget.prototype.addEventListener = function(eventName, eventHandler)
{
  oldAddEventListener.call(this, eventName, function(event) {
    console.log(event);
      eventHandler(event);
  });
};

import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		//name: 'world'
	}
});

export default app;
