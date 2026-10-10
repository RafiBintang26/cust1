/* ==========================================================================
   ANIMATED SCRAPBOOK GIFT - INTERACTIVE JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const stageGift = document.getElementById('stageGift');
  const stageScrapbook = document.getElementById('stageScrapbook');
  const giftBox = document.getElementById('giftBox');
  const btnOpenGift = document.getElementById('btnOpenGift');
  const boxBurst = document.getElementById('boxBurst');

  // Audio Elements
  const bgAudio = document.getElementById('bgAudio');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const equalizer = document.getElementById('equalizer');
  const musicIcon = document.getElementById('musicIcon');

  // Scrapbook Navigation
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const pageIndicator = document.getElementById('pageIndicator');
  const pages = document.querySelectorAll('.scrapbook-page');
  const replayBtn = document.getElementById('replayBtn');

  // Page 4 Interactive Features
  const flipContainers = document.querySelectorAll('.polaroid-flip-container');
  const stickerBtns = document.querySelectorAll('.sticker-select-btn');
  const stickerLayer = document.getElementById('stickerLayer');
  const clearStickersBtn = document.getElementById('clearStickersBtn');

  let currentPage = 1;
  const totalPages = pages.length;
  let isPlayingMusic = false;
  let activeStickerType = 'heart';

  // Assets mapping for interactive sticker drop
  const stickerAssets = {
    heart: 'assets/scrapbook/sticker_heart.png',
    star: 'assets/scrapbook/sticker_star.png',
    flower: 'assets/scrapbook/flower_sticker.png',
    stamp: 'assets/scrapbook/sticker_stamp.png'
  };


  /* ==========================================================================
     1. AMBIENT SPARKLES GENERATOR
     ========================================================================== */
  function initSparkles() {
    const sparklesContainer = document.getElementById('sparkles');
    const sparkleCount = 35;

    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.classList.add('sparkle');
      
      const size = Math.random() * 4 + 2;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
      sparkle.style.animationDelay = `${Math.random() * 3}s`;

      sparklesContainer.appendChild(sparkle);
    }
  }

  initSparkles();


  /* ==========================================================================
     2. AUDIO CONTROLLER & AUTOPLAY SUPPORT
     ========================================================================== */
  function playAudio() {
    if (bgAudio) {
      bgAudio.play().then(() => {
        isPlayingMusic = true;
        equalizer.classList.add('playing');
        musicIcon.textContent = '🎵';
      }).catch(err => {
        console.log('Autoplay prevented by browser, waiting for user click:', err);
      });
    }
  }

  function toggleAudio() {
    if (!bgAudio) return;
    if (isPlayingMusic) {
      bgAudio.pause();
      isPlayingMusic = false;
      equalizer.classList.remove('playing');
      musicIcon.textContent = '🔇';
    } else {
      playAudio();
    }
  }

  musicToggleBtn.addEventListener('click', toggleAudio);


  /* ==========================================================================
     3. GIFT BOX OPENING ANIMATION (VIDEO 2 REFERENCE)
     ========================================================================== */
  function createBurstParticles() {
    boxBurst.innerHTML = '';
    const colors = ['#FFD700', '#FF758C', '#FFF', '#FF9EAA', '#E2A7B4'];

    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      particle.classList.add('burst-particle');
      
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 180 + 60;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.setProperty('--dx', `${dx}px`);
      particle.style.setProperty('--dy', `${dy}px`);

      boxBurst.appendChild(particle);
    }
  }

  function openGiftBox() {
    // 1. Play Background Music
    playAudio();

    // 2. Trigger Box Animation
    giftBox.classList.add('opening');
    createBurstParticles();

    // 3. Transition to Stage 2 Scrapbook
    setTimeout(() => {
      stageGift.classList.add('hidden');
      stageScrapbook.classList.remove('hidden');
      updatePageVisibility(1);
    }, 900);
  }

  giftBox.addEventListener('click', openGiftBox);
  btnOpenGift.addEventListener('click', openGiftBox);


  /* ==========================================================================
     4. SCRAPBOOK PAGE NAVIGATION & SEQUENCING (VIDEO 1 REFERENCE)
     ========================================================================== */
  function updatePageVisibility(pageNumber) {
    pages.forEach(page => {
      const pNum = parseInt(page.getAttribute('data-page'));
      if (pNum === pageNumber) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    currentPage = pageNumber;
    pageIndicator.textContent = `Halaman ${currentPage} dari ${totalPages}`;

    // Update Nav Buttons
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  }

  nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      updatePageVisibility(currentPage + 1);
    }
  });

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      updatePageVisibility(currentPage - 1);
    }
  });

  // Replay Button (Back to Gift Box)
  replayBtn.addEventListener('click', () => {
    giftBox.classList.remove('opening');
    stageScrapbook.classList.add('hidden');
    stageGift.classList.remove('hidden');
    updatePageVisibility(1);
  });


  /* ==========================================================================
     5. PAGE 4 INTERACTIVE FEATURES: FLIP POLAROIDS & STICKER PLAYGROUND
     ========================================================================== */
  // Flip Polaroid Cards
  flipContainers.forEach(container => {
    container.addEventListener('click', () => {
      container.classList.toggle('flipped');
    });
  });

  // Sticker Selector Toolbar
  stickerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      stickerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeStickerType = btn.getAttribute('data-sticker');
    });
  });

  // Click on Page 4 to drop sticker
  const page4 = document.querySelector('.page-4');
  page4.addEventListener('click', (e) => {
    // Ignore click if clicking flip card or toolbar button
    if (e.target.closest('.polaroid-flip-container') || e.target.closest('.sticker-toolbar')) {
      return;
    }

    const rect = page4.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    dropSticker(x, y, activeStickerType);
  });

  function dropSticker(x, y, type) {
    const stickerImg = document.createElement('img');
    stickerImg.src = stickerAssets[type] || stickerAssets.heart;
    stickerImg.classList.add('dropped-sticker');

    const randomRot = (Math.random() - 0.5) * 40;
    const size = 60 + Math.random() * 25;

    stickerImg.style.width = `${size}px`;
    stickerImg.style.height = 'auto';
    stickerImg.style.left = `${x - size / 2}px`;
    stickerImg.style.top = `${y - size / 2}px`;
    stickerImg.style.setProperty('--rot', `${randomRot}deg`);

    stickerLayer.appendChild(stickerImg);
  }

  // Clear Stickers
  clearStickersBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    stickerLayer.innerHTML = '';
  });

});
