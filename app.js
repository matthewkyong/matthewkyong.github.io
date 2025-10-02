document.addEventListener('DOMContentLoaded', () =>{
  // Contact Button
  const contactButton = document.getElementById('copy-email');
  const tooltip = contactButton.nextElementSibling;
  const emailAddress = 'matthewkyong@gmail.com';

  let tooltipVisible = false;

  contactButton.addEventListener('click', async () => {
    navigator.clipboard.writeText(emailAddress).then(() => {
      if (!tooltipVisible){
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
          if (!filter) {
              block.style.display = 'flex';
          } else {
              block.style.display = (block.dataset.type === filter) ? 'flex' : 'none';
          }
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
              // ALL selected
              selectedTitle.textContent = 'SOUND DESIGNER';
              dropdownArrow.style.display = 'inline';
              selectedTitle.style.color = '#ffffff';
          } else {
              // Specific title
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

  document.addEventListener('click', e => {
    const preview = e.target.closest('.video-preview, .reel-preview');

    if (preview) {
      iframe.src = `https://player.vimeo.com/video/${preview.dataset.vimeoId}?title=0&byline=0&portrait=0&autoplay=0`;
      videoModal.style.display = 'flex';

      // Trigger fade in
      requestAnimationFrame(() => {
        videoModal.classList.add('show');
        modalPlayer.classList.add('show');
      });
      return;
    }

    if (videoModal.classList.contains('show')) {
      if (e.target === closeModal || !e.target.closest('.video-modal-player')) {
        // Trigger fade out
        videoModal.classList.remove('show');
        modalPlayer.classList.remove('show');

        // Wait for transition, then hide and reset iframe
        setTimeout(() => {
          videoModal.style.display = 'none';
          iframe.src = '';
        }, 400); // match CSS transition duration
      }
    }
  });

  const previews = document.querySelectorAll('.reel-preview, .video-preview');

  previews.forEach(preview => {
    preview.addEventListener('mouseenter', () => {
      const parent = preview.parentElement;
      const leftDesc = parent.querySelector('.left');
      const rightDesc = parent.querySelector('.right');
      if (leftDesc) leftDesc.classList.add('show');
      if (rightDesc) rightDesc.classList.add('show');
    });

    preview.addEventListener('mouseleave', () => {
      const parent = preview.parentElement;
      const leftDesc = parent.querySelector('.left');
      const rightDesc = parent.querySelector('.right');
      if (leftDesc) leftDesc.classList.remove('show');
      if (rightDesc) rightDesc.classList.remove('show');
    });
  });
});