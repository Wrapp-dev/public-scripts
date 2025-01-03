$(document).ready(function () {
  // Default settings
  const defaultMarqueeSettings = {
    direction: 'left', // 'left' or 'right'
    speed: 100, // Speed in pixels per second
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

    const updateMarquee = () => {
      const marqueeWidth = marquee.outerWidth();
      let contentWidth = marquee[0].scrollWidth;

      // Duplicate content to ensure seamless scrolling
      const originalContent = marquee.children().clone();
      while (contentWidth < marqueeWidth * 2) {
        marquee.append(originalContent.clone());
        contentWidth = marquee[0].scrollWidth;
      }

      // Update content width after duplication
      const totalContentWidth = marquee[0].scrollWidth;

      // Set animation
      const duration = (totalContentWidth / settings.speed) * 1000; // Convert to milliseconds

      const animationDirection = settings.direction === 'left' ? '-' : '+';
      const keyframes = `@keyframes marquee {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(${animationDirection}${totalContentWidth / 2}px);
        }
      }`;

      // Inject keyframes into a style tag
      const styleTag = $('<style></style>').text(keyframes);
      $('head').append(styleTag);

      marquee.css({
        display: 'flex',
        animation: `marquee ${duration}ms linear infinite`,
      });

      // Pause on hover
      if (settings.pauseOnHover) {
        marquee.on('mouseenter', function () {
          marquee.css('animation-play-state', 'paused');
        });
        marquee.on('mouseleave', function () {
          marquee.css('animation-play-state', 'running');
        });
      }
    };

    // Initial setup
    updateMarquee();

    // Recalculate on window resize
    $(window).on('resize', updateMarquee);
  });
});
