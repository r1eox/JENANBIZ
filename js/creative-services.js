(function(){
  // محتويات الـ Modal لكل خدمة
  const serviceContent = {
    'cv': {
      title: '📄 تصميم السيرة الذاتية (CV)',
      description: 'سيرة ذاتية احترافية مصممة خصيصاً لتبرز مهاراتك وخبراتك بطريقة جذابة ومنظمة.',
      items: [
        'تصميم CV احترافي بتنسيق حديث وجذاب',
        'اختيار القالب المناسب لمجالك (طبي، هندسي، إداري، إبداعي، إلخ)',
        'تنظيم المعلومات بشكل منطقي وسهل القراءة',
        'إبراز نقاط القوة والإنجازات الرئيسية',
        'تسليم ملف PDF عالي الجودة جاهز للطباعة',
        'نسخة قابلة للتعديل (Word أو PowerPoint حسب الطلب)',
        'مراجعة لغوية وتدقيق إملائي'
      ]
    },
    'images': {
      title: '🎨 تصميم الصور والمنشورات',
      description: 'تصاميم إبداعية للسوشيال ميديا، الإعلانات، والمطبوعات بجودة احترافية.',
      items: [
        'تصميم منشورات السوشيال ميديا (إنستغرام، تويتر، فيسبوك، سناب)',
        'تصميم إعلانات رقمية ومطبوعة',
        'تصميم بنرات وبوسترات',
        'تصميم كفرات وقوالب جاهزة',
        'تصميم إنفوجرافيك ورسوم توضيحية',
        'ملفات بصيغ متعددة (PNG, JPG, PDF)',
        'دقة عالية مناسبة للطباعة والنشر الرقمي'
      ]
    },
    'video': {
      title: '🎬 مونتاج وإنتاج الفيديو',
      description: 'إنتاج ومونتاج فيديوهات احترافية لمختلف الأغراض التسويقية والتعليمية.',
      items: [
        'مونتاج فيديوهات ترويجية ودعائية',
        'إنتاج فيديوهات موشن جرافيك',
        'مونتاج فيديوهات تعليمية وشروحات',
        'إضافة مؤثرات بصرية وصوتية',
        'إضافة ترجمة ونصوص متحركة',
        'تصحيح الألوان والإضاءة',
        'موسيقى خلفية وتعليق صوتي (إذا لزم)',
        'تسليم بجودة HD أو 4K'
      ]
    },
    'branding': {
      title: '🏷️ تصميم الهوية البصرية',
      description: 'هوية بصرية متكاملة لعلامتك التجارية تشمل الشعار والألوان والخطوط.',
      items: [
        'تصميم شعار (Logo) احترافي وفريد',
        'اختيار لوحة الألوان الرسمية (Color Palette)',
        'تحديد الخطوط الرسمية (Typography)',
        'تصميم أيقونات وعناصر بصرية مساعدة',
        'دليل الهوية البصرية (Brand Guidelines)',
        'ملفات الشعار بصيغ متعددة (AI, EPS, PNG, SVG)',
        'نسخ الشعار بالألوان وبالأبيض والأسود'
      ]
    },
    'cards': {
      title: '💳 تصميم بطاقات الأعمال',
      description: 'بطاقات عمل (Business Cards) أنيقة واحترافية تترك انطباعاً مميزاً.',
      items: [
        'تصميم بطاقة أعمال بوجهين (أمامي وخلفي)',
        'تصميم يتماشى مع هوية علامتك التجارية',
        'إضافة معلومات الاتصال بشكل واضح',
        'اختيار الألوان والخطوط المناسبة',
        'ملف جاهز للطباعة بدقة عالية (CMYK)',
        'أبعاد قياسية أو مخصصة حسب الطلب',
        'معاينة ثلاثية الأبعاد (Mockup)'
      ]
    },
    'presentations': {
      title: '📊 تصميم العروض التقديمية',
      description: 'عروض PowerPoint أو Google Slides احترافية ومؤثرة لاجتماعاتك ومشاريعك.',
      items: [
        'تصميم قالب عرض تقديمي احترافي',
        'تنسيق الشرائح بشكل منظم وجذاب',
        'إضافة رسوم بيانية (Charts) وإنفوجرافيك',
        'استخدام الصور والأيقونات المناسبة',
        'حركات انتقالية (Transitions) سلسة',
        'تنسيق النصوص والعناوين',
        'تسليم ملف PowerPoint أو Google Slides قابل للتعديل',
        'نسخة PDF للمشاركة'
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
  const form = document.getElementById('creativeForm');
  const statusEl = form ? form.querySelector('.form-status') : null;

  function setError(name, msg) {
    const err = document.querySelector(`.error[data-for="${name}"]`);
    if (err) err.textContent = msg || '';
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // مسح الأخطاء
      setError('clientName');
      setError('services');
      setError('contactName');
      setError('contactPhone');
      setError('contactEmail');
      setError('projectDetails');
      if (statusEl) statusEl.textContent = '';

      const formData = new FormData(form);
      let ok = true;

      // اسم العميل
      const clientName = formData.get('clientName');
      if (!clientName || clientName.trim() === '') {
        setError('clientName', 'الاسم مطلوب');
        ok = false;
      }

      // الخدمات (على الأقل واحدة)
      const services = formData.getAll('services');
      if (services.length === 0) {
        setError('services', 'الرجاء اختيار خدمة واحدة على الأقل');
        ok = false;
      }

      // اسم المسؤول
      const contactName = formData.get('contactName');
      if (!contactName || contactName.trim() === '') {
        setError('contactName', 'اسم المسؤول مطلوب');
        ok = false;
      }

      // رقم الجوال
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

      // البريد (اختياري)
      const contactEmail = formData.get('contactEmail');
      if (contactEmail && contactEmail.trim() !== '') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(contactEmail)) {
          setError('contactEmail', 'البريد الإلكتروني غير صحيح');
          ok = false;
        }
      }

      // تفاصيل المشروع
      const projectDetails = formData.get('projectDetails');
      if (!projectDetails || projectDetails.trim() === '') {
        setError('projectDetails', 'تفاصيل المشروع مطلوبة');
        ok = false;
      }

      if (!ok) {
        if (statusEl) statusEl.textContent = 'الرجاء تصحيح الأخطاء أعلاه.';
        return;
      }

      // الإرسال
      if (statusEl) statusEl.textContent = 'جاري إرسال الطلب...';

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
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
