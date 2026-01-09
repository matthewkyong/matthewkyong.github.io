document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('img, video').forEach(media => {
    media.addEventListener('error', function() {
      console.warn('Failed to load:', this.src);
      this.style.display = 'none';
    });
  });

  // ========== Detect if mobile ========== //
  window.isMobile = function() {
    if(window.matchMedia("(any-hover:none)").matches) {
      return true;
    } else {
      return false;
    }
  };

  // ========== Theme Toggle ========== //
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeToggle = document.querySelector('.theme-toggle');
  const easterEggToggle = document.querySelector('.theme-toggle-easteregg');

  const standardThemes = ['light', 'dark'];
  const easterEggThemes = ['pokemon', 'ds3', 'acnh', 'halo', 'genshin', 'phasmo'];
  let mouseMoveHandler = null;

  let previousTheme = 'dark';
  let previousEasterEggTheme = 'pokemon';

  const isEasterEgg = (theme) => easterEggThemes.includes(theme);
  const isStandardTheme = (theme) => standardThemes.includes(theme);


  // Check for saved theme preference or default to system preference
  const getPreferredTheme = () => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme;
      }
    } catch (e) {
      console.warn('localStorage not available:', e);
    }
    return 'dark';
  };

  // Apply theme
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);

    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('Could not save theme:', e);
    }

    if (theme === 'light') {
      themeToggle.classList.add('dark-toggle');
    } else if (theme === 'dark') {
      themeToggle.classList.remove('dark-toggle');
    }

    const wasEasterEgg = easterEggToggle.classList.contains('active');
    const isNowEasterEgg = isEasterEgg(theme);

    if (isNowEasterEgg) {
      if (!wasEasterEgg) {
        easterEggToggle.classList.add('active');
      }
      document.querySelectorAll('.gif').forEach(gif => gif.classList.remove('active'));
      const targetGif = document.querySelector(`.gif[data-theme="${theme}"]`);
      if (targetGif) {
        targetGif.classList.add('active');
      }
      previousEasterEggTheme = theme;
    } else {
      if (wasEasterEgg) {
        easterEggToggle.classList.remove('active');
        document.querySelectorAll('.gif.active').forEach(gif => gif.classList.remove('active'));
      }
    }
    if (theme === 'phasmo' || wasEasterEgg) {
      handlePhasmoFlashlight();
    }
  };

  const handlePhasmoFlashlight = () => {
  const phasmoOverlay = document.querySelector('.phasmo-overlay');
  const currentTheme = document.documentElement.getAttribute('data-theme');

  if (currentTheme === 'phasmo') {
    if (currentTheme === 'phasmo') {
      mouseMoveHandler = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      phasmoOverlay.style.background = `radial-gradient(circle 150px at ${x}px ${y}px, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0.85) 100%)`;
    };
      document.addEventListener('mousemove', mouseMoveHandler);
    }
  } else {
    if (mouseMoveHandler) {
      document.removeEventListener('mousemove', mouseMoveHandler);
      mouseMoveHandler = null;
    }
    phasmoOverlay.style.background = 'rgba(0, 0, 0, 0.85)';
  }
};

  // Initialize theme on page load
  const initialTheme = getPreferredTheme();
  setTheme(initialTheme);

  if (isEasterEgg(initialTheme)) {
    const storedPreviousTheme = localStorage.getItem('previousStandardTheme');
    if (storedPreviousTheme && isStandardTheme(storedPreviousTheme)) {
      previousTheme = storedPreviousTheme;
    }
    if (previousTheme === 'light') {
      themeToggle.classList.remove('dark-toggle');
    } else {
      themeToggle.classList.add('dark-toggle');
    }
  } else {
    previousTheme = initialTheme;
  }

  // Toggle theme on button click
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (isEasterEgg(currentTheme)) {
      document.querySelectorAll('.gif').forEach(gif => gif.classList.remove('active'));
      setTheme(previousTheme);
    } else {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      previousTheme = newTheme;
      localStorage.setItem('previousStandardTheme', newTheme);
      setTheme(newTheme);
    }
  });

  easterEggToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const currentIndex = easterEggThemes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % easterEggThemes.length;
    setTheme(easterEggThemes[nextIndex]);
  });

  // ========== Easter Eggs ========== //
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    const keycheck = konamiCode[konamiIndex];
    const pressedKey = e.key;

    const keyMatch = pressedKey === keycheck || pressedKey.toLowerCase() === keycheck.toLowerCase();

    if (keyMatch) {
      konamiIndex++;

      if (konamiIndex === konamiCode.length) {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (isStandardTheme(currentTheme)) {
          previousTheme = currentTheme;
          localStorage.setItem('previousStandardTheme', currentTheme);
          if (previousTheme === 'dark') {
            themeToggle.classList.add('dark-toggle');
          } else if (previousTheme === 'light') {
            themeToggle.classList.remove('dark-toggle');
          }
        }
        setTheme(previousEasterEggTheme);
        konamiIndex = 0;
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    } else {
      konamiIndex = 0;
    }
  });

  // ========== Sort Video Blocks by Date ========== //
  const videoWrapper = document.querySelector('.video-wrapper');
  if (videoWrapper) {
    const videoBlocks = Array.from(videoWrapper.querySelectorAll('.video-block'));
    videoBlocks.sort((a, b) => {
      const dateA = new Date(a.dataset.date || '1970-01-01');
      const dateB = new Date(b.dataset.date || '1970-01-01');
      return dateB - dateA; // Newest first
    });
    videoBlocks.forEach(block => videoWrapper.appendChild(block));
  }

  // ========== Contact Button ========== //
  const contactButton = document.getElementById('copy-email');
  const tooltip = contactButton.nextElementSibling;
  const emailAddress = 'matthewkyong@gmail.com';
  let tooltipVisible = false;

  contactButton.addEventListener('click', async () => {
    navigator.clipboard.writeText(emailAddress).then(() => {
      if (!tooltipVisible) {
        tooltipVisible = true;
        tooltip.classList.add('show');
        setTimeout(() => {
          tooltip.classList.remove('show');
          tooltipVisible = false;
        }, 3000);
      }
    });
  });

  // ========== Title Filter ========== //
  const titleFilter = document.querySelector('.title-filter');
  const selectedTitle = titleFilter.querySelector('.selected-title');
  const dropdownArrow = titleFilter.querySelector('.dropdown-arrow');
  const titleOptions = titleFilter.querySelectorAll('.title-options li');
  

  function filterContent(filter) {
    const allContent = document.querySelectorAll('.reel-block, .video-block');
    allContent.forEach(block => {
      if (!filter) {
        block.style.display = 'flex';
      } else {
        const types = (block.dataset.type || '').split(' ');
        block.style.display = types.includes(filter) ? 'flex' : 'none';
      }
    });
  }

  titleFilter.addEventListener('click', () => {titleFilter.classList.toggle('active');});

  titleOptions.forEach(option => {
    option.addEventListener('click', () => {
      const filter = option.dataset.filter;
      applyFilterWithRouting(filter, true);
      titleFilter.classList.remove('active');
    });
  });

  // ========== Hamburger Menu ========== //
  const hamburgerWrapper = document.querySelector('.hamburger-wrapper');
  const hamburgerMenu = document.getElementById('hamburger');

  hamburgerMenu.addEventListener('click', () => {
    hamburgerWrapper.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!hamburgerWrapper.contains(e.target)) {
      hamburgerWrapper.classList.remove('active');
    }
  });

  // ========== URL Routing ========== //
  const routes = {
    '': { filter: '', title: 'SOUND DESIGNER' },
    'sounddesign': { filter: 'sound', title: 'SOUND DESIGNER' },
    'music': { filter: 'music', title: 'MUSIC PRODUCER' },
    'audioengineering': { filter: 'audio', title: 'AUDIO ENGINEER' },
  };

  // Get route from path
  function getRouteFromPath(path) {
    const cleanPath = path.replace(/^\/|\/$/g, '');
    return routes[cleanPath] || routes[''];
  }

  // Get path from filter
  function getPathFromFilter(filter) {
    return Object.keys(routes).find(path => routes[path].filter === filter) || '';
  }

  // Apply filter and update URL
  function applyFilterWithRouting(filter, updateURL = true) {
    filterContent(filter);
    
    const route = routes[getPathFromFilter(filter)];

    selectedTitle.textContent = route.title;

    if (filter) {
      selectedTitle.classList.add('active');
    } else {
      selectedTitle.classList.remove('active');
    }
    
    if (updateURL) {
      const path = getPathFromFilter(filter);
      const newURL = path ? `/${path}` : '/';
      window.history.pushState({ filter }, '', newURL);
    }
  }

  // browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    const route = getRouteFromPath(path);
    
    if (route.filter !== undefined) {
      applyFilterWithRouting(route.filter, false);
    }
  });

  // Apply filter on page load based on URL
  const initialRoute = getRouteFromPath(window.location.pathname);
  if (initialRoute.filter) {
    applyFilterWithRouting(initialRoute.filter, false);
  }

  // ========== Back to top button ========== // 
  const backToTopBtn = document.getElementById('back-to-top');
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    if (isMobile()) {
      const backToTopText = backToTopBtn.querySelector('.back-to-top-text');

      backToTopText.style.opacity = '1';
      backToTopText.style.transform = 'translateY(0px)';
      backToTopBtn.style.transform = 'translateY(-5px)';
      
      setTimeout(() => {
        backToTopText.style.opacity = '0';
        backToTopText.style.transform = 'translateY(-5px)';
        backToTopBtn.style.transform = 'translateY(0px)';
      }, 1000);
    }
  });

  // ========== Video Previews ========== //
  const previews = document.querySelectorAll('.reel-preview, .video-preview');
  previews.forEach(preview => {
    const video = preview.querySelector('.reel-preview-video, .video-preview-video');
    const overlayVideo = preview.querySelector('.preview-overlay-video');

    preview.addEventListener('mouseenter', () => {
      if(video) {
        if (!video.dataset.loaded) {
          video.load();
          video.dataset.loaded = 'true';
        }
        video.currentTime = 0;
        video.play();
      }

    if (overlayVideo && easterEggToggle.classList.contains('active')) {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'genshin') {
        if (!overlayVideo.dataset.loaded) {
          overlayVideo.load();
          overlayVideo.dataset.loaded = 'true';
        }
        overlayVideo.currentTime = 0;
        overlayVideo.play();
      }
    }
  });
    
    preview.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;

      if (overlayVideo) {
        overlayVideo.pause();
        overlayVideo.currentTime = 0;
      }
    });
  });

  // ========== Video Modal Setup ========== //
  const videoModal = document.querySelector('.video-modal');
  const iframe = videoModal.querySelector('iframe');
  const closeModalButton = videoModal.querySelector('.close-modal-button');
  const modalPlayer = videoModal.querySelector('.video-modal-player');
  const modalLeft = videoModal.querySelector('.modal-description.left');
  const modalRight = videoModal.querySelector('.modal-description.right');
  const modalBackground = document.querySelector('.video-modal-background');


  function openModal(preview) {
    const block = preview.closest('.reel-block, .video-block');
    const leftDesc = block.querySelector('.modal-description-data.left');
    const rightDesc = block.querySelector('.modal-description-data.right');


    // Load video source
    if (preview.dataset.vimeoId) {
      iframe.src = `https://player.vimeo.com/video/${preview.dataset.vimeoId}?title=0&byline=0&portrait=0&autoplay=0`;
    } else if (preview.dataset.youtubeId) {
      const youtubeId = preview.dataset.youtubeId;
      const separator = youtubeId.includes('?') ? '&' : '?';
      iframe.src = `https://www.youtube.com/embed/${youtubeId}${separator}autoplay=0&rel=0`;
    } else if (preview.dataset.spotifyId) {
      iframe.src = `https://open.spotify.com/embed/track/${preview.dataset.spotifyId}?utm_source=generator`;
    }

    // Set descriptions
    videoModal.style.display = 'flex';
    modalLeft.innerHTML = leftDesc?.querySelector('p')?.innerHTML || '';
    modalRight.innerHTML = rightDesc?.querySelector('p')?.innerHTML || '';

    // Show modal with animation
    requestAnimationFrame(() => {
      modalBackground.classList.add('show');
      videoModal.classList.add('show');
      modalPlayer.classList.add('show');
      modalLeft.classList.add('show');
      modalRight.classList.add('show');
    });
  }

  function closeModal() {
    modalBackground.classList.remove('show');
    videoModal.classList.remove('show');
    modalPlayer.classList.remove('show');
    modalLeft.classList.remove('show');
    modalRight.classList.remove('show');
    setTimeout(() => {
      videoModal.style.display = 'none';
      iframe.src = '';
    }, 400);
  }

  // ========== Click handler ========== //
  let selectedPreview = null;

  previews.forEach(preview => {
    preview.addEventListener('click', (e) => {
      // desktop device
      if(!isMobile()) {
        openModal(preview);
      // mobile device
      } else if (isMobile()) {
          if (selectedPreview === preview) {
            resetPreview(preview);
            openModal(preview);
            selectedPreview = null;
          } else {
            if (selectedPreview) {
              resetPreview(selectedPreview);
            }
            selectedPreview = preview;
            activatePreview(preview);
          }
        }
    });
  });

  // Preview activate helper function
  function activatePreview(preview) {
    const block = preview.closest('.reel-block, .video-block');
    const leftDesc = block.querySelector('.reel-description.left, .video-description.left');
    const rightDesc = block.querySelector('.reel-description.right, .video-description.right');
    const thumb = preview.querySelector('.video-thumb');
    const playButton = preview.querySelector('.play-button');

    preview.classList.add('active');
    if(leftDesc) leftDesc.classList.add('show');
    if(rightDesc) rightDesc.classList.add('show');
    if (playButton) playButton.classList.add('show');

    if (thumb) thumb.style.filter = 'grayscale(0%) brightness(1)';
    preview.style.transform = 'scaleX(1.03)';
  }

  // Preview reset helper function
  function resetPreview(preview) {
    const block = preview.closest('.reel-block, .video-block');
    const leftDesc = block.querySelector('.reel-description.left, .video-description.left');
    const rightDesc = block.querySelector('.reel-description.right, .video-description.right');
    const thumb = preview.querySelector('.video-thumb');
    const playButton = preview.querySelector('.play-button');
    const video = preview.querySelector('.reel-preview-video, .video-preview-video');

    preview.classList.remove('active');
    if (leftDesc) leftDesc.classList.remove('show');
    if (rightDesc) rightDesc.classList.remove('show');
    if (playButton) playButton.classList.remove('show');

    if (thumb) thumb.style.filter = '';
    preview.style.transform = '';
  }

  // ========== Hover Text ========== //
  const contentContainer = document.querySelector('.content');
  const wrappers = document.querySelectorAll('.reel-wrapper, .video-wrapper');

  const toggleHoverTexts = (preview, add = true) => {
    if (!preview) return;
    const block = preview.closest('.reel-block, .video-block');
    const left = block?.querySelector('.reel-description.left, .video-description.left');
    const right = block?.querySelector('.reel-description.right, .video-description.right');
    left?.classList[add ? 'add' : 'remove']('show');
    right?.classList[add ? 'add' : 'remove']('show');
  };

  contentContainer.addEventListener('mouseover', e => {
    if (!isMobile()) {
      const preview = e.target.closest('.reel-preview, .video-preview');
      toggleHoverTexts(preview, true);
    }
  });

  contentContainer.addEventListener('mouseout', e => {
    if (!isMobile()) {
      const preview = e.target.closest('.reel-preview, .video-preview');
      toggleHoverTexts(preview, false);
    }
  });

  // ========== Disable Drag / Context Menu ========== //
  document.querySelectorAll('.reel-preview img, .reel-preview video, .video-preview img, .video-preview video, .gif')
    .forEach(media => {
      media.setAttribute('draggable', 'false');
  });

  document.addEventListener('contextmenu', function (event) {
    event.preventDefault()
    return false
  });

  // ========== Document Click (Consolidated) ========== //
  document.addEventListener('click', (e) => {
    //close dropdown
    if (!titleFilter.contains(e.target)) titleFilter.classList.remove('active');
    if (!hamburgerWrapper.contains(e.target)) hamburgerWrapper.classList.remove('active');

    // Close modal if clicking close button or outside modal player
    if (videoModal.classList.contains('show')) {
      if (e.target === closeModalButton || 
          e.target.closest('.close-modal-button') ||
          (!e.target.closest('.video-modal-player') && e.target !== modalPlayer)) {
        closeModal();
      }
    }
    
    if (isMobile() && selectedPreview) {
      const clickedPreview = e.target.closest('.reel-preview, .video-preview');

      if (!clickedPreview || clickedPreview !== selectedPreview) {
        resetPreview(selectedPreview);
        selectedPreview = null;
      }
    }
  });
});