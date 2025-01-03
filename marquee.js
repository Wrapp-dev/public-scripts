$(document).ready(function () {
  // Default settings
  const defaultMarqueeSettings = {
    direction: 'left', // 'left' or 'right'
    speed: 50, // Speed in pixels per second
    pauseOnHover: false,
  };

  // Initialize marquee
  $('[data-wr-marquee]').each(function () {
    const marquee = $(this);

    // Merge default settings with data attributes
    const settings = {
      ...defaultMarqueeSettings,
      direction: marquee.data('wr-direction') || defaultMarqueeSettings.direction,
      speed: parseFloat(marquee.data('wr-speed')) || defaultMarqueeSettings.speed,
      pauseOnHover: marquee.data('wr-pause-on-hover') !== undefined ? true : defaultMarqueeSettings.pauseOnHover,
    };

    let wrapper = marquee.find('.marquee-wrapper');
    if (!wrapper.length) {
      marquee.wrapInner('<div class="marquee-wrapper"></div>');
      wrapper = marquee.find('.marquee-wrapper');
    }

    const updateMarquee = () => {
      const marqueeWidth = marquee.outerWidth();
      const wrapperWidth = wrapper[0].scrollWidth;

      // Duplicate content to fill the screen width
      const repeatCount = Math.ceil((marqueeWidth * 2) / wrapperWidth);
      const originalContent = wrapper.children().clone();
      wrapper.empty();
      for (let i = 0; i < repeatCount; i++) {
        wrapper.append(originalContent.clone());
      }

      // Set animation
      const totalDistance = wrapper[0].scrollWidth;
      const duration = (totalDistance / settings.speed) * 1000; // Convert to milliseconds

      const animationDirection = settings.direction === 'left' ? '-=' : '+=';
      const keyframes = `@keyframes marquee {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(${animationDirection}${wrapperWidth}px);
        }
      }`;

      // Inject keyframes into a style tag
      const styleTag = $('<style></style>').text(keyframes);
      $('head').append(styleTag);

      wrapper.css({
        display: 'flex',
        animation: `marquee ${duration}ms linear infinite`,
      });

      // Pause on hover
      if (settings.pauseOnHover) {
        marquee.on('mouseenter', function () {
          wrapper.css('animation-play-state', 'paused');
        });
        marquee.on('mouseleave', function () {
          wrapper.css('animation-play-state', 'running');
        });
      }
    };

    // Initial setup
    updateMarquee();

    // Recalculate on window resize
    $(window).on('resize', updateMarquee);
  });
});
