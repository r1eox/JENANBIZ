(function() {
  'use strict';

  // محتوى تفاصيل كل خدمة
  const serviceContent = {
    'websites': {
      title: 'تصميم وتطوير المواقع',
      description: 'نصمم ونطور مواقع إلكترونية احترافية متجاوبة مع جميع الأجهزة، باستخدام أحدث التقنيات والمعايير العالمية.',
      items: [
        'مواقع تعريفية للشركات والمؤسسات',
        'مواقع الخدمات والحجز الإلكتروني',
        'المدونات والمنصات الإخبارية',
        'صفحات الهبوط Landing Pages',
        'تصميم سريع الاستجابة Responsive',
        'تحسين محركات البحث SEO',
        'تكامل مع وسائل التواصل الاجتماعي',
        'لوحة تحكم سهلة الإدارة'
      ]
    },
    'mobile-apps': {
      title: 'تطبيقات الجوال',
      description: 'نبني تطبيقات جوال احترافية لأنظمة iOS و Android بتجربة مستخدم سلسة وواجهات جذابة.',
      items: [
        'تطبيقات iOS (iPhone & iPad)',
        'تطبيقات Android',
        'تطبيقات هجينة Cross-platform',
        'تصميم واجهات UI/UX متميزة',
        'ربط مع قواعد البيانات والخوادم',
        'إشعارات فورية Push Notifications',
        'خرائط وتحديد المواقع GPS',
        'نشر التطبيق في المتاجر الرسمية'
      ]
    },
    'ecommerce': {
      title: 'المتاجر الإلكترونية',
      description: 'متاجر إلكترونية متكاملة مع بوابات دفع آمنة وأنظمة إدارة مخزون احترافية.',
      items: [
        'تصميم متجر إلكتروني متكامل',
        'إدارة المنتجات والفئات',
        'سلة تسوق ذكية',
        'بوابات دفع إلكتروني آمنة (مدى، فيزا، ماستركارد)',
        'ربط مع شركات الشحن',
        'نظام إدارة الطلبات والفواتير',
        'تقارير المبيعات والإحصائيات'
      ]
    },
    'systems': {
      title: 'أنظمة الإدارة',
      description: 'أنظمة إدارة مخصصة تناسب طبيعة عملك وتساعدك على أتمتة العمليات وتحسين الكفاءة.',
      items: [
        'أنظمة إدارة الموارد البشرية',
        'أنظمة الفواتير والمحاسبة'
      ]
    },
    'maintenance': {
      title: 'الصيانة والدعم الفني',
      description: 'نوفر خدمات صيانة مستمرة ودعم فني احترافي لضمان استمرارية عمل موقعك أو تطبيقك بكفاءة.',
      items: [
        'صيانة دورية للمواقع والتطبيقات',
        'تحديثات أمنية وبرمجية',
        'حل المشاكل التقنية السريع',
        'تحسين الأداء والسرعة',
        'إضافة مميزات جديدة',
        'نسخ احتياطية منتظمة',
        'مراقبة الأداء والأمان',
        'دعم فني عبر الهاتف والبريد'
      ]
    },
    'hosting': {
      title: 'الاستضافة والنطاقات',
      description: 'حلول استضافة سريعة وآمنة مع نطاقات مميزة تناسب هويتك التجارية.',
      items: [
        'استضافة سحابية عالية الأداء',
        'شهادات أمان SSL مجانية',
        'حجز النطاقات (.com, .net, .sa)',
        'بريد إلكتروني احترافي',
        'مساحات تخزين مرنة',
        'نطاق ترددي غير محدود',
        'نسخ احتياطي يومي تلقائي',
        'دعم فني على مدار الساعة'
      ]
    }
  };

  // عناصر DOM
  const modal = document.getElementById('serviceModal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.querySelector('.modal-close');
  const serviceCards = document.querySelectorAll('.service-card[data-service]');

  // فتح Modal عند الضغط على الكرت
  serviceCards.forEach(card => {
    card.addEventListener('click', function() {
      const serviceKey = this.getAttribute('data-service');
      
      // منع فتح المودال لخدمة تطبيقات الجوال (قريباً)
      if (serviceKey === 'mobile-apps') {
        return;
      }
      
      const service = serviceContent[serviceKey];
      
      if (service) {
        modalBody.innerHTML = `
          <h3>${service.title}</h3>
          <p>${service.description}</p>
          <ul>
            ${service.items.map(item => `<li>${item}</li>`).join('')}
          </ul>
        `;
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

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // التعامل مع النموذج
  const form = document.getElementById('techForm');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // مسح الأخطاء السابقة
      document.querySelectorAll('.error').forEach(el => el.textContent = '');
      document.querySelectorAll('.form-row').forEach(row => row.classList.remove('has-error'));

      // جمع البيانات
      const formData = new FormData(form);
      const data = {
        projectName: formData.get('projectName')?.trim(),
        services: formData.getAll('services'),
        contactName: formData.get('contactName')?.trim(),
        contactPhone: formData.get('contactPhone')?.trim(),
        contactEmail: formData.get('contactEmail')?.trim(),
        projectDetails: formData.get('projectDetails')?.trim(),
        budget: formData.get('budget')?.trim(),
        additionalInfo: formData.get('additionalInfo')?.trim()
      };

      let hasError = false;

      // التحقق من الحقول
      if (!data.projectName) {
        showError('projectName', 'يرجى إدخال اسم المشروع');
        hasError = true;
      }

      if (data.services.length === 0) {
        showError('services', 'يرجى اختيار خدمة واحدة على الأقل');
        hasError = true;
      }

      if (!data.contactName) {
        showError('contactName', 'يرجى إدخال اسم المسؤول');
        hasError = true;
      }

      const phonePattern = /^(05|5)[0-9]{8}$/;
      if (!data.contactPhone) {
        showError('contactPhone', 'يرجى إدخال رقم الجوال');
        hasError = true;
      } else if (!phonePattern.test(data.contactPhone.replace(/[\s-]/g, ''))) {
        showError('contactPhone', 'رقم الجوال غير صحيح (مثال: 0512345678)');
        hasError = true;
      }

      if (data.contactEmail) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(data.contactEmail)) {
          showError('contactEmail', 'البريد الإلكتروني غير صحيح');
          hasError = true;
        }
      }

      if (!data.projectDetails) {
        showError('projectDetails', 'يرجى وصف المشروع المطلوب');
        hasError = true;
      }

      if (hasError) {
        return;
      }

      // إرسال النموذج
      const submitBtn = form.querySelector('button[type="submit"]');
      const statusEl = form.querySelector('.form-status');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'جاري الإرسال...';
      statusEl.textContent = '';
      statusEl.className = 'form-status';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          statusEl.textContent = '✓ تم إرسال طلبك بنجاح! سنتواصل معك قريباً.';
          statusEl.classList.add('success');
          form.reset();
        } else {
          throw new Error('فشل الإرسال');
        }
      } catch (error) {
        statusEl.textContent = '✗ حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.';
        statusEl.classList.add('error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  function showError(fieldName, message) {
    const errorEl = document.querySelector(`.error[data-for="${fieldName}"]`);
    if (errorEl) {
      errorEl.textContent = message;
      const formRow = errorEl.closest('.form-row');
      if (formRow) {
        formRow.classList.add('has-error');
      }
    }
  }

})();
