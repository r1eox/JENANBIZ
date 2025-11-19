(function(){
  const form = document.getElementById('feasibilityForm');
  const statusEl = form ? form.querySelector('.form-status') : null;
  const fileInput = document.getElementById('files');
  const fileList = document.getElementById('fileList');

  // دالة لإظهار الأخطاء
  function setError(name, msg) {
    const err = document.querySelector(`.error[data-for="${name}"]`);
    if (err) err.textContent = msg || '';
  }

  // تفعيل أزرار اختيار نوع الدراسة
  const studyTypeBtns = document.getElementById('studyTypeBtns');
  if (studyTypeBtns) {
    // فقط لمسح رسالة الخطأ عند الاختيار
    const radios = studyTypeBtns.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.addEventListener('change', function() {
        setError('studyType', '');
      });
    });
  }

  // عرض الملفات المختارة
  if (fileInput && fileList) {
    fileInput.addEventListener('change', () => {
      const files = Array.from(fileInput.files || []);
      if (!files.length) {
        fileList.textContent = '';
        return;
      }
      fileList.innerHTML = files.map(f => `• ${f.name} (${Math.round(f.size / 1024)} ك.ب)`).join('<br>');
    });
  }

  // معالجة إرسال النموذج
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // منع الإرسال الافتراضي
      
      // مسح الأخطاء السابقة
      setError('studyType');
      setError('activity');
      setError('city');
      setError('contactName');
      setError('contactPhone');
      setError('contactEmail');
      if (statusEl) statusEl.textContent = '';

      const data = Object.fromEntries(new FormData(form).entries());
      let ok = true;

      // التحقق من نوع الدراسة
      if (!data.studyType) {
        setError('studyType', 'الرجاء اختيار نوع الدراسة');
        ok = false;
      }

      // التحقق من النشاط
      if (!data.activity || data.activity.trim() === '') {
        setError('activity', 'نشاط المشروع مطلوب');
        ok = false;
      }

      // التحقق من المدينة
      if (!data.city || data.city.trim() === '') {
        setError('city', 'المدينة مطلوبة');
        ok = false;
      }

      // التحقق من اسم المسؤول
      if (!data.contactName || data.contactName.trim() === '') {
        setError('contactName', 'اسم المسؤول مطلوب');
        ok = false;
      }

      // التحقق من رقم الجوال
      if (!data.contactPhone || data.contactPhone.trim() === '') {
        setError('contactPhone', 'رقم الجوال مطلوب');
        ok = false;
      } else {
        // تحقق بسيط من صيغة رقم الجوال السعودي
        const phonePattern = /^(05|5)[0-9]{8}$/;
        if (!phonePattern.test(data.contactPhone.replace(/\s/g, ''))) {
          setError('contactPhone', 'رقم جوال غير صحيح (مثال: 05xxxxxxxx)');
          ok = false;
        }
      }

      // التحقق من البريد الإلكتروني (اختياري لكن إذا تم إدخاله نتحقق من صحته)
      if (data.contactEmail && data.contactEmail.trim() !== '') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(data.contactEmail)) {
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
      
      const formData = new FormData(form);
      
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
          if (fileList) fileList.textContent = '';
          // إزالة التلوين من أزرار نوع الدراسة
          if (studyTypeBtns) {
            const labels = Array.from(studyTypeBtns.querySelectorAll('label'));
            labels.forEach(l => l.classList.remove('btn-primary'));
          }
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
