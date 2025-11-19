// تهيئة عامة
(function () {
  const doc = document.documentElement;
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('primaryNav');
  const themeToggle = document.getElementById('themeToggle');
  const toTop = document.getElementById('toTop');
  const yearEl = document.getElementById('year');
  const form = document.getElementById('contactForm');

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
  // دوماً حدّث الشعار وفق الوضع الحالي حتى إن لم يتوفر زر التبديل
  updateThemeButton();
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

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('_replyto') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      let ok = true;
      setError('name'); setError('email'); setError('phone'); setError('message');

      if (!name) { setError('name', 'الاسم مطلوب'); ok = false; }
      if (!email || !validateEmail(email)) { setError('email', 'بريد غير صالح'); ok = false; }
      if (!phone || !validatePhone(phone)) { setError('phone', 'رقم غير صالح (مثال: 0512345678)'); ok = false; }
      if (!message) { setError('message', 'الرسالة مطلوبة'); ok = false; }

      const status = form.querySelector('.form-status');
      const submitBtn = form.querySelector('button[type="submit"]');
      
      if (!ok) { 
        status.textContent = 'تحقق من الحقول المطلوبة.'; 
        status.style.color = '#ef4444';
        return; 
      }

      // إرسال البيانات
      submitBtn.disabled = true;
      submitBtn.textContent = 'جاري الإرسال...';
      status.textContent = '';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          status.textContent = '✓ تم إرسال طلبك بنجاح! سنتواصل معك قريباً.';
          status.style.color = '#10b981';
          form.reset();
        } else {
          throw new Error('فشل الإرسال');
        }
      } catch (error) {
        // فتح البريد كخيار احتياطي
        status.textContent = '✗ حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى أو التواصل عبر واتساب.';
        status.style.color = '#ef4444';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'إرسال الطلب';
      }
    });
  }
})();

  // ���� ����� ���� �������
  const ADMIN_PASSWORD = 'jenan2025'; // غيّر كلمة المرور هنا
  // مزامنة سحابية اختيارية (اتركها فارغة لاستخدام التخزين المحلي فقط)
  // مثال: لخدمة JSON مستضافة تُعيد/تستقبل مصفوفة آراء [{text,author,rating}]
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

  const testimonialsContainer = document.getElementById('testimonials');

  // بناء carousel بسيط
  function buildCarousel() {
    if (!testimonialsContainer) return;
    
    const reviews = testimonialsContainer.querySelectorAll('blockquote');
    if (reviews.length === 0) return;
    
    // إضافة class carousel
    testimonialsContainer.classList.add('carousel');
    
    // إنشاء track
    const track = document.createElement('div');
    track.className = 't-track';
    
    // تكرار التقييمات عدة مرات للحركة المستمرة
    for (let i = 0; i < 10; i++) {
      reviews.forEach(review => {
        track.appendChild(review.cloneNode(true));
      });
    }
    
    // مسح المحتوى القديم وإضافة track
    testimonialsContainer.innerHTML = '';
    testimonialsContainer.appendChild(track);
  }

  const testimonialModal = document.getElementById('testimonialModal');
  const adminModal = document.getElementById('adminModal');
  const addTestimonialBtn = document.getElementById('addTestimonialBtn');
  const toggleAdminBtn = document.getElementById('toggleAdminBtn');
  const testimonialForm = document.getElementById('testimonialForm');
  const ratingInput = document.getElementById('ratingInput');
  const ratingHidden = document.getElementById('testimonialRating');
  const adminForm = document.getElementById('adminForm');

  // تفعيل اختيار النجوم للتقييم - بسيط ومباشر
  function initRatingControl() {

  // ���� ����� ���� ������� (سيتم حذفه لاحقاً)
  const ADMIN_PASSWORD = 'jenan2025';
  const SYNC_ENDPOINT = '';
  let isAdminMode = false;
  let testimonialIdCounter = 3;
    const input = document.getElementById('ratingInput');
    const hidden = document.getElementById('testimonialRating');
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
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
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
        buildCarousel();
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
    if (confirm('�� ���� ��� ��� �����')) {
      element.remove();
      saveTestimonials();
      buildTestimonialsCarousel();
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
    buildCarousel();
  }

  try { loadTestimonials(); } catch (_) {}


  // تحديث حيّ عبر تبويب آخر بنفس المتصفح
  window.addEventListener('storage', (e) => {
    if (e.key === 'testimonials') {
      loadTestimonials();
    }
  });

})();

// ==============================================
// تحميل التقييمات من Firebase في الصفحة الرئيسية
// ==============================================
(function() {
  'use strict';

  // تكوين Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyCbvJCy0O6Gb1tSd04YdHg0gtsZR50CcTA",
    authDomain: "jenan-star.firebaseapp.com",
    databaseURL: "https://jenan-star-default-rtdb.firebaseio.com",
    projectId: "jenan-star",
    storageBucket: "jenan-star.firebasestorage.app",
    messagingSenderId: "953640463262",
    appId: "1:953640463262:web:9ddec8026936748b33848f",
    measurementId: "G-RRSRB0RNPJ"
  };

  // التحقق من وجود Firebase
  if (typeof firebase === 'undefined') {
    console.warn('Firebase SDK غير محمّل');
    if (testimonialsLoading) testimonialsLoading.style.display = 'none';
    if (testimonialsContainer) {
      testimonialsContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--muted);"><p>لا توجد تقييمات بعد. كن أول من يشارك رأيه!</p></div>';
    }
    return;
  }

  // تهيئة Firebase إذا لم يكن مهيأ
  if (!firebase.apps.length) {
    try {
      firebase.initializeApp(firebaseConfig);
    } catch (error) {
      console.error('خطأ في تهيئة Firebase:', error);
      if (testimonialsLoading) testimonialsLoading.style.display = 'none';
      if (testimonialsContainer) {
        testimonialsContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--muted);"><p>لا توجد تقييمات بعد</p></div>';
      }
      return;
    }
  }

  const database = firebase.database();
  const reviewsRef = database.ref('reviews');
  const testimonialsContainer = document.getElementById('testimonials');
  const testimonialsLoading = document.getElementById('testimonialsLoading');

  if (!testimonialsContainer) return;

  // Timeout للتحميل
  let loadingTimeout = setTimeout(() => {
    if (testimonialsLoading && testimonialsLoading.style.display !== 'none') {
      testimonialsLoading.style.display = 'none';
      testimonialsContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--muted);"><p>لا توجد تقييمات بعد. <a href="./reviews.html" style="color: var(--primary);">كن أول من يشارك رأيه!</a></p></div>';
    }
  }, 5000); // 5 ثواني timeout

  // تحميل التقييمات من Firebase
  function loadFirebaseReviews() {
    reviewsRef.orderByChild('timestamp').limitToLast(6).once('value')
      .then((snapshot) => {
        clearTimeout(loadingTimeout);
        
        if (testimonialsLoading) {
          testimonialsLoading.style.display = 'none';
        }

        if (!snapshot.exists()) {
          // لا توجد تقييمات في Firebase، لكن التقييمات الوهمية ستبقى ظاهرة
          console.log('لا توجد تقييمات في Firebase، التقييمات الوهمية ظاهرة');
          return;
        }

        const reviews = [];
        snapshot.forEach((child) => {
          reviews.push({
            id: child.key,
            ...child.val()
          });
        });

        // عكس الترتيب لعرض الأحدث أولاً
        reviews.reverse();

        // عرض التقييمات من Firebase (بالإضافة للوهمية)
        displayReviews(reviews);
      })
      .catch((error) => {
        console.error('خطأ في تحميل التقييمات:', error);
        clearTimeout(loadingTimeout);
        if (testimonialsLoading) {
          testimonialsLoading.style.display = 'none';
        }
        testimonialsContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--muted);"><p>حدث خطأ في التحميل. <a href="./reviews.html" style="color: var(--primary);">جرّب مرة أخرى</a></p></div>';
      });
  }

  // عرض التقييمات
  function displayReviews(reviews) {
    // إخفاء التحميل
    if (testimonialsLoading) {
      testimonialsLoading.style.display = 'none';
    }

    // الاحتفاظ بالتقييمات الوهمية
    const dummyReviews = testimonialsContainer.querySelectorAll('[data-dummy="true"]');
    
    // إزالة التقييمات القديمة من Firebase فقط (ليس الوهمية)
    const oldFirebaseReviews = testimonialsContainer.querySelectorAll('[data-id]');
    oldFirebaseReviews.forEach(el => el.remove());

    // إضافة التقييمات الجديدة من Firebase بعد الوهمية
    reviews.forEach(review => {
      const blockquote = document.createElement('blockquote');
      blockquote.setAttribute('data-id', review.id);
      blockquote.setAttribute('data-firebase', 'true');
      
      const stars = generateStars(review.rating);
      
      blockquote.innerHTML = `
        <div class="testimonial-stars">${stars}</div>
        <p>${escapeHtml(review.text)}</p>
        <footer>— ${escapeHtml(review.name)}، ${escapeHtml(review.location)}</footer>
      `;

      testimonialsContainer.appendChild(blockquote);
    });

    buildCarousel();
  }

  function generateStars(rating) {
    const fullStars = '⭐'.repeat(rating);
    const emptyStars = '☆'.repeat(Math.max(0, 5 - rating));
    return fullStars + emptyStars;
  }

  // حماية من XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  try {
    loadFirebaseReviews();
    buildCarousel();
    setTimeout(() => buildCarousel(), 1000);
  } catch (error) {
    console.error('خطأ في تحميل التقييمات:', error);
    clearTimeout(loadingTimeout);
    if (testimonialsLoading) testimonialsLoading.style.display = 'none';
  }

  setInterval(() => {
    try {
      loadFirebaseReviews();
    } catch (error) {
      console.error('خطأ في التحديث:', error);
    }
  }, 60000);

  window.addEventListener('load', () => {
    buildCarousel();
    setTimeout(() => buildCarousel(), 500);
  });

})();