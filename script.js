/* ============================================
   SORRY SITE — FULL SCRIPT
   ============================================ */
(function () {
    'use strict';

    /* ---------- DOM refs ---------- */
    var sections = document.querySelectorAll('.snap-section');
    var dots = document.querySelectorAll('.nav-dot');
    var canvas = document.getElementById('particleCanvas');
    var ctx = canvas.getContext('2d');
    var floatingBox = document.getElementById('floatingHearts');
    var forgiveBtn = document.getElementById('forgiveBtn');
    var explosionLayer = document.getElementById('explosionLayer');
    var forgiveOverlay = document.getElementById('forgiveOverlay');
    var openHeartBtn = document.getElementById('openHeartBtn');
    var typedText = document.getElementById('typedText');

    /* ============================================
       1) PARTICLE CANVAS
       ============================================ */
    var particles = [];
    var PARTICLE_COUNT = 45;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function initParticles() {
        particles = [];
        for (var i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.4 + 0.4,
                dx: (Math.random() - 0.5) * 0.25,
                dy: (Math.random() - 0.5) * 0.25,
                alpha: Math.random() * 0.35 + 0.08,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.x += p.dx;
            p.y += p.dy;
            p.pulse += 0.02;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            var a = p.alpha + Math.sin(p.pulse) * 0.12;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,128,171,' + a + ')';
            ctx.fill();
        }
        requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    initParticles();
    drawParticles();
    window.addEventListener('resize', resizeCanvas);

    /* ============================================
       2) FLOATING BG HEARTS
       ============================================ */
    var heartEmojis = ['❤️', '💖', '💕', '🩷', '💗'];

    function spawnFloatingHeart() {
        var el = document.createElement('span');
        el.className = 'bg-heart';
        el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.fontSize = (Math.random() * 12 + 9) + 'px';
        var dur = Math.random() * 9 + 9;
        el.style.animationDuration = dur + 's';
        floatingBox.appendChild(el);
        setTimeout(function () { el.remove(); }, dur * 1000);
    }

    setInterval(spawnFloatingHeart, 1400);
    for (var i = 0; i < 5; i++) setTimeout(spawnFloatingHeart, i * 400);

    /* ============================================
       3) CURSOR HEART TRAIL
       ============================================ */
    var lastTrail = 0;
    document.addEventListener('mousemove', function (e) {
        var now = Date.now();
        if (now - lastTrail < 90) return;
        lastTrail = now;
        var h = document.createElement('span');
        h.className = 'cursor-heart';
        h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        h.style.left = e.clientX + 'px';
        h.style.top = e.clientY + 'px';
        h.style.setProperty('--dx', (Math.random() - 0.5) * 50 + 'px');
        h.style.setProperty('--r', (Math.random() - 0.5) * 150 + 'deg');
        document.body.appendChild(h);
        setTimeout(function () { h.remove(); }, 1000);
    });

    /* ============================================
       4) SECTION NAV DOTS
       ============================================ */
    var secObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var idx = Array.from(sections).indexOf(entry.target);
                if (idx !== -1) {
                    dots.forEach(function (d, i) {
                        d.classList.toggle('active', i === idx);
                    });
                }
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(function (sec) { secObserver.observe(sec); });

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            var idx = parseInt(this.getAttribute('data-index'));
            if (sections[idx]) sections[idx].scrollIntoView({ behavior: 'smooth' });
        });
    });

    /* ============================================
       5) SCROLL-TRIGGERED ANIM ITEMS
       ============================================ */
    var animObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.anim-item').forEach(function (el) {
        animObs.observe(el);
    });

    /* ============================================
       6) OPEN HEART → scroll to apology
       ============================================ */
    openHeartBtn.addEventListener('click', function () {
        sections[1].scrollIntoView({ behavior: 'smooth' });
    });

    /* ============================================
       7) TYPING ANIMATION
       ============================================ */
    var finalMsg = "Shivani,\n\nI'm reaching out because I truly want to talk with you.\nNot to argue, not to defend myself,\nbut to listen and understand you better.\n\nI know I made mistakes.\nI know my actions hurt you.\nI've thought about it deeply,\nand I'm working to change.\n\nI'm not here to pressure you.\nI just want one honest conversation,\none chance to clear the silence between us.\n\nI care about you deeply.\nI am here,\nand I will never leave you. \u2764\ufe0f";
    var msgIndex = 0;
    var typingActive = false;
    var typingDone = false;

    var msgObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !typingDone) {
                typingActive = true;
                typeNext();
            }
        });
    }, { threshold: 0.35 });
    msgObs.observe(document.getElementById('sec7'));

    function typeNext() {
        if (!typingActive || msgIndex >= finalMsg.length) {
            typingDone = true;
            return;
        }
        var char = finalMsg[msgIndex];
        if (char === '\n') {
            typedText.innerHTML += '<br>';
        } else {
            typedText.innerHTML += char;
        }
        msgIndex++;
        var delay = char === '\n' ? 280 : char === '.' ? 180 : char === ',' ? 120 : 38;
        setTimeout(typeNext, delay);
    }

    /* ============================================
       8) FORGIVE BUTTON
       ============================================ */
    forgiveBtn.addEventListener('click', function () {
        for (var i = 0; i < 45; i++) {
            var h = document.createElement('span');
            h.className = 'exp-heart';
            h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            h.style.left = '50%';
            h.style.top = '50%';
            h.style.fontSize = (14 + Math.random() * 22) + 'px';
            var angle = Math.random() * 360;
            var dist = 80 + Math.random() * 350;
            h.style.setProperty('--tx', (Math.cos(angle) * dist) + 'px');
            h.style.setProperty('--ty', (Math.sin(angle) * dist) + 'px');
            h.style.setProperty('--tr', (Math.random() * 720 - 360) + 'deg');
            explosionLayer.appendChild(h);
        }
        setTimeout(function () {
            forgiveOverlay.classList.add('show');
            explosionLayer.innerHTML = '';
        }, 1800);
    });

})();
