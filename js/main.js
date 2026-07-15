// ===== Header + revelacoes + lightbox =====
(function () {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) window.scrollTo(0, 0);
  });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isCoarse = window.matchMedia('(pointer: coarse)').matches;

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  var sceneRanges = { scene00: [0, 0.1595], sceneCasaCavo: [0.1595, 0.8236], scene01: [0.42, 0.6059] };
  var FUSION_SPAN = 0.15;
  var fusionRanges = {
    casaCavoEnter: [sceneRanges.scene00[1] - FUSION_SPAN * 0.6, sceneRanges.scene00[1] + FUSION_SPAN * 0.4],
    casaCavoExit: [sceneRanges.sceneCasaCavo[1] - FUSION_SPAN * 0.85, sceneRanges.sceneCasaCavo[1] + FUSION_SPAN * 0.55],
    heroExit: [sceneRanges.sceneCasaCavo[1] - FUSION_SPAN * 0.55, sceneRanges.sceneCasaCavo[1] + FUSION_SPAN * 0.9]
  };
  var lightStops = [0, 0.16, 1];
  var lightColors = ['#FBFAF8', '#F7F5F1', '#F7F5F1'];

  function hexToRgb(hex) {
    var v = parseInt(hex.slice(1), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  }
  function lerpColor(t, stops, colors) {
    if (t <= stops[0]) return colors[0];
    if (t >= stops[stops.length - 1]) return colors[colors.length - 1];
    for (var i = 0; i < stops.length - 1; i++) {
      if (t >= stops[i] && t <= stops[i + 1]) {
        var lt = (t - stops[i]) / (stops[i + 1] - stops[i] || 1);
        var c1 = hexToRgb(colors[i]);
        var c2 = hexToRgb(colors[i + 1]);
        return 'rgb(' + Math.round(c1[0] + (c2[0] - c1[0]) * lt) + ',' + Math.round(c1[1] + (c2[1] - c1[1]) * lt) + ',' + Math.round(c1[2] + (c2[2] - c1[2]) * lt) + ')';
      }
    }
    return colors[colors.length - 1];
  }

  var el = {};
  ['lightJourney', 'fusionShield', 'scene00', 'sceneCasaCavo', 'paperLayer', 'watercolorWrap', 'heroScrim', 'scene01', 'heroBlock', 'scrollIndicator'].forEach(function (id) {
    el[id] = document.getElementById(id);
  });

  var headerLayers = [el.lightJourney, el.fusionShield, el.sceneCasaCavo, el.scene01, el.scene00];
  var maxBlur = isCoarse ? 6 : 10;
  var ticking = false;
  var lastP = -1;
  var headerHidden = false;

  function slideUpReveal(node, p, from, to, lift) {
    if (!node) return;
    var t = clamp((p - from) / (to - from || 1), 0, 1);
    var e = easeOutCubic(t);
    node.style.opacity = e;
    node.style.transform = 'translate3d(0,' + (lift * (1 - e)).toFixed(2) + 'px,0)';
  }

  function setLayerVisibility(hidden) {
    if (headerHidden === hidden) return;
    headerHidden = hidden;
    for (var i = 0; i < headerLayers.length; i++) {
      var node = headerLayers[i];
      if (!node) continue;
      node.style.pointerEvents = 'none';
      node.style.visibility = hidden ? 'hidden' : '';
      if (hidden) {
        node.style.willChange = 'auto';
        node.style.filter = '';
      }
    }
  }

  function updateHeader() {
    var headerEl = document.getElementById('headerScroll');
    if (!headerEl || !el.scene00) return;

    var headerHeight = headerEl.offsetHeight - window.innerHeight;
    var scrolled = clamp(window.scrollY, 0, headerHeight);
    var p = clamp(scrolled / (headerHeight || 1), 0, 1);

    // Evita trabalho duplicado quando o progresso nao muda
    if (Math.abs(p - lastP) < 0.0004 && lastP >= 0) return;
    lastP = p;

    if (el.lightJourney) el.lightJourney.style.background = lerpColor(p, lightStops, lightColors);

    var s0 = sceneRanges.scene00;
    var s0span = s0[1] - s0[0];
    var holdEnd = s0[0] + s0span * 0.74;
    var dissolveEnd = fusionRanges.casaCavoEnter[1];
    var veilOpacity = p <= holdEnd ? 1 : clamp(1 - (p - holdEnd) / (dissolveEnd - holdEnd || 1), 0, 1);
    el.scene00.style.opacity = veilOpacity;
    if (!reduceMotion) {
      el.scene00.style.filter = veilOpacity < 1 && veilOpacity > 0.01
        ? 'blur(' + ((1 - veilOpacity) * maxBlur).toFixed(2) + 'px)'
        : '';
    }

    var cc = sceneRanges.sceneCasaCavo;
    var ccSpan = cc[1] - cc[0];
    var en = fusionRanges.casaCavoEnter;
    var ex = fusionRanges.casaCavoExit;
    var ccIn = easeOutQuart(clamp((p - en[0]) / (en[1] - en[0] || 1), 0, 1));
    var ccOut = easeOutCubic(clamp((p - ex[0]) / (ex[1] - ex[0] || 1), 0, 1));
    var ccOpacity = ccIn * (1 - ccOut);

    if (el.sceneCasaCavo) {
      el.sceneCasaCavo.style.opacity = ccOpacity;
      if (!reduceMotion) {
        el.sceneCasaCavo.style.filter = ccOut > 0.02 && ccOut < 0.98
          ? 'blur(' + (ccOut * maxBlur * 0.85).toFixed(2) + 'px)'
          : '';
      }
    }

    // So esconde camadas depois que o fade ja terminou (sem corte brusco)
    setLayerVisibility(p >= ex[1] + 0.01);

    if (el.paperLayer) {
      var paperPeak = cc[0] + ccSpan * 0.08;
      var paperSettle = cc[0] + ccSpan * 0.22;
      var paperOp = p < paperPeak
        ? clamp((p - cc[0]) / (paperPeak - cc[0] || 1), 0, 1) * 0.5
        : clamp(0.5 - (p - paperPeak) / (paperSettle - paperPeak || 1) * 0.36, 0.14, 0.5);
      el.paperLayer.style.opacity = paperOp * (1 - ccOut);
    }

    var wcStart = cc[0] + ccSpan * 0.04;
    var wcFull = cc[0] + ccSpan * 0.38;
    var wcT = clamp((p - wcStart) / (wcFull - wcStart || 1), 0, 1);
    var wcOp = easeOutQuart(wcT);

    if (el.watercolorWrap) {
      el.watercolorWrap.style.opacity = wcOp * (1 - ccOut * 0.35);
      if (!reduceMotion && wcOp < 1 && wcOp > 0.01) {
        el.watercolorWrap.style.filter = 'brightness(' + (0.78 + wcOp * 0.22).toFixed(3) + ')';
      } else if (el.watercolorWrap) {
        el.watercolorWrap.style.filter = '';
      }
      if (el.fusionShield) {
        var shieldOp = 0;
        if (veilOpacity > 0.02) shieldOp = Math.max(shieldOp, veilOpacity);
        if (wcOp < 0.98) shieldOp = Math.max(shieldOp, 1 - wcOp);
        // Mantem um veu suave ate o fim do header, evitando salto visual
        if (ccOut > 0) shieldOp = Math.max(shieldOp, ccOut * 0.55);
        el.fusionShield.style.opacity = clamp(shieldOp, 0, 1);
      }
    } else if (el.fusionShield) {
      el.fusionShield.style.opacity = veilOpacity > 0.02 ? veilOpacity : (ccOut * 0.55);
    }

    var heroR = sceneRanges.scene01;
    var heroSpan = heroR[1] - heroR[0];
    if (el.heroScrim) {
      var scrimStart = heroR[0] - ccSpan * 0.03;
      var scrimEnd = heroR[0] + ccSpan * 0.08;
      var scrimOp = clamp((p - scrimStart) / (scrimEnd - scrimStart || 1), 0, 1);
      el.heroScrim.style.opacity = scrimOp * (1 - ccOut);
    }

    if (el.scene01) {
      var heroEx = fusionRanges.heroExit;
      var heroExitT = easeOutCubic(clamp((p - heroEx[0]) / (heroEx[1] - heroEx[0] || 1), 0, 1));
      el.scene01.style.opacity = 1 - heroExitT;
    }

    var blockStart = heroR[0] + heroSpan * 0.03;
    var blockEnd = heroR[0] + heroSpan * 0.48;
    var welcomeStart = blockStart + heroSpan * 0.13;
    var welcomeEnd = blockEnd + heroSpan * 0.05;
    slideUpReveal(el.heroBlock, p, blockStart, blockEnd, isCoarse ? 18 : 22);
    slideUpReveal(el.scrollIndicator, p, welcomeStart, welcomeEnd, isCoarse ? 18 : 22);

    if (p > blockEnd && el.heroBlock) el.heroBlock.style.willChange = 'auto';
    if (p > welcomeEnd && el.scrollIndicator) el.scrollIndicator.style.willChange = 'auto';
  }

  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      updateHeader();
    });
  }

  document.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize, { passive: true });
  updateHeader();

  // ===== Reveals: fade + lift leve, stagger curto apenas entre irmãos =====
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.rvl'));

  if (reduceMotion) {
    revealEls.forEach(function (node) { node.classList.add('in'); });
  } else {
    var parentIndex = new WeakMap();
    revealEls.forEach(function (node) {
      var parent = node.parentElement;
      var idx = parentIndex.get(parent) || 0;
      // Max 3 degraus, 60ms — evita cascata longa
      node.style.transitionDelay = (Math.min(idx, 2) * 0.06) + 's';
      parentIndex.set(parent, idx + 1);
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });

    revealEls.forEach(function (node) { revealObserver.observe(node); });
  }

  var thanksSection = document.getElementById('thanksSection');
  if (thanksSection) {
    var thanksObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          thanksObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -6% 0px' });
    thanksObserver.observe(thanksSection);
  }

  // ===== Lightbox =====
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
