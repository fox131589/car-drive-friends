// ===== CAR & CAMP FRIENDS - script.js =====
document.addEventListener('DOMContentLoaded', () => {

  // --- ローダー ---
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hide'), 2600);
  });
  // フォールバック（画像等が無くても一定時間で消す）
  setTimeout(() => loader.classList.add('hide'), 3500);

  // --- ヘッダー scroll / 進捗バー ---
  const header = document.getElementById('header');
  const toTop = document.getElementById('toTop');
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    toTop.classList.toggle('show', y > 500);
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  });

  // --- カーソル追従グロー ---
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
      cursorGlow.classList.add('active');
    });
    document.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
  }

  // --- ハンバーガーメニュー ---
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  // --- スクロールアニメーション (IntersectionObserver) ---
  const targets = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach((t, i) => {
    t.style.transitionDelay = `${(i % 3) * 0.12}s`;
    observer.observe(t);
  });

  // --- ナビリンクのスムーススクロール(高さ考慮) ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- ヒーロー文字ぜつアニメ遅延 ---
  document.querySelectorAll('.hero-title .char').forEach((el, i) => {
    el.style.animationDelay = `${0.6 + i * 0.045}s`;
  });

  // --- aboutカード 3D tilt ---
  document.querySelectorAll('.about-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--rx', `${x * 10}deg`);
      card.style.setProperty('--ry', `${-y * 10}deg`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });

  // --- ギャラリー ライトボックス ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentList = [];
  let currentIndex = 0;

  function openLightbox(list, index) {
    currentList = list;
    currentIndex = index;
    updateLightboxImg();
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
    const multi = currentList.length > 1;
    lightboxPrev.classList.toggle('hidden', !multi);
    lightboxNext.classList.toggle('hidden', !multi);
  }

  function updateLightboxImg() {
    lightboxImg.src = currentList[currentIndex];
  }

  function closeLightbox() {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const listAttr = item.getAttribute('data-full-list');
      if (listAttr) {
        openLightbox(listAttr.split(','), 0);
      } else {
        const full = item.getAttribute('data-full');
        if (full) openLightbox([full], 0);
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  lightboxPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
    updateLightboxImg();
  });
  lightboxNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentList.length;
    updateLightboxImg();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

});
