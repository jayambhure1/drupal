(function (Drupal, once) {
  Drupal.behaviors.myClaroSubthemeMenu = {
    attach(context) {
      once('my-claro-subtheme-menu', '.menu-toggle', context).forEach((toggle) => {
        const navigation = document.getElementById(toggle.getAttribute('aria-controls'));

        if (!navigation) {
          console.error('The primary navigation controlled by the menu toggle was not found.');
          return;
        }

        const closeMenu = () => {
          toggle.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-label', 'Open menu');
          navigation.classList.remove('is-open');
        };

        toggle.addEventListener('click', () => {
          const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

          toggle.setAttribute('aria-expanded', String(!isExpanded));
          toggle.setAttribute('aria-label', isExpanded ? 'Open menu' : 'Close menu');
          navigation.classList.toggle('is-open', !isExpanded);
        });

        navigation.addEventListener('click', (event) => {
          if (event.target.closest('a')) {
            closeMenu();
          }
        });

        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            closeMenu();
            toggle.focus();
          }
        });

        window.matchMedia('(min-width: 993px)').addEventListener('change', closeMenu);
      });
    },
  };
})(Drupal, once);
