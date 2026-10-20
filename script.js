const introScreen = document.querySelector(".intro-screen");

if (introScreen) {
  const removeIntro = () => introScreen.remove();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    removeIntro();
  } else {
    introScreen.addEventListener("animationend", (event) => {
      if (event.target === introScreen && event.animationName === "introScreenExit") {
        removeIntro();
      }
    });
    window.setTimeout(removeIntro, 3500);
  }
}

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

const contactDialog = document.querySelector("#contact-dialog");
const contactForm = document.querySelector("#contact-form");
const openContactForm = document.querySelector("#open-contact-form");
const closeContactForm = document.querySelector(".contact-dialog-close");

if (
  contactDialog instanceof HTMLDialogElement
  && contactForm instanceof HTMLFormElement
  && openContactForm instanceof HTMLButtonElement
  && closeContactForm instanceof HTMLButtonElement
) {
  openContactForm.addEventListener("click", () => contactDialog.showModal());
  closeContactForm.addEventListener("click", () => contactDialog.close());

  contactDialog.addEventListener("click", (event) => {
    if (event.target === contactDialog) contactDialog.close();
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get("name")).trim();
    const phone = String(formData.get("phone")).trim();
    const email = String(formData.get("email")).trim();
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nMobile: ${phone}\nEmail: ${email}`
    );

    window.location.href = `mailto:vivekaryavivekarya1@gmail.com?subject=${subject}&body=${body}`;
    contactDialog.close();
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

const reduceRevealMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealTargets = document.querySelectorAll(
  "main section[id]:not(#home) > *, main section[id]:not(#home) .project-card, main section[id]:not(#home) .contact-link"
);

if (!reduceRevealMotion.matches && revealTargets.length) {
  revealTargets.forEach((target, index) => {
    target.classList.add("scroll-reveal");
    target.style.setProperty("--reveal-delay", `${Math.min(index % 6, 4) * 75}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12,
    }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

const particleCanvas = document.querySelector(".particle-canvas");

if (particleCanvas instanceof HTMLCanvasElement) {
  const context = particleCanvas.getContext("2d");

  if (context) {
    const reduceParticleMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -1000, y: -1000 };
    const particles = [];
    let canvasWidth = 0;
    let canvasHeight = 0;
    let animationFrame = 0;

    const createParticles = () => {
      const area = canvasWidth * canvasHeight;
      const particleCount = Math.min(140, Math.max(45, Math.round(area / 11000)));

      particles.length = 0;
      for (let index = 0; index < particleCount; index += 1) {
        particles.push({
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
          velocityX: (Math.random() - 0.5) * 0.45,
          velocityY: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 1.6 + 1,
        });
      }
    };

    const resizeCanvas = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      particleCanvas.width = Math.round(canvasWidth * pixelRatio);
      particleCanvas.height = Math.round(canvasHeight * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createParticles();
      drawParticles(false);
    };

    const drawParticles = (moveParticles) => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      particles.forEach((particle) => {
        if (moveParticles) {
          particle.x += particle.velocityX;
          particle.y += particle.velocityY;

          if (particle.x < 0 || particle.x > canvasWidth) particle.velocityX *= -1;
          if (particle.y < 0 || particle.y > canvasHeight) particle.velocityY *= -1;

          const dx = pointer.x - particle.x;
          const dy = pointer.y - particle.y;
          const distanceToPointer = Math.hypot(dx, dy);

          if (distanceToPointer < 120 && distanceToPointer > 0) {
            const influence = (120 - distanceToPointer) / 120;
            particle.x -= (dx / distanceToPointer) * influence * 0.8;
            particle.y -= (dy / distanceToPointer) * influence * 0.8;
          }
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(0, 190, 255, 0.75)";
        context.shadowBlur = 10;
        context.shadowColor = "rgba(0, 190, 255, 0.75)";
        context.fill();
        context.shadowBlur = 0;
      });

      for (let firstIndex = 0; firstIndex < particles.length; firstIndex += 1) {
        for (let secondIndex = firstIndex + 1; secondIndex < particles.length; secondIndex += 1) {
          const first = particles[firstIndex];
          const second = particles[secondIndex];
          const distance = Math.hypot(first.x - second.x, first.y - second.y);

          if (distance < 135) {
            context.beginPath();
            context.moveTo(first.x, first.y);
            context.lineTo(second.x, second.y);
            context.strokeStyle = `rgba(0, 190, 255, ${(1 - distance / 135) * 0.32})`;
            context.lineWidth = 0.8;
            context.stroke();
          }
        }
      }
    };

    const animateParticles = () => {
      drawParticles(true);
      if (!document.hidden && !reduceParticleMotion.matches) {
        animationFrame = window.requestAnimationFrame(animateParticles);
      }
    };

    const startParticleAnimation = () => {
      window.cancelAnimationFrame(animationFrame);
      if (document.hidden) return;
      if (reduceParticleMotion.matches) {
        drawParticles(false);
      } else {
        animationFrame = window.requestAnimationFrame(animateParticles);
      }
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (reduceParticleMotion.matches) drawParticles(false);
    });
    document.addEventListener("visibilitychange", startParticleAnimation);
    reduceParticleMotion.addEventListener("change", startParticleAnimation);
    resizeCanvas();
    startParticleAnimation();
  }
}

const cursor = document.querySelector(".cursor-dot");
const trail = document.querySelector(".cursor-trail");
const cursorRing = document.querySelector(".cursor-ring");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (cursor && trail && cursorRing && finePointer.matches) {
  let pointerX = 0;
  let pointerY = 0;
  let ringX = 0;
  let ringY = 0;
  const trailPoints = [];
  const trailPointCount = 10;
  let hasPointerPosition = false;
  let cursorFrame = 0;
  const trailPath = trail.querySelector("path");
  const clickableSelector = 'a, button, input, select, textarea, summary, [role="button"], [onclick]';
  const textEntrySelector = 'input, textarea, select, [contenteditable="true"]';
  const cursorElements = [cursor, trail, cursorRing];

  const setTextEntryCursor = (target) => {
    const isTextEntry = target instanceof Element && Boolean(target.closest(textEntrySelector));
    cursorElements.forEach((element) => element.classList.toggle("is-hidden", isTextEntry));
  };

  const scheduleCursorFrame = () => {
    if (!cursorFrame) cursorFrame = window.requestAnimationFrame(animateCursor);
  };

  function animateCursor() {
    cursorFrame = 0;
    ringX += (pointerX - ringX) * 0.3;
    ringY += (pointerY - ringY) * 0.3;
    cursorRing.style.setProperty("--cursor-x", `${ringX}px`);
    cursorRing.style.setProperty("--cursor-y", `${ringY}px`);

    let isMoving = Math.abs(pointerX - ringX) > 0.35 || Math.abs(pointerY - ringY) > 0.35;

    if (hasPointerPosition && !reduceMotion.matches) {
      trailPoints[0].x += (pointerX - trailPoints[0].x) * 0.55;
      trailPoints[0].y += (pointerY - trailPoints[0].y) * 0.55;
      isMoving ||= Math.abs(pointerX - trailPoints[0].x) > 0.35
        || Math.abs(pointerY - trailPoints[0].y) > 0.35;

      for (let index = 1; index < trailPoints.length; index += 1) {
        const previous = trailPoints[index - 1];
        const point = trailPoints[index];
        point.x += (previous.x - point.x) * 0.42;
        point.y += (previous.y - point.y) * 0.42;
        isMoving ||= Math.abs(previous.x - point.x) > 0.35
          || Math.abs(previous.y - point.y) > 0.35;
      }

      let pathData = `M ${trailPoints[0].x} ${trailPoints[0].y}`;

      for (let index = 1; index < trailPoints.length - 1; index += 1) {
        const current = trailPoints[index];
        const next = trailPoints[index + 1];
        pathData += ` Q ${current.x} ${current.y} ${(current.x + next.x) / 2} ${(current.y + next.y) / 2}`;
      }

      const lastPoint = trailPoints[trailPoints.length - 1];
      pathData += ` L ${lastPoint.x} ${lastPoint.y}`;
      trailPath.setAttribute("d", pathData);
    }

    if (isMoving) scheduleCursorFrame();
  }

  const updateCursorPosition = (event) => {
    if (event.pointerType === "touch") return;

    document.documentElement.classList.add("custom-cursor-active");
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
    cursor.classList.add("is-visible");
    cursorRing.classList.add("is-visible");

    if (!hasPointerPosition) {
      ringX = pointerX;
      ringY = pointerY;
      trailPoints.length = 0;
      for (let index = 0; index < trailPointCount; index += 1) {
        trailPoints.push({ x: pointerX, y: pointerY });
      }
      hasPointerPosition = true;
    }

    trail.classList.toggle("is-visible", !reduceMotion.matches);
    scheduleCursorFrame();
  };

  document.addEventListener("pointermove", updateCursorPosition);
  document.addEventListener("pointerenter", updateCursorPosition);

  document.addEventListener("pointerleave", () => {
    document.documentElement.classList.remove("custom-cursor-active");
    cursor.classList.remove("is-visible");
    trail.classList.remove("is-visible");
    cursorRing.classList.remove("is-visible", "is-clickable");
    hasPointerPosition = false;
  });

  document.addEventListener("pointerover", (event) => {
    const target = event.target instanceof Element ? event.target.closest(clickableSelector) : null;
    cursorRing.classList.toggle("is-clickable", Boolean(target));
    setTextEntryCursor(event.target);
  });

  document.addEventListener("pointerout", (event) => {
    setTextEntryCursor(event.relatedTarget);
    const nextTarget = event.relatedTarget instanceof Element
      ? event.relatedTarget.closest(clickableSelector)
      : null;

    if (!nextTarget) cursorRing.classList.remove("is-clickable");
  });

  document.addEventListener("click", () => {
    cursorRing.classList.remove("is-clicked");
    void cursorRing.offsetWidth;
    cursorRing.classList.add("is-clicked");
  });
}
