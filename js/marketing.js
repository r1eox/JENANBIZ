(function(){
  // محتويات الـ Modal لكل خدمة
  const serviceContent = {
    'social-media': {
      title: '📱 إدارة السوشيال ميديا',
      description: 'بناء وإدارة حضورك على منصات التواصل الاجتماعي بشكل احترافي ومستمر.',
      items: [
        'إنشاء وإدارة حسابات الأعمال على (إنستغرام، تويتر، سناب شات، تيك توك، لينكد إن)',
        'تصميم محتوى مرئي جذاب (صور، فيديوهات، قصص، ريلز)',
        'كتابة محتوى تسويقي إبداعي يتناسب مع جمهورك',
        'جدولة المنشورات والنشر في الأوقات الأمثل',
        'الرد على التعليقات والرسائل وإدارة المجتمع',
        'تحليل الأداء وتقديم تقارير شهرية'
      ]
    },
    'seo': {
      title: '🔍 تحسين محركات البحث (SEO)',
      description: 'رفع ترتيب موقعك في نتائج البحث وزيادة الزيارات المجانية (Organic Traffic).',
      items: [
        'تحليل الموقع وتحديد الكلمات المفتاحية الأنسب',
        'تحسين محتوى الصفحات والعناوين والأوصاف',
        'تحسين سرعة الموقع وتجربة المستخدم (UX)',
        'بناء روابط خلفية (Backlinks) عالية الجودة',
        'تحسين SEO المحلي (Local SEO) للأعمال التجارية',
        'تقارير دورية عن الترتيب والزيارات والتحويلات'
      ]
    },
    'paid-ads': {
      title: '💰 الحملات الإعلانية المدفوعة',
      description: 'إعلانات مستهدفة على محركات البحث ومنصات التواصل لتحقيق نتائج سريعة.',
      items: [
        'إعلانات جوجل (Google Ads) للظهور في نتائج البحث',
        'إعلانات السوشيال ميديا (فيسبوك، إنستغرام، سناب شات، تيك توك)',
        'تصميم الإعلانات الإبداعية والنصوص الجذابة',
        'استهداف دقيق للجمهور (عمر، موقع، اهتمامات، سلوك)',
        'إدارة الميزانية وتحسين تكلفة التحويل (CPA)',
        'تتبع الأداء وتحليل العائد على الاستثمار (ROI)'
      ]
    },
    'content': {
      title: '✍️ إنشاء المحتوى التسويقي',
      description: 'محتوى مميز وجذاب يعزز هوية علامتك ويجذب العملاء.',
      items: [
        'كتابة مقالات ومدونات متوافقة مع SEO',
        'تصميم إنفوجرافيك احترافي',
        'إنتاج فيديوهات ترويجية وتعليمية',
        'كتابة نصوص إعلانية (Copywriting) مؤثرة',
        'تصوير وتصميم محتوى منتجات'
      ]
    },
    'email': {
      title: '📊 التسويق عبر البريد الإلكتروني',
      description: 'بناء قاعدة عملاء وإرسال رسائل تسويقية مخصصة لزيادة المبيعات والولاء.',
      items: [
        'تصميم قوالب بريد إلكتروني احترافية',
        'إنشاء حملات بريدية مخصصة حسب شرائح الجمهور',
        'أتمتة الحملات (Automation) للترحيب، المتابعة، والعروض',
        'تحليل معدلات الفتح والنقر والتحويل'
      ]
    },
    'analytics': {
      title: '📈 تحليل البيانات والتقارير',
      description: 'فهم أداء حملاتك التسويقية واتخاذ قرارات مبنية على البيانات.',
      items: [
        'إعداد وتتبع Google Analytics وFacebook Pixel',
        'تحليل سلوك الزوار ومصادر الزيارات',
        'تقارير شهرية شاملة بالأداء والنتائج',
        'توصيات لتحسين الأداء والعائد'
      ]
    }
  };

  // فتح Modal عند النقر على الكروت
  const modal = document.getElementById('serviceModal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.querySelector('.modal-close');
  const serviceCards = document.querySelectorAll('.service-card[data-service]');

  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const serviceKey = card.getAttribute('data-service');
      const content = serviceContent[serviceKey];
      
      if (content) {
        let html = `<h3>${content.title}</h3>`;
        html += `<p>${content.description}</p>`;
        html += '<ul>';
        content.items.forEach(item => {
          html += `<li>${item}</li>`;
        });
        html += '</ul>';
        
        modalBody.innerHTML = html;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // إغلاق Modal
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // معالجة النموذج
  const form = document.getElementById('marketingForm');
  const statusEl = form ? form.querySelector('.form-status') : null;

  // دالة لإظهار الأخطاء
  function setError(name, msg) {
    const err = document.querySelector(`.error[data-for="${name}"]`);
    if (err) err.textContent = msg || '';
  }

  // معالجة إرسال النموذج
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // منع الإرسال الافتراضي

      // مسح الأخطاء السابقة
      setError('businessName');
      setError('services');
      setError('contactName');
      setError('contactPhone');
      setError('contactEmail');
      if (statusEl) statusEl.textContent = '';

      const formData = new FormData(form);
      let ok = true;

      // التحقق من اسم المنشأة
      const businessName = formData.get('businessName');
      if (!businessName || businessName.trim() === '') {
        setError('businessName', 'اسم المنشأة مطلوب');
        ok = false;
      }

      // التحقق من الخدمات المطلوبة (على الأقل خدمة واحدة)
      const services = formData.getAll('services');
      if (services.length === 0) {
        setError('services', 'الرجاء اختيار خدمة واحدة على الأقل');
        ok = false;
      }

      // التحقق من اسم المسؤول
      const contactName = formData.get('contactName');
      if (!contactName || contactName.trim() === '') {
        setError('contactName', 'اسم المسؤول مطلوب');
        ok = false;
      }

      // التحقق من رقم الجوال
      const contactPhone = formData.get('contactPhone');
      if (!contactPhone || contactPhone.trim() === '') {
        setError('contactPhone', 'رقم الجوال مطلوب');
        ok = false;
      } else {
        const phonePattern = /^(05|5)[0-9]{8}$/;
        if (!phonePattern.test(contactPhone.replace(/\s/g, ''))) {
          setError('contactPhone', 'رقم جوال غير صحيح (مثال: 05xxxxxxxx)');
          ok = false;
        }
      }

      // التحقق من البريد الإلكتروني (اختياري لكن إذا تم إدخاله نتحقق من صحته)
      const contactEmail = formData.get('contactEmail');
      if (contactEmail && contactEmail.trim() !== '') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(contactEmail)) {
          setError('contactEmail', 'البريد الإلكتروني غير صحيح');
          ok = false;
        }
      }

      if (!ok) {
        if (statusEl) statusEl.textContent = 'الرجاء تصحيح الأخطاء أعلاه.';
        return;
      }

      // إرسال النموذج عبر AJAX
      if (statusEl) statusEl.textContent = 'جاري إرسال الطلب...';

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          if (statusEl) statusEl.textContent = 'تم إرسال الطلب بنجاح! سنتواصل معك قريباً.';
          form.reset();
        } else {
          if (statusEl) statusEl.textContent = 'حدث خطأ أثناء الإرسال. حاول مرة أخرى لاحقاً.';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        if (statusEl) statusEl.textContent = 'فشل الاتصال. تحقق من الإنترنت وحاول مجدداً.';
      });
    });
  }
})();
