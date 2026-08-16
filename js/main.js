/**
 * HANILTON KLEIBER ADVOCACIA
 * Motor de Interatividade, Micro-Interações & Envio Direto Gratuito (FormSubmit.co)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. SCROLL RESTORATION & INITIAL STATE
     ========================================================================== */
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
  }

  /* ==========================================================================
     2. SCROLL PROGRESS & NAVBAR SCROLL EFFECT
     ========================================================================== */
  const progressBar = document.getElementById('scrollProgressBar');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const progressRingCircle = document.querySelector('.progress-ring-circle');

  const circumference = 2 * Math.PI * 23;
  if (progressRingCircle) {
    progressRingCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressRingCircle.style.strokeDashoffset = `${circumference}`;
  }

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

    if (backToTopBtn) {
      if (scrollTop > 350) {
        backToTopBtn.classList.add('visible');
        if (progressRingCircle) {
          const offset = circumference - (scrollPercent / 100) * circumference;
          progressRingCircle.style.strokeDashoffset = `${offset}`;
        }
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    if (navbar) {
      if (scrollTop > 25) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    let currentSection = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      const height = sec.offsetHeight;
      if (scrollTop >= top && scrollTop < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     3. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleDrawer = (open) => {
    const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('active');
    if (isOpen) {
      menuToggle.classList.add('active');
      mobileDrawer.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      menuToggle.classList.remove('active');
      mobileDrawer.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDrawer();
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => toggleDrawer(false));
    });

    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('active') && !mobileDrawer.contains(e.target) && !menuToggle.contains(e.target)) {
        toggleDrawer(false);
      }
    });
  }

  /* ==========================================================================
     4. REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll(
    '.motion-reveal-up, .motion-reveal-scale, .motion-reveal-stagger, .gold-divider.motion-line'
  );

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, parseInt(delay, 10));
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  setTimeout(() => {
    document.querySelectorAll('.hero .motion-reveal-up, .hero .motion-reveal-scale').forEach(el => {
      const delay = el.getAttribute('data-delay') || 0;
      setTimeout(() => el.classList.add('is-visible'), parseInt(delay, 10));
    });
  }, 30);

  /* ==========================================================================
     5. SPOTLIGHT MOUSE GLOW
     ========================================================================== */
  const glassCards = document.querySelectorAll('.servico-card, .sobre-card, .stat-card');

  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* ==========================================================================
     6. PROGRESSIVE DISCLOSURE: SERVICE DETAIL MODALS
     ========================================================================== */
  const serviceModals = {
    contratos: {
      title: 'Contratos & Obrigações Civis',
      icon: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
      desc: 'Segurança jurídica para negociações, análise preventiva de cláusulas e execução de dívidas e inadimplementos.',
      topics: [
        'Elaboração e revisão de contratos de compra e venda, locação e prestação de serviços',
        'Notificações extrajudiciais e cobrança amigável de valores devidos',
        'Ações de execução de títulos de crédito e cumprimento de sentença',
        'Ações de rescisão contratual com devolução de valores pagos'
      ]
    },
    indenizacoes: {
      title: 'Indenizações & Responsabilidade Civil',
      icon: '<svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
      desc: 'Reparação financeira integral por prejuízos materiais, morais e violações aos direitos do consumidor.',
      topics: [
        'Ações por negativação indevida nos órgãos de proteção ao crédito (SPC/Serasa)',
        'Indenizações por fraudes bancárias, golpes e transferências não autorizadas',
        'Defesa do consumidor contra cobranças abusivas e vícios em produtos/serviços',
        'Reparação de danos decorrentes de acidentes de trânsito e negligência'
      ]
    }
  };

  const modalOverlay = document.getElementById('serviceModalOverlay');
  const modalTitle = document.getElementById('modalServiceTitle');
  const modalDesc = document.getElementById('modalServiceDesc');
  const modalTopics = document.getElementById('modalServiceTopics');
  const modalIconBadge = document.getElementById('modalIconBadge');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCtaBtn = document.getElementById('modalCtaBtn');

  const openServiceModal = (serviceKey) => {
    const data = serviceModals[serviceKey];
    if (!data || !modalOverlay) return;

    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalIconBadge.innerHTML = data.icon;
    modalTopics.innerHTML = data.topics
      .map(topic => `<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${topic}</span></li>`)
      .join('');

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalCloseBtn?.focus();
  };

  const closeServiceModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = btn.getAttribute('data-open-modal');
      openServiceModal(serviceKey);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeServiceModal);
  if (modalCtaBtn) modalCtaBtn.addEventListener('click', closeServiceModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeServiceModal();
    });
  }

  /* ==========================================================================
     7. FAQ ACCORDION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherContent = otherItem.querySelector('.faq-content');
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherContent.style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });

  /* ==========================================================================
     8. CONTACT FORM & DDI HANDLER (FORMSUBMIT BOX LAYOUT)
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const ddiSelect = document.getElementById('ddiSelect');
  const inputNome = document.getElementById('nome');
  const inputTelefone = document.getElementById('telefone');
  const inputEmail = document.getElementById('email');
  const selectArea = document.getElementById('areaSelect');
  const inputMensagem = document.getElementById('mensagem');
  const submitBtn = document.getElementById('submitBtn');
  const btnSubmitText = document.getElementById('btnSubmitText');
  const btnSubmitSpinner = document.getElementById('btnSubmitSpinner');
  const formFeedback = document.getElementById('formFeedback');
  const successModalOverlay = document.getElementById('successModalOverlay');
  const successCloseBtn = document.getElementById('successCloseBtn');

  // E-mail de destino
  const DESTINATION_EMAIL = 'h.aniltonjr@gmail.com';

  // Dynamic Phone Mask based on DDI
  const applyPhoneMask = () => {
    if (!inputTelefone) return;
    const currentDDI = ddiSelect ? ddiSelect.value : '55';
    let v = inputTelefone.value.replace(/\D/g, '');

    if (currentDDI === '55') {
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 6) {
        inputTelefone.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
      } else if (v.length > 2) {
        inputTelefone.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
      } else if (v.length > 0) {
        inputTelefone.value = `(${v}`;
      } else {
        inputTelefone.value = '';
      }
    }
  };

  if (inputTelefone) {
    inputTelefone.addEventListener('input', applyPhoneMask);
  }

  if (ddiSelect) {
    ddiSelect.addEventListener('change', () => {
      if (ddiSelect.value !== '55') {
        inputTelefone.placeholder = 'Número com código de área';
      } else {
        inputTelefone.placeholder = '(84) 99123-4567';
      }
    });
  }

  const validateField = (input, validatorFn, errorMsgId, msg) => {
    const errorEl = document.getElementById(errorMsgId);
    const isValid = validatorFn(input.value.trim());

    if (!isValid) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.classList.add('visible');
      }
      return false;
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
      return true;
    }
  };

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isNomeValid = validateField(
        inputNome,
        v => v.length >= 3,
        'nomeError',
        'Informe seu nome completo (ao menos 3 letras).'
      );

      const isTelefoneValid = validateField(
        inputTelefone,
        v => v.replace(/\D/g, '').length >= 8,
        'telefoneError',
        'Informe um número de WhatsApp válido com código de área.'
      );

      const isEmailValid = validateField(
        inputEmail,
        v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        'emailError',
        'Informe um e-mail válido.'
      );

      const isMensagemValid = validateField(
        inputMensagem,
        v => v.length >= 6,
        'mensagemError',
        'Por favor, descreva brevemente seu caso.'
      );

      if (!isNomeValid || !isTelefoneValid || !isEmailValid || !isMensagemValid) {
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (btnSubmitText) btnSubmitText.textContent = 'Enviando...';
      if (btnSubmitSpinner) btnSubmitSpinner.style.display = 'inline-block';
      if (formFeedback) {
        formFeedback.textContent = '';
        formFeedback.style.color = '';
      }

      const ddiVal = ddiSelect ? ddiSelect.value : '55';
      const nomeVal = inputNome.value.trim();
      const telefoneVal = inputTelefone.value.trim();
      const emailVal = inputEmail.value.trim();
      const areaVal = selectArea ? selectArea.value : 'Direito do Consumidor';
      const mensagemVal = inputMensagem.value.trim();

      // Formato visual elegante em Box para o FormSubmit
      const payload = {
        '👤 Nome do Interessado': nomeVal,
        '📱 WhatsApp / Telefone': `+${ddiVal} ${telefoneVal}`,
        '✉️ E-mail de Contato': emailVal,
        '⚖️ Assunto Principal': areaVal,
        '📝 Mensagem do Cliente': mensagemVal,
        '_subject': `[Novo Contato HK Advocacia] ${nomeVal} - ${areaVal}`,
        '_template': 'box',
        '_captcha': 'false'
      };

      try {
        const response = await fetch(`https://formsubmit.co/ajax/${DESTINATION_EMAIL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && (result.success === 'true' || result.success === true || result.message)) {
          triggerGoldConfetti();
          if (successModalOverlay) {
            successModalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
          }
          contactForm.reset();
        } else {
          if (formFeedback) {
            formFeedback.textContent = result.message || 'Não foi possível enviar a mensagem no momento. Tente pelo WhatsApp.';
            formFeedback.style.color = '#f43f5e';
          }
        }
      } catch (err) {
        console.error('Erro no envio do formulário:', err);
        if (formFeedback) {
          formFeedback.textContent = 'Erro de conexão ao enviar. Por favor, tente novamente ou utilize o botão do WhatsApp.';
          formFeedback.style.color = '#f43f5e';
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnSubmitText) btnSubmitText.textContent = 'Enviar Mensagem';
        if (btnSubmitSpinner) btnSubmitSpinner.style.display = 'none';
      }
    });
  }

  if (successCloseBtn && successModalOverlay) {
    successCloseBtn.addEventListener('click', () => {
      successModalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  /* ==========================================================================
     9. CONFETTI ENGINE (CANVAS)
     ========================================================================== */
  const triggerGoldConfetti = () => {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#ffe89e', '#ebd082', '#d8b257', '#ffffff', '#b8933b'];
    const particles = [];
    const particleCount = 90;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width * 0.5 + (Math.random() * 160 - 80),
        y: canvas.height * 0.65,
        vx: (Math.random() - 0.5) * 14,
        vy: -(Math.random() * 12 + 8),
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        gravity: 0.3,
        opacity: 1,
        decay: Math.random() * 0.008 + 0.006
      });
    }

    const animateConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.opacity -= p.decay;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(p.opacity, 0);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      if (alive) {
        requestAnimationFrame(animateConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    requestAnimationFrame(animateConfetti);
  };

  /* ==========================================================================
     10. GLOBAL ESCAPE KEY
     ========================================================================== */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeServiceModal();
      toggleDrawer(false);
      if (successModalOverlay) {
        successModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
});
