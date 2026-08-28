/**
 * Pre-React loading screen.
 *
 * Deliberately minimal: a single brand-coloured bar that sweeps until the
 * React bundle takes over. An earlier pixel heart->logo animation was
 * removed along with the rest of that branding.
 *
 * Contract (unchanged, and depended on by dynamic-main-content.tsx and
 * blocks/index.tsx): this script defines window.__removeLoadingScreen(),
 * which fades the screen out and removes it. It must stay safe to call more
 * than once, and safe to call before this script has finished running.
 */
(function () {
  var host = document.getElementById("app-loading");
  if (!host) return;

  var FADE_MS = 260;

  var wrap = document.createElement("div");
  wrap.style.cssText =
    "display:flex;flex-direction:column;align-items:center;gap:18px;" +
    "font-family:'Comfortaa','Inter',ui-sans-serif,system-ui,sans-serif";

  var mark = document.createElement("div");
  mark.textContent = "Vaidyuti";
  mark.style.cssText =
    "font-size:28px;font-weight:700;letter-spacing:0.01em;" +
    "color:var(--loading-fg,#141704)";

  var track = document.createElement("div");
  track.style.cssText =
    "position:relative;width:180px;height:3px;overflow:hidden;" +
    "background:var(--loading-track,rgba(0,0,0,0.10))";

  var bar = document.createElement("div");
  bar.style.cssText =
    "position:absolute;top:0;left:0;height:100%;width:40%;" +
    "background:#EEFF41;will-change:transform";

  track.appendChild(bar);
  wrap.appendChild(mark);
  wrap.appendChild(track);
  host.appendChild(wrap);

  // Sweep via requestAnimationFrame rather than a CSS keyframe so no stylesheet
  // is required before the bundle loads.
  var start = null;
  var rafId = null;
  var running = true;

  function frame(ts) {
    if (!running) return;
    if (start === null) start = ts;
    var t = ((ts - start) % 1100) / 1100;
    // ease-in-out, travelling left edge -180% -> 250%
    var e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    bar.style.transform = "translateX(" + (-180 + e * 430) + "%)";
    rafId = window.requestAnimationFrame(frame);
  }
  rafId = window.requestAnimationFrame(frame);

  var removed = false;
  window.__removeLoadingScreen = function () {
    if (removed) return;
    removed = true;
    running = false;
    if (rafId !== null) window.cancelAnimationFrame(rafId);

    host.style.transition = "opacity " + FADE_MS + "ms ease";
    host.style.opacity = "0";
    window.setTimeout(function () {
      if (host && host.parentNode) host.parentNode.removeChild(host);
    }, FADE_MS);
  };
})();
