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

    // Generate a unique ID for each marquee
    const uniqueId = `marquee-${Math.random().toString(36).substr(2, 9)}`;

    // Merge default settings with data attributes
    const settings = {
      ...defaultMarqueeSettings,
      direction: marquee.data('wr-direction') || defaultMarqueeSettings.direction,
      speed: parseFloat(marquee.data('wr-speed')) || defaultMarqueeSettings.speed,
      pauseOnHover: marquee.data('wr-pause-on-hover') !== undefined ? true : defaultMarqueeSettings.pauseOnHover,
    };

    const animationDirection = settings.direction === 'left' ? '-' : '';
    const interactions = marquee.data('wr-interactions') !== undefined ? true : false;

    // Wrap content in an inner container
    const innerContainer = $('<div class="marquee-inner"></div>');
    innerContainer.append(marquee.children().clone(true));
    marquee.empty().append(innerContainer);

    marquee.css({
      display: 'flex',
      overflow: 'hidden',
    });

    innerContainer.css({
      display: 'flex',
      gap: `${parseFloat(marquee.css('gap')) || 0}px`, // Include gap
      width: 'max-content',
    });

    const updateMarquee = () => {
      const marqueeWidth = marquee.outerWidth();
      let contentWidth = innerContainer[0].scrollWidth;

      // Duplicate content to ensure seamless scrolling
      while (contentWidth < marqueeWidth * 2) {
        innerContainer.append(innerContainer.children().clone(true));
        contentWidth = innerContainer[0].scrollWidth;
      }

      // Restart Webflow interactions
      if (interactions) Webflow.require('ix2').init();

      // Update content width after duplication
      const totalContentWidth = innerContainer[0].scrollWidth;

      // Set animation
      const duration = (totalContentWidth / settings.speed) * 1000; // Convert to milliseconds

      const keyframes = `@keyframes ${uniqueId} {
        from {
          transform: translateX(${settings.direction} === 'left' ? 0 : -totalContentWidth / 2}px);
        }
        to {
          transform: translateX(${settings.direction} === 'left' ? -totalContentWidth / 2 : 0}px);
        }
      }`;

      // Inject keyframes into a style tag
      const styleTag = $(`<style id="${uniqueId}-style"></style>`).text(keyframes);
      $(`head #${uniqueId}-style`).remove(); // Remove existing styles to prevent duplication
      $('head').append(styleTag);

      innerContainer.css({
        animation: `${uniqueId} ${duration}ms linear infinite`,
      });

      // Pause on hover
      if (settings.pauseOnHover) {
        marquee.on('mouseenter', function () {
          innerContainer.css('animation-play-state', 'paused');
        });
        marquee.on('mouseleave', function () {
          innerContainer.css('animation-play-state', 'running');
        });
      }
    };

    // Initial setup
    updateMarquee();

    // Recalculate on window resize
    $(window).on('resize', updateMarquee);
  });
});
