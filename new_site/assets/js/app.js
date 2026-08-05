/* ==========================================================================
   FEIRA NO PARQUE - JAVASCRIPT PRINCIPAL
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initMobileMenu();
  initFaqAccordion();
  initGalleryFilter();
  initLightbox();
  initScrollSpy();
  loadDynamicData();
});

/* 1. Hero Image Slider */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slider .slide');
  if (!slides.length) return;

  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 5000);
}

/* 2. Mobile Menu Toggle */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = toggleBtn.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }
}

/* 3. FAQ Accordion */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all active items
      faqItems.forEach(i => i.classList.remove('active'));

      // If it wasn't active before, open it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* 4. Gallery Filter */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* 5. Lightbox Modal */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const cat = item.querySelector('.cat') ? item.querySelector('.cat').innerText : '';
      if (img && lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxCaption.innerText = `${img.alt} (${cat})`;
        lightboxModal.classList.add('active');
      }
    });
  });
}

function closeLightbox() {
  const lightboxModal = document.getElementById('lightbox-modal');
  if (lightboxModal) {
    lightboxModal.classList.remove('active');
  }
}

/* 6. Manual do Expositor Modal */
function openManualModal() {
  const modal = document.getElementById('manual-modal');
  if (modal) modal.classList.add('active');
}

function closeManualModal() {
  const modal = document.getElementById('manual-modal');
  if (modal) modal.classList.remove('active');
}

/* 7. ScrollSpy for Header Menu */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* 8. Adicionar ao Google Agenda */
function addToCalendar() {
  const title = encodeURIComponent('Feira no Parque - Edição Cultural');
  const details = encodeURIComponent('Gastronomia, Chopp Artesanal, Vinhos, Artesanato e Atividades para toda a família com entrada gratuita.');
  const location = encodeURIComponent('Parque Principal da Cidade');

  // Próximo sábado fictício
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  window.open(calendarUrl, '_blank');
}

/* 9. Form Submission Handler */
function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  alert(`Obrigado, ${name}! Sua mensagem foi enviada com sucesso. Nossa equipe entrará em contato em breve.`);
  document.getElementById('contact-form').reset();
}

/* 10. Carregar Dados Dinâmicos */
async function loadDynamicData() {
  try {
    const response = await fetch('assets/js/dados_feira.json');
    if (!response.ok) throw new Error('Não foi possível carregar os dados.');

    const data = await response.json();

    if (data.proxima_edicao) {
      const aviso = document.getElementById('dynamic-aviso');
      if (aviso && data.proxima_edicao.barra_aviso) {
        aviso.innerHTML = `<i class="fa-solid fa-tree"></i> <strong>Próxima Edição:</strong> ${data.proxima_edicao.barra_aviso}`;
      }

      const elData = document.getElementById('dynamic-data');
      if (elData && data.proxima_edicao.data) {
        elData.textContent = data.proxima_edicao.data;
      }

      const elHorario = document.getElementById('dynamic-horario');
      if (elHorario && data.proxima_edicao.horario) {
        elHorario.textContent = data.proxima_edicao.horario;
      }

      const elLocal = document.getElementById('dynamic-local');
      if (elLocal && data.proxima_edicao.local) {
        elLocal.textContent = data.proxima_edicao.local;
      }
    }
  } catch (error) {
    console.error('Erro ao carregar dados_feira.json:', error);
  }
}
