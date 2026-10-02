/* ==================================================================
   MAIN APPLICATION
   ================================================================== */

class PresentationApp {
  constructor() {
    this.slides = slides;
    this.currentSlide = 0;
    this.slideElements = [];
    this.init();
  }

  init() {
    this.renderSlides();
    this.setupUI();
    this.initNavigation();
    this.initSpeakerNotes();
    Navigation.updateProgress(0, this.slides.length);
    this.renderDiagram(0);
  }

  generateSlideHTML(slide) {
    let html = `<section class="slide" data-slide="${slide.id}" data-diagram="${slide.diagram || ''}">`;
    if (slide.layout === 'title') {
      html += `
      <div class="visual title-visual">
        <h1 class="title">${slide.title}</h1>
        <div class="title-rule" aria-hidden="true"><span class="title-rule-node"></span></div>
        <h3 class="subtitle"><strong>${slide.subtitle}</strong></h3>
        <div class="diagram-container" id="diagram-${slide.id}"></div>
      </div>`;
    } else {
      html += `<div class="visual">
      <div class="slide-header">
        <span class="eyebrow">${slide.eyebrow || 'Networking'}</span>
        <span class="slide-number">${String(slide.id + 1).padStart(2, '0')} <strong>/</strong> ${String(this.slides.length).padStart(2, '0')}</span>
      </div>
      <h2 class="section-title">${slide.title}</h2>`;
      if (slide.bulletItems) {
        html += `<ul class="bullets stagger-children">`;
        slide.bulletItems.forEach(text => {
          html += `<li><span class="dot"></span><span class="text">${text}</span></li>`;
        });
        html += `</ul>`;
      }
      if (slide.bodyText) {
        html += `<p class="body-text">${slide.bodyText}</p>`;
      }
      html += `</div>`;
    }
    if (slide.diagram && slide.layout !== 'title') {
      // Insert diagram container in the visual div
      // Will be filled by renderDiagram
    }
    html += `</section>`;
    return html;
  }

  /* —  — Content slide with diagram —  — */
  generateContentSlide(slide) {
    let html = `<section class="slide" data-slide="${slide.id}" data-diagram="${slide.diagram || ''}">`;
    const mods = [];
    if (slide.diagram) mods.push('has-diagram');
    if (slide.bulletItems) mods.push('has-bullets');
    if (slide.visual) mods.push('has-visual');
    html += `<div class="visual ${mods.join(' ')}">
      <div class="slide-header">
        <span class="eyebrow">${slide.eyebrow || 'Networking'}</span>
        <span class="slide-number">${String(slide.id + 1).padStart(2, '0')} <strong>/</strong> ${String(this.slides.length).padStart(2, '0')}</span>
      </div>
      <h2 class="section-title">${slide.title}</h2>`;
    const twoCol = !!(slide.diagram && slide.bulletItems);
    if (twoCol) html += `<div class="slide-cols"><div class="col col-text">`;
    if (slide.bulletItems) {
      html += `<ul class="bullets stagger-children">`;
      slide.bulletItems.forEach(text => {
        html += `<li><span class="dot"></span><span class="text">${text}</span></li>`;
      });
      html += `</ul>`;
    }
    if (slide.visual) {
      html += `<pre class="visual-text animate-on-load">${slide.visual}</pre>`;
      if (slide.visualLabel) html += `<p class="visual-label">${slide.visualLabel}</p>`;
    }
    if (twoCol) {
      html += `</div><div class="col col-diagram">`;
      if (slide.diagram) html += `<div class="diagram-container" id="diagram-${slide.id}"></div>`;
      html += `</div></div>`;
    } else if (slide.diagram) {
      html += `<div class="diagram-container" id="diagram-${slide.id}"></div>`;
    }
    if (slide.analogy) html += `<div class="analogy animate-on-load">${slide.analogy}</div>`;
    if (slide.bodyText) html += `<p class="body-text animate-on-load">${slide.bodyText}</p>`;
    html += `</div></section>`;
    return html;
  }

  /* —  — Render all slides —  — */
  renderSlides() {
    const slidesEl = document.querySelector('.slides');
    let html = '';
    this.slides.forEach((slide) => {
      html += slide.layout === 'title' ? this.generateSlideHTML(slide) : this.generateContentSlide(slide);
    });
    slidesEl.innerHTML = html;
    this.slideElements = document.querySelectorAll('.slide');
    this.slideElements[0].classList.add('active');
    this.slideElements[0].style.display = 'flex';
  }

  /* —  — Setup UI —  — */
  setupUI() {
    const dotsContainer = document.querySelector('.progress-dots');
    let dots = '';
    this.slides.forEach((_, i) => {
      dots += `<div class="progress-dots-dot" data-slide="${i}"></div>`;
    });
    dotsContainer.innerHTML = dots;
  }

  /* —  — Navigation —  — */
  initNavigation() {
    Navigation.init(this.slideElements, (idx) => this.onSlideChange(idx));
  }

  onSlideChange(slideIndex) {
    this.currentSlide = slideIndex;
    Navigation.updateProgress(slideIndex, this.slides.length);
    this.renderDiagram(slideIndex);
    this.updateSpeakerNotes(this.slides[slideIndex]);

    const slideEl = this.slideElements[slideIndex];
    if (slideEl) {
      setTimeout(() => {
        // Reveal staggered children (bullets, lists)
        slideEl.querySelectorAll('.stagger-children').forEach((c) => c.classList.add('animate'));
        const animatables = slideEl.querySelectorAll('.animate-on-load');
        animatables.forEach((el, i) => {
          setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, i * 80);
        });
      }, 300);
    }
  }

  renderDiagram(slideId) {
    const slide = this.slides[slideId];
    const el = document.getElementById(`diagram-${slide.id}`);
    if (el && slide.diagram && DiagramEngine.diagrams[slide.diagram]) {
      DiagramEngine.render(slide.diagram, el);
    }
  }

  /* —  — Speaker Notes —  — */
  initSpeakerNotes() {
    const notesEl = document.querySelector('.speaker-notes .notes-text');
    if (notesEl) notesEl.innerHTML = this.slides[0].notes || 'No notes for this slide.';
  }

  updateSpeakerNotes(slide) {
    const notesEl = document.querySelector('.speaker-notes .notes-text');
    if (notesEl) {
      let html = `<p style="line-height:1.6;">${slide.notes || 'No notes available.'}</p>`;
      if (slide.analogy) html += `<p style="margin-top:8px;color:var(--text-muted);">${slide.analogy}</p>`;
      notesEl.innerHTML = html;
    }
  }
}

/* —  — Bootstrap —  — */
document.addEventListener('DOMContentLoaded', () => {
  window.app = new PresentationApp();

  document.querySelector('.btn-prev')?.addEventListener('click', () => Navigation.prev());
  document.querySelector('.btn-next')?.addEventListener('click', () => Navigation.next());
  document.querySelector('.btn-fullscreen')?.addEventListener('click', () => Navigation.toggleFullscreen());
  document.querySelector('.btn-notes')?.addEventListener('click', () => {
    document.querySelector('.speaker-notes').classList.toggle('active');
  });

  document.addEventListener('fullscreenchange', () => {
    const el = document.querySelector('.presentation');
    el.classList.toggle('fullscreen', !!document.fullscreenElement);
    Navigation.isFullscreen = !!document.fullscreenElement;
  });
});

