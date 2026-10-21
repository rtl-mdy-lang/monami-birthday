/* Monami's Rose Garden — interactions and lightweight canvas effects */
(() => {
  const $ = (selector) => document.querySelector(selector);
  const intro = $("#intro");
  const experience = $("#experience");
  const openGift = $("#openGift");
  const petalsCanvas = $("#petals");
  const ctx = petalsCanvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // A respectful, crush-appropriate note: sincere without assuming a relationship.
  const letterText = `I hope turning 19 brings you a year full of lovely surprises, new adventures, and little moments that make you genuinely happy.

You have a way of making the world feel a little brighter just by being yourself. I hope you never forget how special that is, and I hope this year gives you plenty of reasons to feel proud of the person you are becoming.

May your dreams feel closer, your worries feel lighter, and your days be filled with people who appreciate your smile and your heart. Keep growing, keep glowing, and keep being wonderfully you.

I wanted to make you something small to remind you that someone is wishing you nothing but good things today. No big expectations — just a genuine wish that your 19th year turns out beautiful in all the ways that matter to you.`;

  openGift.addEventListener("click", () => {
    openGift.disabled = true;
    intro.classList.add("leaving");
    intro.style.transition = "opacity .8s ease, transform .8s ease";
    intro.style.opacity = "0";
    intro.style.transform = "scale(1.025)";
    window.setTimeout(() => {
      intro.classList.add("hidden");
      experience.classList.remove("hidden");
      document.body.classList.remove("locked");
      document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
      window.scrollTo({top: 0, behavior: reduceMotion ? "auto" : "smooth"});
      startPetals();
    }, reduceMotion ? 0 : 700);
  });

  // Scroll reveal animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.14});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // Interactive letter envelope + typewriter effect
  const envelope = $("#openLetter");
  const paper = $("#letterPaper");
  const letterBody = $("#letterBody");
  const letterHint = $("#letterHint");
  let letterOpened = false;
  envelope.addEventListener("click", () => {
    if (letterOpened) {
      paper.scrollIntoView({behavior: reduceMotion ? "auto" : "smooth", block: "center"});
      return;
    }
    letterOpened = true;
    envelope.classList.add("open");
    letterHint.textContent = "A little note, written with care";
    window.setTimeout(() => {
      paper.classList.add("show");
      paper.scrollIntoView({behavior: reduceMotion ? "auto" : "smooth", block: "center"});
      typeText(letterText, letterBody, reduceMotion ? 0 : 17);
    }, reduceMotion ? 0 : 550);
  });

  function typeText(text, element, delay) {
    element.textContent = "";
    if (!delay) { element.textContent = text; return; }
    let i = 0;
    const timer = window.setInterval(() => {
      element.textContent += text.charAt(i);
      i++;
      if (i >= text.length) window.clearInterval(timer);
    }, delay);
  }

  // Birthday wish: extinguish candles and release a short confetti burst
  const wishButton = $("#wishButton");
  const cakeStage = $(".cake-stage");
  const wishResult = $("#wishResult");
  wishButton.addEventListener("click", () => {
    cakeStage.classList.add("wished");
    wishResult.textContent = "Wish made. May something wonderful find its way to you. ✨";
    wishButton.textContent = "A wish sent into the universe ✨";
    wishButton.disabled = true;
    burstConfetti(100);
  });

  // Final full-screen surprise
  const modal = $("#finalModal");
  $("#lastSurprise").addEventListener("click", () => {
    modal.classList.remove("hidden");
    document.body.classList.add("locked");
    burstConfetti(150);
    $("#closeModal").focus();
  });
  function closeModal() {
    modal.classList.add("hidden");
    document.body.classList.remove("locked");
    $("#lastSurprise").focus();
  }
  $("#closeModal").addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.classList.contains("hidden")) closeModal(); });

  // Optional local audio. Add a file named music.mp3 and set the audio src in index.html.
  const audio = $("#birthdayAudio");
  const musicToggle = $("#musicToggle");
  const musicLabel = $("#musicLabel");
  let musicOn = false;
  musicToggle.addEventListener("click", async () => {
    if (!audio.getAttribute("src")) {
      musicLabel.textContent = "Add music.mp3";
      musicToggle.title = "Add a licensed music file and set its src in index.html";
      return;
    }
    try {
      if (!musicOn) {
        await audio.play();
        musicOn = true;
        musicLabel.textContent = "Music on";
        musicToggle.setAttribute("aria-pressed", "true");
      } else {
        audio.pause();
        musicOn = false;
        musicLabel.textContent = "Music off";
        musicToggle.setAttribute("aria-pressed", "false");
      }
    } catch (_) {
      musicLabel.textContent = "Tap to retry";
    }
  });

  // Lightweight rose-petal canvas animation
  let petals = [];
  let animationId = null;
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    petalsCanvas.width = Math.floor(window.innerWidth * dpr);
    petalsCanvas.height = Math.floor(window.innerHeight * dpr);
    petalsCanvas.style.width = `${window.innerWidth}px`;
    petalsCanvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    petals = Array.from({length: window.innerWidth < 600 ? 14 : 24}, () => newPetal(true));
  }
  function newPetal(initial = false) {
    return {x: Math.random() * window.innerWidth, y: initial ? Math.random() * window.innerHeight : -20,
      size: 3 + Math.random() * 5, speed: .45 + Math.random() * .9,
      drift: (Math.random() - .5) * .65, rotation: Math.random() * Math.PI,
      spin: (Math.random() - .5) * .035, alpha: .22 + Math.random() * .42};
  }
  function drawPetals() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    petals.forEach(p => {
      p.y += p.speed; p.x += Math.sin(p.y * .012) * .45 + p.drift;
      p.rotation += p.spin;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation);
      ctx.globalAlpha = p.alpha; ctx.fillStyle = Math.random() > .5 ? "#d66b84" : "#d9b879";
      ctx.beginPath(); ctx.ellipse(0, 0, p.size * .62, p.size * 1.25, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      if (p.y > window.innerHeight + 20 || p.x < -30 || p.x > window.innerWidth + 30) Object.assign(p, newPetal());
    });
    animationId = requestAnimationFrame(drawPetals);
  }
  function startPetals() {
    resizeCanvas();
    if (reduceMotion) return;
    if (animationId) cancelAnimationFrame(animationId);
    drawPetals();
  }
  window.addEventListener("resize", resizeCanvas);

  // Small canvas confetti burst; no external animation library required.
  function burstConfetti(count) {
    if (reduceMotion) return;
    const colors = ["#d9b879", "#f0b9c7", "#c65b78", "#f9eee8", "#7b2947"];
    const pieces = Array.from({length: count}, () => ({
      x: window.innerWidth / 2 + (Math.random() - .5) * 100,
      y: window.innerHeight * .42,
      vx: (Math.random() - .5) * 10, vy: -3 - Math.random() * 8,
      size: 3 + Math.random() * 5, life: 70 + Math.random() * 50,
      color: colors[Math.floor(Math.random() * colors.length)], angle: Math.random() * 6, spin: (Math.random() - .5) * .25
    }));
    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      // Keep background petals visible while the burst is active.
      pieces.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += .14; p.vx *= .992; p.angle += p.spin; p.life--;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle); ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 30));
        ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.7); ctx.restore();
      });
      if (pieces.some(p => p.life > 0)) requestAnimationFrame(tick);
      else { ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
    };
    tick();
  }

  // Initial viewport begins clean; petals start after opening the surprise.
  resizeCanvas();
})();