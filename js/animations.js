/* ==================================================================
   ANIMATION SYSTEM
   Controls staggered element entrance and transition effects
   ================================================================== */

const AnimationSystem = {
  isReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /* —  — Staggered entrance for slide elements —  — */
  staggerEntrance(slideEl, delay = 0) {
    if (this.isReducedMotion()) return;
    const elements = slideEl.querySelectorAll('.animate-on-load');
    elements.forEach((el, i) => {
      const d = delay + i * 80;
      setTimeout(() => {
        if (el.classList) el.style.opacity = '1';
        if (el.style) el.style.transform = 'translateY(0)';
      }, d);
    });
  },

  /* —  — Animate slide content after activation —  — */
  animateSlideIn(slideEl, callback) {
    if (this.isReducedMotion()) {
      if (callback) callback();
      return;
    }
    // Trigger CSS transition
    slideEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    slideEl.style.opacity = '1';
    slideEl.style.transform = 'translateY(0)';

    setTimeout(() => {
      // Animate children
      const animatables = slideEl.querySelectorAll('.stagger-children');
      animatables.forEach(container => {
        if (container.classList) container.classList.add('animate');
      });

      // Animate diagram elements
      const diagram = slideEl.querySelector('.network-svg');
      if (diagram && window.DiagramEngine) {
        const diagramName = slideEl.dataset.diagram;
        if (diagramName && DiagramEngine.animations[diagramName]) {
          setTimeout(() => {
            DiagramEngine.animations[diagramName](diagram);
          }, 500);
        }
      }

      if (callback) callback();
    }, 500);
  },

  /* —  — Fade in an element —  — */
  fadeIn(el, duration = 500, delay = 0) {
    if (this.isReducedMotion()) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      return;
    }
    setTimeout(() => {
      el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, delay);
  },

  /* —  — Fade out an element —  — */
  fadeOut(el, duration = 300, delay = 0) {
    if (this.isReducedMotion()) {
      el.style.opacity = '0';
      return;
    }
    setTimeout(() => {
      el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
      el.style.opacity = '0';
      el.style.transform = 'translateY(-10px)';
    }, delay);
  },

  /* —  — Bounce/glow effect for emphasis —  — */
  pulse(el, times = 2, color = '#3b82f6') {
    if (this.isReducedMotion()) return;
    let count = 0;
    const original = el.style.boxShadow;
    const interval = setInterval(() => {
      count++;
      if (count > times * 2) {
        el.style.boxShadow = original;
        clearInterval(interval);
        return;
      }
      el.style.boxShadow = count % 2 === 1
        ? `0 0 20px ${color}, 0 0 40px ${color}`
        : original;
    }, 300);
  },

  /* —  — Counter animation for numbers —  — */
  animateCounter(el, start, end, duration = 1500) {
    if (this.isReducedMotion()) {
      el.textContent = end;
      return;
    }
    const range = end - start;
    const stepTime = Math.max(20, Math.floor(duration / Math.abs(range)));
    let current = start;
    const timer = setInterval(() => {
      current += Math.sign(range);
      el.textContent = current;
      if (current === end) {
        clearInterval(timer);
      }
    }, stepTime);
  },

  /* —  — Line drawing animation —  — */
  drawLine(el, duration = 1000) {
    if (this.isReducedMotion()) return;
    const len = el.getTotalLength();
    el.style.strokeDasharray = len;
    el.style.strokeDashoffset = len;
    el.style.transition = `stroke-dashoffset ${duration}ms ease-in-out`;
    setTimeout(() => {
      el.style.strokeDashoffset = '0';
    }, 50);
  },

  /* —  — Packet movement along a line —  — */
  movePacket(packetEl, startX, startY, endX, endY, duration = 2000, repeat = true) {
    if (this.isReducedMotion()) {
      packetEl.style.opacity = '1';
      return;
    }
    const animate = () => {
      packetEl.style.transition = 'none';
      packetEl.style.opacity = '1';
      packetEl.style.transform = 'translate(0, 0)';
      // Force reflow
      void packetEl.offsetWidth;
      packetEl.style.transition = `transform ${duration}ms linear`;
      packetEl.style.transform = `translate(${endX - startX}px, ${endY - startY}px)`;
      setTimeout(() => {
        packetEl.style.opacity = '0';
        if (repeat) {
          setTimeout(animate, 500);
        }
      }, duration);
    };
    animate();
  },

  /* —  — Highlight a node briefly —  — */
  highlight(el, duration = 1500) {
    if (this.isReducedMotion()) return;
    const original = el.style.filter;
    el.style.transition = `filter 0.3s ease`;
    el.style.filter = 'brightness(1.5) saturate(1.3)';
    setTimeout(() => {
      el.style.filter = original;
    }, duration);
  }
};
