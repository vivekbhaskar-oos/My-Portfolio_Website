const menuButton = document.querySelector('.menu-btn');
const navMenu = document.querySelector('.navbar nav');
const navLinks = document.querySelectorAll('.navbar nav a');
const sections = document.querySelectorAll('main section[id]');

if (menuButton && navMenu) {
  menuButton.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('show');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? '✕' : '☰';
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('show');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.textContent = '☰';
    });
  });
}

if (sections.length && navLinks.length) {
  const activateLink = (id) => {
    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isCurrent);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activateLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: '-35% 0px -45% 0px',
      threshold: 0.2,
    }
  );

  sections.forEach((section) => observer.observe(section));
}
