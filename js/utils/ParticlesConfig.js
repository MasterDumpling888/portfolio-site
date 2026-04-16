/* ========================================
   Particles.js Configuration
   Powered by particles.js by Vincent Garreau
   https://github.com/VincentGarreau/particles.js/
   ======================================== */

/**
 * Get particles config based on current theme
 * @param {string} theme - 'dark' or 'light'
 * @returns {Object} Configuration object
 */
export const getParticlesConfig = (theme = 'dark') => {
  const isDark = theme === 'dark';

  // Nebula Palette based on project variables
  const darkNebula = [
    "#8ff5ff", // Primary Cyan
    "#ff59e3", // Secondary Magenta
    "#fdd400", // Tertiary Gold
    "#ffffff"  // White stars
  ];

  const lightNebula = [
    "#008fa0", // Darker Cyan
    "#d112b3", // Darker Magenta
    "#b39600", // Darker Gold
    "#1a1c22"  // Dark stars
  ];

  return {
    "particles": {
      "number": {
        "value": 100,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": isDark ? darkNebula : lightNebula
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        }
      },
      "opacity": {
        "value": isDark ? 0.6 : 0.4,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 2.5,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 2,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": isDark ? "#8ff5ff" : "#008fa0",
        "opacity": isDark ? 0.15 : 0.3,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 0.6,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "window",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": false,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 200,
          "line_linked": {
            "opacity": 0.8
          }
        },
        "push": {
          "particles_nb": 4
        }
      }
    },
    "retina_detect": true
  };
};
