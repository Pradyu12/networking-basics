/* ==================================================================
   NAVIGATION SYSTEM
   Keyboard, touch, mouse, and fullscreen controls
   ================================================================== */

const Navigation = {
  currentSlide: 0,
  totalSlides: 0,
  slideRefs: [],
  isFullscreen: false,
  isAnimating: false,

  init(slides, onSlideChange) {
    this.slideRefs = slides;
    this.totalSlides = slides.length;
    this.onSlideChange = onSlideChange;
    this.bindEvents();
  },

  bindEvents() {
    document.addEventListener('keydown', (e) => this.handleKey(e));
    document.addEventListener('click', (e) => this.handleClick(e));

    let touchStartX = 0, touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener('touchend', (e) => {
      if (!touchStartX) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
    }, { passive: true });
  },

  handleKey(e) {
    if (this.isAnimating) return;
    const tag = (e.target && e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) return;
    switch (e.key) {
      case 'ArrowLeft': e.preventDefault(); this.prev(); break;
      case 'ArrowRight': case ' ': e.preventDefault(); this.next(); break;
      case 'Home': e.preventDefault(); this.goTo(0); break;
      case 'End': e.preventDefault(); this.goTo(this.totalSlides - 1); break;
      case 'f': case 'F':
        if (e.ctrlKey || e.metaKey) return;
        e.preventDefault(); this.toggleFullscreen(); break;
      default:
        if (e.key >= '1' && e.key <= '9') {
          const target = Math.min(this.totalSlides - 1, Math.floor((parseInt(e.key) - 1) / 9 * this.totalSlides));
          this.goTo(target);
        }
    }
  },

  handleClick(e) {
    const target = e.target;
    if (target.classList.contains('progress-dots-dot') || target.parentElement?.classList.contains('progress-dots-dot')) {
      const dot = target.classList.contains('progress-dots-dot') ? target : target.parentElement;
      this.goTo(parseInt(dot.dataset.slide));
      return;
    }
    if (target.classList.contains('btn-prev') || target.parentElement?.classList.contains('btn-prev')) {
      e.preventDefault(); this.prev();
    }
    if (target.classList.contains('btn-next') || target.parentElement?.classList.contains('btn-next')) {
            e.preventDefault(); this.next();
    }
  },

  handleSwipe(startX, startY, endX, endY) {
    const dx = endX - startX;
    const dy = endY - startY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) > 50 && absDx > absDy) {
      if (dx > 0) this.prev();
      else this.next();
    }
  },

  prev() { if (this.currentSlide > 0) this.goTo(this.currentSlide - 1); },
  next() { if (this.currentSlide < this.totalSlides - 1) this.goTo(this.currentSlide + 1); },

  goTo(slideIndex) {
    if (this.isAnimating || slideIndex < 0 || slideIndex >= this.totalSlides) return;
    if (slideIndex === this.currentSlide) return;
    this.isAnimating = true;
    const prev = this.slideRefs[this.currentSlide];
    const next = this.slideRefs[slideIndex];
    if (prev) { prev.classList.remove('active'); prev.style.display = 'none'; }
    if (next) { next.style.display = 'flex'; void next.offsetWidth; next.classList.add('active'); }
    this.currentSlide = slideIndex;
    if (this.onSlideChange) this.onSlideChange(slideIndex);
    setTimeout(() => { this.isAnimating = false; }, 600);
  },

  toggleFullscreen() {
    const elem = document.querySelector('.presentation');
    if (!this.isFullscreen) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
      this.isFullscreen = true;
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      this.isFullscreen = false;
    }
  },

  updateProgress(current, total) {
    const progressFill = document.querySelector('.progress-bar-fill');
    if (progressFill) {
      const pct = ((current + 1) / total) * 100;
      progressFill.style.width = `${pct}%`;
    }
    // Prefer the span children so their markup (" / ") is preserved
    const counterEl = document.getElementById('counter');
    const totalEl = document.getElementById('total');
    const current_str = String(current + 1).padStart(2, '0');
    const total_str = String(total).padStart(2, '0');
    if (counterEl) counterEl.textContent = current_str;
    if (totalEl) totalEl.textContent = total_str;
    if (!counterEl && !totalEl) {
      const counter = document.querySelector('.counter');
      if (counter) counter.textContent = `${current_str} / ${total_str}`;
    }
    document.querySelectorAll('.progress-dots-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }
};
