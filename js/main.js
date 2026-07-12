// ===== Header: sistema fixo curto, so 3 cenas =====
(function () {
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function easeReveal(t) { return 1 - Math.pow(1 - t, 4); }

  var sceneRanges = { scene00: [0, 0.1595], sceneCasaCavo: [0.1595, 0.8236], scene01: [0.42, 0.6059] };
  var FUSION_SPAN = 0.133;
  var fusionRanges = {
    casaCavoEnter: [sceneRanges.scene00[1] - FUSION_SPAN * 0.6, sceneRanges.scene00[1] + FUSION_SPAN * 0.4],
    casaCavoExit: [sceneRanges.sceneCasaCavo[1] - FUSION_SPAN * 0.7, sceneRanges.sceneCasaCavo[1] + FUSION_SPAN * 0.5],
    heroExit: [sceneRanges.sceneCasaCavo[1] - FUSION_SPAN * 0.35, sceneRanges.sceneCasaCavo[1] + FUSION_SPAN * 0.75]
  };
  var lightStops = [0, 0.16, 1];
  var lightColors = ['#FBFAF8', '#F7F5F1', '#F7F5F1'];

  function hexToRgb(hex) { var v = parseInt(hex.slice(1), 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; }
  function lerpColor(t, stops, colors) {
    if (t <= stops[0]) return colors[0];
    if (t >= stops[stops.length - 1]) return colors[colors.length - 1];
    for (var i = 0; i < stops.length - 1; i++) {
      if (t >= stops[i] && t <= stops[i + 1]) {
        var lt = (t - stops[i]) / (stops[i + 1] - stops[i] || 1);
        var c1 = hexToRgb(colors[i]), c2 = hexToRgb(colors[i + 1]);
        return 'rgb(' + Math.round(c1[0] + (c2[0] - c1[0]) * lt) + ',' + Math.round(c1[1] + (c2[1] - c1[1]) * lt) + ',' + Math.round(c1[2] + (c2[2] - c1[2]) * lt) + ')';
      }
    }
    return colors[colors.length - 1];
  }

  var el = {};
  ['lightJourney', 'fusionShield', 'scene00', 'sceneCasaCavo', 'paperLayer', 'watercolorWrap', 'heroScrim', 'scene01', 'heroName', 'heroDate', 'heroLocation', 'scrollIndicator'].forEach(function (id) {
    el[id] = document.getElementById(id);
  });

  function fadeIn(node, t, from, to) {
    if (!node) return;
    var e = easeReveal(clamp((t - from) / (to - from || 1), 0, 1));
    node.style.opacity = e;
    node.style.transform = 'translateY(' + (16 * (1 - e)) + 'px)';
  }

  function updateHeader() {
    var headerEl = document.getElementById('headerScroll');
    if (!headerEl || !el.scene00) return;

    var headerHeight = headerEl.offsetHeight - window.innerHeight;
    var scrolled = clamp(window.scrollY, 0, headerHeight);
    var p = clamp(scrolled / (headerHeight || 1), 0, 1);

    if (el.lightJourney) el.lightJourney.style.background = lerpColor(p, lightStops, lightColors);

    var s0 = sceneRanges.scene00, s0span = s0[1] - s0[0];
    var holdEnd = s0[0] + s0span * 0.74;
    var dissolveEnd = fusionRanges.casaCavoEnter[1];
    var veilOpacity = p <= holdEnd ? 1 : clamp(1 - (p - holdEnd) / (dissolveEnd - holdEnd || 1), 0, 1);
    el.scene00.style.opacity = veilOpacity;
    el.scene00.style.filter = 'blur(' + ((1 - veilOpacity) * 16) + 'px)';
    if (veilOpacity === 0) el.scene00.style.pointerEvents = 'none';

    var cc = sceneRanges.sceneCasaCavo, ccSpan = cc[1] - cc[0];
    var en = fusionRanges.casaCavoEnter, ex = fusionRanges.casaCavoExit;
    var ccIn = clamp((p - en[0]) / (en[1] - en[0] || 1), 0, 1);
    var ccOut = clamp((p - ex[0]) / (ex[1] - ex[0] || 1), 0, 1);
    if (el.sceneCasaCavo) {
      el.sceneCasaCavo.style.opacity = ccIn * (1 - ccOut);
      el.sceneCasaCavo.style.filter = 'blur(' + (ccOut * 12) + 'px)';
    }

    if (el.paperLayer) {
      var paperPeak = cc[0] + ccSpan * 0.08, paperSettle = cc[0] + ccSpan * 0.22;
      var paperOp = p < paperPeak ? clamp((p - cc[0]) / (paperPeak - cc[0] || 1), 0, 1) * 0.5 : clamp(0.5 - (p - paperPeak) / (paperSettle - paperPeak || 1) * 0.36, 0.14, 0.5);
      el.paperLayer.style.opacity = paperOp;
    }

    if (el.watercolorWrap) {
      var wcStart = cc[0] + ccSpan * 0.05, wcFull = cc[0] + ccSpan * 0.26;
      var wcOp = clamp((p - wcStart) / (wcFull - wcStart || 1), 0, 1);
      el.watercolorWrap.style.opacity = wcOp;
      if (el.fusionShield) el.fusionShield.style.opacity = (veilOpacity < 1 && wcOp < 0.8) ? '1' : '0';
    }

    var heroR = sceneRanges.scene01, heroSpan = heroR[1] - heroR[0];
    if (el.heroScrim) {
      var scrimOp = clamp((p - (heroR[0] - ccSpan * 0.03)) / ((heroR[0] + ccSpan * 0.08) - (heroR[0] - ccSpan * 0.03) || 1), 0, 1);
      el.heroScrim.style.opacity = scrimOp;
    }

    if (el.scene01) {
      var heroEx = fusionRanges.heroExit;
      var heroExitOp = 1 - clamp((p - heroEx[0]) / (heroEx[1] - heroEx[0] || 1), 0, 1);
      el.scene01.style.opacity = heroExitOp;
    }

    fadeIn(el.heroName, p, heroR[0] + heroSpan * 0.05, heroR[0] + heroSpan * 0.32);
    fadeIn(el.heroDate, p, heroR[0] + heroSpan * 0.28, heroR[0] + heroSpan * 0.5);
    fadeIn(el.heroLocation, p, heroR[0] + heroSpan * 0.45, heroR[0] + heroSpan * 0.65);
    fadeIn(el.scrollIndicator, p, heroR[0] + heroSpan * 0.62, heroR[0] + heroSpan * 0.85);
  }

  document.addEventListener('scroll', function () { requestAnimationFrame(updateHeader); }, { passive: true });
  window.addEventListener('resize', function () { requestAnimationFrame(updateHeader); }, { passive: true });
  updateHeader();

  // ===== Main: whileInView via IntersectionObserver =====
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add('in'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

  document.querySelectorAll('.rvl').forEach(function (node, i) {
    node.style.transitionDelay = (i % 6) * 0.08 + 's';
    revealObserver.observe(node);
  });

  document.addEventListener('scroll', function () {
    document.querySelectorAll('.rvl:not(.in)').forEach(function (node) { revealObserver.observe(node); });
  }, { passive: true });

  var thanksSection = document.getElementById('thanksSection');
  if (thanksSection) {
    var thanksObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); thanksObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.3 });
    thanksObserver.observe(thanksSection);
  }

  // ===== Lightbox (imagens lidas do HTML — sem base64 embutido) =====
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  if (!lightbox || !lbImg) return;

  var galleryEls = Array.prototype.slice.call(
    document.querySelectorAll('.gallery-photo[data-idx], .gallery-featured[data-idx]')
  );
  var lbMap = {};
  var lbOrder = [];

  galleryEls.forEach(function (node) {
    var idx = parseInt(node.getAttribute('data-idx'), 10);
    var img = node.querySelector('img');
    if (!img || isNaN(idx)) return;
    lbMap[idx] = img.getAttribute('src');
    lbOrder.push(idx);
  });
  lbOrder.sort(function (a, b) { return a - b; });

  var lbIndex = null;

  function openLightbox(i) {
    if (!lbMap[i]) return;
    lbIndex = i;
    lbImg.src = lbMap[i];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lbIndex = null;
    lbImg.removeAttribute('src');
    document.body.style.overflow = '';
  }

  function nextLightbox() {
    if (lbIndex === null || !lbOrder.length) return;
    var pos = lbOrder.indexOf(lbIndex);
    openLightbox(lbOrder[(pos + 1) % lbOrder.length]);
  }

  function prevLightbox() {
    if (lbIndex === null || !lbOrder.length) return;
    var pos = lbOrder.indexOf(lbIndex);
    openLightbox(lbOrder[(pos - 1 + lbOrder.length) % lbOrder.length]);
  }

  galleryEls.forEach(function (node) {
    node.addEventListener('click', function () {
      openLightbox(parseInt(node.getAttribute('data-idx'), 10));
    });
  });

  var lbClose = document.getElementById('lbClose');
  var lbNext = document.getElementById('lbNext');
  var lbPrev = document.getElementById('lbPrev');
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbNext) lbNext.addEventListener('click', nextLightbox);
  if (lbPrev) lbPrev.addEventListener('click', prevLightbox);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
  });
})();
