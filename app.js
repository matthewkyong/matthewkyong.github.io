document.addEventListener('DOMContentLoaded', () => {
  // Contact Button
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

  // ------------ Title Filter --------------- //
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

  // Toggle dropdown
  selectedTitle.addEventListener('click', () => {
    titleFilter.classList.toggle('active');
  });

  // Handle option selection
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

  // Click outside closes dropdown
  document.addEventListener('click', (e) => {
    if (!titleFilter.contains(e.target)) {
      titleFilter.classList.remove('active');
    }
  });

  //-------------- VIDEO MODAL --------------- //
  const videoModal = document.querySelector('.video-modal');
  const iframe = videoModal.querySelector('iframe');
  const closeModal = videoModal.querySelector('.close-modal');
  const modalPlayer = videoModal.querySelector('.video-modal-player');
  const modalLeft = videoModal.querySelector('.modal-description.left');
  const modalRight = videoModal.querySelector('.modal-description.right');

  document.addEventListener('click', e => {
    const preview = e.target.closest('.video-preview, .reel-preview');

    if (preview) {

      if (preview.dataset.vimeoId) {
        iframe.src = `https://player.vimeo.com/video/${preview.dataset.vimeoId}?title=0&byline=0&portrait=0&autoplay=0`;
      }
      else if (preview.dataset.youtubeId) {
        iframe.src  = `https://www.youtube.com/embed/${preview.dataset.youtubeId}?autoplay=0&rel=0`;
      }
      
      videoModal.style.display = 'flex';

      const parentBlock = preview.parentElement;
      modalLeft.innerHTML = parentBlock.querySelector('.left p')?.innerHTML || '';
      modalRight.innerHTML = parentBlock.querySelector('.right p')?.innerHTML || '';

      requestAnimationFrame(() => {
        videoModal.classList.add('show');
        modalPlayer.classList.add('show');
        modalLeft.classList.add('show');
        modalRight.classList.add('show');
      });
      return;
    }

    if (videoModal.classList.contains('show')) {
      if (e.target === closeModal || !e.target.closest('.video-modal-player')) {
        videoModal.classList.remove('show');
        modalPlayer.classList.remove('show');
        modalLeft.classList.remove('show');
        modalRight.classList.remove('show');

        setTimeout(() => {
          videoModal.style.display = 'none';
          iframe.src = '';
        }, 400);
      }
    }
  });

  // ----------- TEXT ON HOVER -----------
  const contentContainer = document.querySelector('.content');

  contentContainer.addEventListener('mouseover', e => {
    const preview = e.target.closest('.reel-preview, .video-preview');
    if (!preview) return;

    const parent = preview.parentElement;
    parent.querySelector('.left')?.classList.add('show');
    parent.querySelector('.right')?.classList.add('show');
  });

  contentContainer.addEventListener('mouseout', e => {
    const preview = e.target.closest('.reel-preview, .video-preview');
    if (!preview) return;

    const parent = preview.parentElement;
    parent.querySelector('.left')?.classList.remove('show');
    parent.querySelector('.right')?.classList.remove('show');
  });


  document.querySelectorAll('.reel-preview img, .reel-preview video, .video-preview img, .video-preview video')
    .forEach(media => {
      media.setAttribute('draggable', 'false');
      media.addEventListener('contextmenu', e => e.preventDefault());
  });
});