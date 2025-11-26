// تهيئة عامة
(function () {
    // مودال خدمات الأعمال
    const serviceModal = document.getElementById('serviceModal');
    const modalBody = document.getElementById('modalBody');
    const serviceDetails = {
      entity: {
        icon: '🏢',
        title: 'تصحيح وتأسيس الكيان التجاري',
        desc: 'تأسيس أو تصحيح كيانك التجاري بما يتوافق مع الأنظمة',
        list: [
          'اختيار نوع الكيان الأنسب (مؤسسة/شركة/فرع أجنبي)',
          'تصحيح السجلات والأنشطة',
          'تحديث بيانات السجل التجاري',
          'تأسيس الكيان من الصفر أو تصحيح القائم'
        ]
      },
      compliance: {
        icon: '✅',
        title: 'مراجعة الامتثال مع وزارة الاستثمار',
        desc: 'التأكد من توافق مشروعك مع المتطلبات التنظيمية',
        list: [
          'مراجعة اللوائح والأنظمة',
          'تدقيق المستندات',
          'تقديم تقارير الامتثال',
          'حلول تصحيحية عند الحاجة'
        ]
      },
      vendors: {
        icon: '🤝',
        title: 'الإرشاد لاختيار شركات موثوقة',
        desc: 'توجيهك لأفضل مزودي الخدمات',
        list: [
          'ترشيح شركات محاسبة وقانون',
          'توصية بمزودي حلول تقنية',
          'شبكة علاقات واسعة',
          'مقارنة العروض واختيار الأنسب'
        ]
      },
      residency: {
        icon: '🌟',
        title: 'الحصول على الإقامة المميزة',
        desc: 'مساعدتك في الحصول على الإقامة المميزة',
        list: [
          'تجهيز المتطلبات',
          'تقديم الطلب ومتابعته',
          'استشارات حول الشروط',
          'دعم كامل حتى صدور الإقامة'
        ]
      },
      legal: {
        icon: '📋',
        title: 'استشارات قانونية ومالية',
        desc: 'خبراء قانونيون وماليون لدعمك',
        list: [
          'استشارات تأسيس وتوثيق',
          'حلول مالية وضريبية',
          'صياغة العقود والاتفاقيات',
          'دعم قانوني مستمر'
        ]
      },
      foreign: {
        icon: '🌍',
        title: 'دعم الشركات الأجنبية',
        desc: 'حلول للشركات الأجنبية للدخول للسوق',
        list: [
          'تأسيس فرع أجنبي',
          'تسهيل التراخيص',
          'دعم الامتثال',
          'خدمات التوطين'
        ]
      },
      training: {
        icon: '🔒',
        title: 'التدريب وتطوير الكوادر',
        desc: 'برامج تدريبية لرفع كفاءة فريقك',
        list: [
          'قريباً: برامج تدريبية متخصصة',
          'ورش عمل وندوات',
          'تطوير مهارات الموظفين',
          'شهادات معتمدة'
        ]
      },
      misa: {
        icon: '🏛️',
        title: 'وزارة الاستثمار',
        desc: 'خدمات تأسيس وتعديل وتوثيق الكيانات عبر وزارة الاستثمار',
        list: [
          'تأسيس الشركات الأجنبية والمحلية',
          'تعديل عقود التأسيس',
          'توثيق الكيانات التجارية',
          'متابعة الطلبات عبر منصة الاستثمار'
        ]
      },
      'business-center': {
        icon: '🏢',
        title: 'مركز الأعمال',
        desc: 'تأسيس وتوثيق الشركات عبر مركز الأعمال',
        list: [
          'تأسيس الشركات والمؤسسات',
          'توثيق العقود إلكترونياً',
          'تحديث بيانات الشركات',
          'متابعة الطلبات عبر مركز الأعمال'
        ]
      },
      balady: {
        icon: '🏬',
        title: 'منصة بلدي',
        desc: 'إصدار وتعديل السجلات والرخص البلدية',
        list: [
          'إصدار رخص بلدية',
          'تعديل وتجديد الرخص',
          'إلغاء الرخصة',
          'متابعة الطلبات عبر منصة بلدي'
        ]
      },
      logo: {
        icon: '🪪',
        title: 'خدمة الشعار',
        desc: 'إصدار الشعار الوطني للمنشآت التجارية',
        list: [
          'تقديم طلب الشعار الوطني',
          'متابعة الطلب حتى الإصدار',
          'دعم فني في حال وجود مشاكل',
          'تحديث بيانات الشعار عند الحاجة'
        ]
      },
      qiwa: {
        icon: '💼',
        title: 'قوى',
        desc: 'خدمات منصة قوى للمنشآت والموظفين',
        list: [
          'إدارة الصلاحيات والمنشآت',
          'إصدار التأشيرات',
          'خدمات نقل الموظفين',
          'دعم فني للمنشآت عبر قوى'
        ]
      }
    };

    if (serviceModal && modalBody) {
      document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function() {
          // لا تفتح المودال إذا البطاقة غير مفعلة (تدريب)
          if (card.style.opacity === '0.6' || card.style.cursor === 'not-allowed') return;
          const key = card.getAttribute('data-service');
          const data = serviceDetails[key];
          if (!data) return;
          modalBody.innerHTML = `
            <div class="card-icon" style="font-size:3rem;">${data.icon}</div>
            <h3>${data.title}</h3>
            <p>${data.desc}</p>
            <ul>${data.list.map(item => `<li>${item}</li>`).join('')}</ul>
          `;
          serviceModal.classList.add('active');
        });
      });
      document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => serviceModal.classList.remove('active'));
      });
      serviceModal.addEventListener('click', e => { if (e.target === serviceModal) serviceModal.classList.remove('active'); });
    }
  const doc = document.documentElement;
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('primaryNav');
  const themeToggle = document.getElementById('themeToggle');
  const toTop = document.getElementById('toTop');
  const yearEl = document.getElementById('year');
  const form = document.getElementById('contactForm');

  // Dropdown menu functionality
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    
    if (toggle) {
      // Toggle dropdown on click
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Close other dropdowns
        dropdowns.forEach(other => {
          if (other !== dropdown) {
            other.classList.remove('active');
          }
        });
        
        // Toggle current dropdown
        dropdown.classList.toggle('active');
      });
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });

  // Close dropdown when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });

  // كود سري لإظهار زر الإدارة - اضغط 5 مرات على اللوغو
  let logoClickCount = 0;
  let logoClickTimer = null;
  const logo = document.querySelector('header .logo');
  const adminBtn = document.getElementById('toggleAdminBtn');
  
  if (logo && adminBtn) {
    logo.addEventListener('click', (e) => {
      logoClickCount++;
      if (logoClickCount === 1) {
        logoClickTimer = setTimeout(() => {
          logoClickCount = 0;
        }, 2000);
      }
      if (logoClickCount === 5) {
        clearTimeout(logoClickTimer);
        logoClickCount = 0;
        adminBtn.style.display = 'inline-flex';
        adminBtn.style.animation = 'fadeIn 0.3s ease';
      }
    });
  }

  // سنة ديناميكية في الفوتر
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // حالة المظهر (داكن/فاتح)
  const savedTheme = localStorage.getItem('site-theme');
  if (savedTheme) {
    if (savedTheme === 'light') doc.setAttribute('data-theme', 'light');
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    doc.setAttribute('data-theme', 'light');
  }

  function updateThemeButton() {
    const isLight = doc.getAttribute('data-theme') === 'light';
    // حدّث رمز زر التبديل إن وُجد
    if (themeToggle) {
      themeToggle.textContent = isLight ? '🌙' : '🌞';
      themeToggle.title = isLight ? 'الوضع الليلي' : 'الوضع الفاتح';
    }
    // تبديل الشعار حسب الوضع
    const logos = document.querySelectorAll('img.logo');
    logos.forEach(img => {
      const light = img.getAttribute('data-light') || img.dataset.light;
      const dark = img.getAttribute('data-dark') || img.dataset.dark;
      if (isLight) {
        if (light) {
          img.src = light;
        } else {
          img.src = img.src
            .replace('logo-dark.png', 'logo-light.png')
            .replace('logo-dark.svg', 'logo-light.png');
        }
      } else {
        if (dark) {
          img.src = dark;
        } else {
          img.src = img.src
            .replace('logo-light.png', 'logo-dark.png')
            .replace('logo-light.svg', 'logo-dark.png');
        }
      }
    });
  }
  // تحديث اللوجو حسب الثيم
  function updateLogos() {
    const isDark = doc.getAttribute('data-theme') !== 'light';
    const logoImgs = document.querySelectorAll('.logo-img, .logo-img-footer');
    logoImgs.forEach(img => {
      if (isDark) {
        img.src = './assets/img/logo-dark.png';
      } else {
        img.src = './assets/img/logo-light.png';
      }
    });
  }

  // دوماً حدّث الشعار وفق الوضع الحالي حتى إن لم يتوفر زر التبديل
  updateThemeButton();
  updateLogos();
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = doc.getAttribute('data-theme') === 'light';
      if (isLight) {
        doc.removeAttribute('data-theme');
        localStorage.setItem('site-theme', 'dark');
      } else {
        doc.setAttribute('data-theme', 'light');
        localStorage.setItem('site-theme', 'light');
      }
      updateThemeButton();
      updateLogos();
    });
  }

  // فتح/إغلاق القائمة على الجوال
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });

    // إغلاق القائمة عند النقر على رابط
    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // زر العودة للأعلى
  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (y > 400) toTop.classList.add('show'); else toTop.classList.remove('show');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // تمرير سلس للرابط الداخلي (للأمان: السلوك الافتراضي كافٍ في معظم المتصفحات)
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', id);
    });
  });

  // تحقّق وإرسال نموذج التواصل
  function setError(name, msg) {
    const err = form.querySelector(`.error[data-for="${name}"]`);
    if (err) err.textContent = msg || '';
  }

  function validateEmail(val) { return /.+@.+\..+/.test(val); }
  function validatePhone(val) { return /^(05|\+?966)\d{8,}$/.test(val); }

  // تم تعطيل معالج نموذج التواصل هنا حتى لا يتعارض مع كود Firebase في index.html
  // إذا أردت تفعيل المعالجة من هنا، احذف الكود الخاص بـ Firebase من index.html
})();

// ==============================================
// نظام إدارة التقييمات
// ==============================================
(function() {
  'use strict';

  const ADMIN_PASSWORD = 'jenan2025';
  const SYNC_ENDPOINT = '';
  let isAdminMode = false;
  let testimonialIdCounter = 3;

  const testimonialModal = document.getElementById('testimonialModal');
  const adminModal = document.getElementById('adminModal');
  const addTestimonialBtn = document.getElementById('addTestimonialBtn');
  const toggleAdminBtn = document.getElementById('toggleAdminBtn');
  const testimonialForm = document.getElementById('testimonialForm');
  const ratingInput = document.getElementById('ratingInput');
  const ratingHidden = document.getElementById('testimonialRating');
  const adminForm = document.getElementById('adminForm');
  const testimonialsContainer = document.getElementById('testimonials');

  // تفعيل اختيار النجوم للتقييم - بسيط ومباشر
  function initRatingControl() {
    const input = ratingInput;
    const hidden = ratingHidden;
    if (!input || !hidden) return;
    if (input.dataset.bound === '1') return;
    input.dataset.bound = '1';

    const stars = Array.from(input.querySelectorAll('.star'));
    let currentRating = Number(hidden.value || 5);

    function renderStars(rating) {
      stars.forEach((s) => {
        const v = Number(s.dataset.value);
        if (v <= rating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    }

    renderStars(currentRating);

    // عند التحويم: أضيء النجوم حتى الموضع
    stars.forEach((s) => {
      s.addEventListener('mouseenter', () => {
        const v = Number(s.dataset.value);
        renderStars(v);
      });
    });

    // عند الخروج من كل المنطقة: ارجع للتقييم المحفوظ
    input.addEventListener('mouseleave', () => {
      renderStars(currentRating);
    });

    // عند الضغط: ثبّت التقييم
    stars.forEach((s) => {
      s.addEventListener('click', () => {
        const v = Number(s.dataset.value);
        currentRating = v;
        hidden.value = String(v);
        renderStars(v);
      });
      s.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          s.click();
        }
      });
    });
  }
  initRatingControl();

  // ��� ����� ����� ���
  if (addTestimonialBtn) {
    addTestimonialBtn.addEventListener('click', () => {
      testimonialModal.classList.add('active');
      // تأكد من تفعيل التحكم بالنجوم بعد ظهور النافذة
      setTimeout(initRatingControl, 0);
    });
  }

  // ���/����� ��� �������
  if (toggleAdminBtn) {
    toggleAdminBtn.addEventListener('click', () => {
      if (isAdminMode) {
        isAdminMode = false;
        toggleAdminBtn.textContent = '';
        toggleAdminBtn.classList.remove('btn-primary');
        toggleAdminBtn.classList.add('btn-outline');
        document.body.classList.remove('admin-mode');
      } else {
        adminModal.classList.add('active');
      }
    });
  }

  // ����� �������
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      testimonialModal.classList.remove('active');
      adminModal.classList.remove('active');
    });
  });

  // ����� ��� ����� ���� �������
  [testimonialModal, adminModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }
  });

  // إضافة رأي جديد
  if (testimonialForm) {
    testimonialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = document.getElementById('testimonialText').value.trim();
      const author = document.getElementById('testimonialAuthor').value.trim();
      const rating = Number((ratingHidden && ratingHidden.value) || 5);

      if (text && author) {
        const newTestimonial = document.createElement('blockquote');
        newTestimonial.setAttribute('data-id', testimonialIdCounter++);
        newTestimonial.innerHTML = `
          <button class="delete-btn" style="display:none;">×</button>
          <div class="testimonial-stars">${'★'.repeat(rating)}${'☆'.repeat(Math.max(0, 5-rating))}</div>
          <p>${text}</p>
          <footer> ${author}</footer>
        `;

        // إضافة حدث الحذف للزر الجديد
        const deleteBtn = newTestimonial.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTestimonial(newTestimonial));

        testimonialsContainer.appendChild(newTestimonial);
        testimonialForm.reset();
        if (ratingHidden) ratingHidden.value = '5';
        testimonialModal.classList.remove('active');

        saveTestimonials();
      }
    });
  }

  // ������ �� ���� ���� �������
  if (adminForm) {
    adminForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const password = document.getElementById('adminPassword').value;
      
      if (password === ADMIN_PASSWORD) {
        isAdminMode = true;
        toggleAdminBtn.textContent = '';
        toggleAdminBtn.classList.remove('btn-outline');
        toggleAdminBtn.classList.add('btn-primary');
        document.body.classList.add('admin-mode');
        adminModal.classList.remove('active');
        adminForm.reset();
      } else {
        alert('���� ���� �����!');
      }
    });
  }

  // ��� ���
  function deleteTestimonial(element) {
    if (confirm('هل تريد حذف هذا الرأي؟')) {
      element.remove();
      saveTestimonials();
    }
  }

  // ����� ��� ����� ����� ������� ��������
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      deleteTestimonial(this.closest('blockquote'));
    });
  });

  // حفظ الآراء محلياً + مزامنة اختيارية
  async function saveTestimonials() {
    const testimonials = [];
    document.querySelectorAll('#testimonials blockquote:not(.clone)').forEach(item => {
      const text = item.querySelector('p').textContent;
      const author = item.querySelector('footer').textContent;
      const starsEl = item.querySelector('.testimonial-stars');
      const rating = starsEl ? (starsEl.textContent || '').replace(/[^★]/g,'').length : 5;
      testimonials.push({ text, author, rating });
    });
    localStorage.setItem('testimonials', JSON.stringify(testimonials));
    // محاولة مزامنة إلى نقطة نهاية عامة اختيارية
    if (SYNC_ENDPOINT) {
      try {
        await fetch(SYNC_ENDPOINT, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testimonials)
        });
      } catch (e) {
        // نتجاهل الخطأ ونبقى على المحلي
        console.warn('Sync failed, using local only');
      }
    }
  }

  // تحميل الآراء من السحابة ثم المحلي كاحتياطي
  async function loadTestimonials() {
    if (!testimonialsContainer) return; // تخطَّ على الصفحات التي لا تحتوي على القسم
    let testimonials = null;
    if (SYNC_ENDPOINT) {
      try {
        const r = await fetch(SYNC_ENDPOINT, { headers: { 'Accept': 'application/json' } });
        if (r.ok) {
          testimonials = await r.json();
        }
      } catch (_) { /* نتجاهل */ }
    }
    if (!Array.isArray(testimonials)) {
      const saved = localStorage.getItem('testimonials');
      if (saved) testimonials = JSON.parse(saved);
    }
    if (!Array.isArray(testimonials)) return;
    testimonialsContainer.innerHTML = '';
    testimonials.forEach((item, index) => {
      const newTestimonial = document.createElement('blockquote');
      newTestimonial.setAttribute('data-id', index + 1);
      const r = Number(item.rating || 5);
      newTestimonial.innerHTML = `
        <button class="delete-btn" style="display:none;">×</button>
        <div class="testimonial-stars">${'★'.repeat(r)}${'☆'.repeat(Math.max(0, 5-r))}</div>
        <p>${item.text}</p>
        <footer>${item.author}</footer>
      `;
      const deleteBtn = newTestimonial.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => deleteTestimonial(newTestimonial));
      testimonialsContainer.appendChild(newTestimonial);
    });
    testimonialIdCounter = testimonials.length + 1;
  }

  try { 
    initRatingControl();
    loadTestimonials(); 
  } catch (_) {}

  window.addEventListener('storage', (e) => {
    if (e.key === 'testimonials') {
      loadTestimonials();
    }
  });

})();

// ==============================================
// Testimonials Auto Scroll Animation
// ==============================================
(function() {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;
  
  const reviews = Array.from(track.children);
  if (reviews.length === 0) return;
  
  // تكرار التقييمات مرة واحدة فقط لعمل infinite loop
  // بما أن الـ animation تحرك -50%، نحتاج نسختين فقط
  reviews.forEach(review => {
    const clone = review.cloneNode(true);
    track.appendChild(clone);
  });
})();