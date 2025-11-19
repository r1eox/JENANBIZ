// نظام إشعارات البريد الإلكتروني باستخدام EmailJS
// ==================================================

// معلومات EmailJS - استبدلها بمعلوماتك بعد التسجيل
const EMAIL_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',
  templateId: 'YOUR_TEMPLATE_ID',
  publicKey: 'YOUR_PUBLIC_KEY',
  enabled: false // تعطيل مؤقت حتى التفعيل
};

// تهيئة EmailJS
(function() {
  if (EMAIL_CONFIG.enabled && typeof emailjs !== 'undefined') {
    emailjs.init(EMAIL_CONFIG.publicKey);
  }
})();

// دالة إرسال البريد الإلكتروني
function sendEmailNotification(formData) {
  // التحقق من تفعيل EmailJS
  if (!EMAIL_CONFIG.enabled) {
    console.log('EmailJS غير مفعل - تخطي الإشعار');
    return Promise.resolve({ status: 'skipped', message: 'EmailJS not enabled' });
  }
  
  // التأكد من وجود EmailJS
  if (typeof emailjs === 'undefined') {
    console.error('EmailJS not loaded');
    return Promise.reject('EmailJS not available');
  }

  // إعداد البيانات للإرسال
  const templateParams = {
    from_name: formData.name || 'غير محدد',
    from_email: formData.email || 'غير محدد',
    phone: formData.phone || 'غير محدد',
    message: formData.message || 'غير محدد',
    to_email: 'jen25ans@gmail.com', // بريدك
    reply_to: formData.email
  };

  // إرسال البريد
  return emailjs.send(
    EMAIL_CONFIG.serviceId,
    EMAIL_CONFIG.templateId,
    templateParams
  );
}

// دالة عرض رسالة النجاح
function showSuccessMessage(form) {
  // إنشاء رسالة النجاح
  const successDiv = document.createElement('div');
  successDiv.className = 'success-notification';
  successDiv.innerHTML = `
    <div class="success-content">
      <div class="success-icon">✓</div>
      <h3>تم الإرسال بنجاح!</h3>
      <p>شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.</p>
      <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">حسناً</button>
    </div>
  `;
  
  document.body.appendChild(successDiv);
  
  // إخفاء الرسالة تلقائياً بعد 5 ثواني
  setTimeout(() => {
    if (successDiv.parentElement) {
      successDiv.remove();
    }
  }, 5000);
}

// دالة عرض رسالة الخطأ
function showErrorMessage(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-notification';
  errorDiv.innerHTML = `
    <div class="error-content">
      <div class="error-icon">✕</div>
      <h3>حدث خطأ</h3>
      <p>${message || 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.'}</p>
      <button class="btn btn-outline" onclick="this.parentElement.parentElement.remove()">إغلاق</button>
    </div>
  `;
  
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
    if (errorDiv.parentElement) {
      errorDiv.remove();
    }
  }, 5000);
}

// معالج نموذج التواصل
function handleContactFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  
  // تعطيل الزر وإظهار حالة التحميل
  submitBtn.disabled = true;
  submitBtn.textContent = 'جاري الإرسال...';
  
  // جمع بيانات النموذج
  const formData = {
    name: form.querySelector('#name')?.value,
    email: form.querySelector('#email')?.value,
    phone: form.querySelector('#phone')?.value,
    message: form.querySelector('#message')?.value
  };
  
  // إرسال عبر EmailJS
  sendEmailNotification(formData)
    .then(() => {
      console.log('تم إرسال البريد بنجاح');
      showSuccessMessage(form);
      form.reset(); // مسح النموذج
    })
    .catch((error) => {
      console.error('خطأ في إرسال البريد:', error);
      showErrorMessage('حدث خطأ في إرسال الإشعار. يمكنك التواصل مباشرة عبر واتساب.');
    })
    .finally(() => {
      // إعادة تفعيل الزر
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    });
}

// تفعيل النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  // تعطيل المعالج التلقائي - النموذج يتم معالجته في index.html
  // عندما يتم تفعيل EmailJS، قم بإزالة التعليق من الكود التالي:
  
  /*
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm && EMAIL_CONFIG.enabled) {
    // إزالة المعالج الافتراضي إذا كان موجوداً
    contactForm.removeEventListener('submit', handleContactFormSubmit);
    
    // إضافة المعالج الجديد
    contactForm.addEventListener('submit', handleContactFormSubmit);
  }
  */
});
