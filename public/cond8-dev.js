// public/cond8-dev.js
document.fonts.ready.then(() => {
  document.documentElement.classList.add('fonts-loaded');
});

Promise.race([
  document.fonts.ready,
  new Promise(res => setTimeout(res, 1000)),
]).then(() => {
  document.documentElement.classList.add('fonts-loaded');
});

/**
 * DEVELOPMENT ONLY
 */
let socket;
let reconnecting = false;

function connect() {
  socket = new WebSocket('ws://localhost:1337');

  socket.onopen = () => {
    console.log('[Dev] Connected to reload server');

    // If we just reconnected, now reload the page
    if (reconnecting) {
      console.log('[Dev] Reconnected — reloading...');
      location.reload();
    }
  };

  socket.onclose = () => {
    console.warn('[Dev] Connection lost. Attempting to reconnect...');
    reconnecting = true;

    // Try reconnecting every second
    setTimeout(connect, 1000);
  };

  socket.onerror = err => {
    console.error('[Dev] WebSocket error:', err);
    socket.close();
  };
}

connect();
