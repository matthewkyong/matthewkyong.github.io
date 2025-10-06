document.addEventListener('DOMContentLoaded', () => {
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
      block.style.display = !filter || block.dataset.type === filter ? 'flex' : 'none';
    });
  }

  selectedTitle.addEventListener('click', () => {titleFilter.classList.toggle('active');});

  titleOptions.forEach(option => {
    option.addEventListener('click', () => {
      const filter = option.dataset.filter;
      filterContent(filter);

      if (!filter) {
        selectedTitle.textContent = 'SOUND DESIGNER';
        dropdownArrow.style.display = 'inline';
        selectedTitle.style.color = '#ffffff';
      } else {
        selectedTitle.textContent = option.textContent;
        dropdownArrow.style.display = 'none';
        selectedTitle.style.color = '#e2a6bf';
      }
      titleFilter.classList.remove('active');
    });
  });

  // ========== Helper Functions ========== //
  const getDescriptions = (preview) => ({
    left: preview.parentElement.querySelector('.left'),
    right: preview.parentElement.querySelector('.right')
  });

  const togglePreviewGif = (preview, showGif = false) => {
    const thumb = preview.querySelector('.reel-thumb, .video-thumb');
    const gif = preview.querySelector('.reel-gif, .video-gif');
    if (thumb) thumb.style.opacity = showGif ? '0' : '1';
    if (gif) gif.style.display = showGif ? 'block' : '';
  };

  const resetPreview = (preview) => {
    preview.style.transform = '';
    togglePreviewGif(preview, false);
    const { left, right } = getDescriptions(preview);
    left?.classList.remove('show');
    right?.classList.remove('show');
    
    const playBtn = preview.querySelector('.play-button');
    if (playBtn) playBtn.classList.remove('show');
  };

  function isMobileLayout() {
    return window.innerWidth <= 800;
  }

  // ========== Video Modal ========== //
  const videoModal = document.querySelector('.video-modal');
  const iframe = videoModal.querySelector('iframe');
  const closeModal = videoModal.querySelector('.close-modal');
  const modalPlayer = videoModal.querySelector('.video-modal-player');
  const modalLeft = videoModal.querySelector('.modal-description.left');
  const modalRight = videoModal.querySelector('.modal-description.right');

  const previews = document.querySelectorAll('.reel-preview, .video-preview');

  previews.forEach(preview => {
    let activated = false; // tracks first tap on mobile

    preview.addEventListener('click', (e) => {
      const { left, right } = getDescriptions(preview);

      // --- MOBILE FIRST TAP ---
      if (isMobileLayout() && !activated) {
        e.preventDefault(); // prevent modal
        activated = true;

        togglePreviewGif(preview, true);
        preview.style.transition = 'transform 0.3s ease';
        preview.style.transform = 'scaleX(1.03)';
        left?.classList.add('show');
        right?.classList.add('show');

        let playBtn = preview.querySelector('.play-button');
        if (!playBtn) {
          playBtn = document.createElement('div');
          playBtn.className = 'play-button';
          playBtn.innerHTML = '▶';
          preview.appendChild(playBtn);
        }
        playBtn.classList.add('show');

        const outsideClick = (ev) => {
          if (!preview.contains(ev.target)) {
            resetPreview(preview);
            activated = false;
            document.removeEventListener('click', outsideClick);
          }
        };
        document.addEventListener('click', outsideClick);
        return; // exit to prevent modal opening
      }

      // --- SECOND TAP / DESKTOP CLICK ---
      activated = false;
      resetPreview(preview);

      // Load video
      if (preview.dataset.vimeoId) {
        iframe.src = `https://player.vimeo.com/video/${preview.dataset.vimeoId}?title=0&byline=0&portrait=0&autoplay=0`;
      } else if (preview.dataset.youtubeId) {
        iframe.src = `https://www.youtube.com/embed/${preview.dataset.youtubeId}?autoplay=0&rel=0`;
      }

      videoModal.style.display = 'flex';
      modalLeft.innerHTML = left?.querySelector('p')?.innerHTML || '';
      modalRight.innerHTML = right?.querySelector('p')?.innerHTML || '';

      requestAnimationFrame(() => {
        videoModal.classList.add('show');
        modalPlayer.classList.add('show');
        modalLeft.classList.add('show');
        modalRight.classList.add('show');
      });
    });
  });

  // ========== Hover Text ========== //
  const contentContainer = document.querySelector('.content');

  const toggleHoverTexts = (preview, add = true) => {
    if (!preview) return;
    const { left, right } = getDescriptions(preview);
    left?.classList[add ? 'add' : 'remove']('show');
    right?.classList[add ? 'add' : 'remove']('show');
  };

  contentContainer.addEventListener('mouseover', e => {
    if (!isMobileLayout()) toggleHoverTexts(e.target.closest('.reel-preview, .video-preview'), true);
  });

  contentContainer.addEventListener('mouseout', e => {
    if (!isMobileLayout()) toggleHoverTexts(e.target.closest('.reel-preview, .video-preview'), false);
  });

  // ========== Disable Drag / Context Menu ========== //
  document.querySelectorAll('.reel-preview img, .reel-preview video, .video-preview img, .video-preview video')
    .forEach(media => {
      media.setAttribute('draggable', 'false');
      media.addEventListener('contextmenu', e => e.preventDefault());
  });

  // ========== Window Resize ========== //
  let wasMobile = isMobileLayout();
  window.addEventListener('resize', () => {
    const nowMobile = isMobileLayout();
    if (wasMobile !== nowMobile) previews.forEach(resetPreview);
    wasMobile = nowMobile;
  });

  // ========== Document Click (Consolidated) ========== //
  document.addEventListener('click', (e) => {
    //close dropdown
    if (!titleFilter.contains(e.target)) titleFilter.classList.remove('active');

    //close modal
    if (videoModal.classList.contains('show') &&
        (e.target === closeModal || !e.target.closest('.video-modal-player'))){
      videoModal.classList.remove('show');
      modalPlayer.classList.remove('show');
      modalLeft.classList.remove('show');
      modalRight.classList.remove('show');
      setTimeout(() => { videoModal.style.display = 'none'; iframe.src = ''; }, 400);
    }
  });
});