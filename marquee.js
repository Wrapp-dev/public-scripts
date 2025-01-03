$(document).ready(function () {
  // Default settings
  const defaultMarqueeSettings = {
    direction: 'left', // 'left' or 'right'
    speed: 50, // Speed in pixels per second
    pauseOnHover: true,
  };

  // Initialize marquee
  $('[data-wr-marquee]').each(function () {
    const marquee = $(this);

    // Merge default settings with data attributes
    const settings = {
      ...defaultMarqueeSettings,
      direction: marquee.data('wr-direction') || defaultMarqueeSettings.direction,
      speed: parseFloat(marquee.data('wr-speed')) || defaultMarqueeSettings.speed,
      pauseOnHover: marquee.data('wr-pause-on-hover') !== undefined ? marquee.data('wr-pause-on-hover') : defaultMarqueeSettings.pauseOnHover,
    };

    const updateMarquee = () => {
      const marqueeWidth = marquee.outerWidth();
      const contentWidth = marquee[0].scrollWidth;

      // Duplicate content to fill the screen width
      const repeatCount = Math.ceil((marqueeWidth * 2) / contentWidth);
      const originalContent = marquee.children().clone();
      marquee.empty();
      for (let i = 0; i < repeatCount; i++) {
        marquee.append(originalContent.clone());
      }

      // Set animation
      const totalDistance = marquee[0].scrollWidth;
      const duration = (totalDistance / settings.speed) * 1000; // Convert to milliseconds

      const animationDirection = settings.direction === 'left' ? '-=' : '+=');
      const keyframes = `@keyframes marquee {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(${animationDirection}${contentWidth}px);
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
