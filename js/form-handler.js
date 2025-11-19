// Firebase Form Handler - يربط جميع النماذج بـ Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXhgIv3LbjcPwPYZ3u0tw7ZNSqox8pSmI",
  authDomain: "jenan-star.firebaseapp.com",
  projectId: "jenan-star",
  storageBucket: "jenan-star.firebasestorage.app",
  messagingSenderId: "506906396662",
  appId: "1:506906396662:web:57b4ed3b38ab2c0086c68f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// رقم الواتساب للإشعارات
const WHATSAPP_NUMBER = '966569202920';

// معلومات EmailJS (سنحتاج تفعيلها لاحقاً)
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // راح نضيفه لاحقاً
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

/**
 * معالج النماذج الرئيسي
 */
export async function handleFormSubmit(event, formType) {
  event.preventDefault();
  const form = event.target;
  const statusEl = form.querySelector('.form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  form.querySelectorAll('.error').forEach(el => el.textContent = '');

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري الإرسال...';
    if (statusEl) statusEl.textContent = 'جاري إرسال الطلب...';

    // جمع كل الحقول المدخلة (أيًا كان اسمها)
    const data = {};
    const formElements = form.querySelectorAll('input, select, textarea');
    formElements.forEach(el => {
      if (!el.name) return;
      if (el.type === 'checkbox') {
        if (!data[el.name]) data[el.name] = [];
        if (el.checked) data[el.name].push(el.value);
      } else if (el.type === 'radio') {
        if (el.checked) data[el.name] = el.value;
      } else if (el.type === 'file') {
        // الملفات ستعالج لاحقاً
      } else {
        data[el.name] = el.value;
      }
    });
    // إضافة اسم الخدمة بالعربي
    const serviceNames = {
      'feasibility': 'دراسات الجدوى',
      'finance': 'استشارات إدارية',
      'marketing': 'مجالات تسويقية',
      'business-services': 'خدمات متكاملة للمستثمرين',
      'creative-services': 'خدمات إبداعية',
      'tech-services': 'خدمات تقنية',
      'contact': 'تواصل معنا'
    };
    data.service = formType;
    data.serviceName = serviceNames[formType] || formType;
    data.createdAt = serverTimestamp();

    // رفع جميع الملفات (بشكل متوازي)
    const fileInput = form.querySelector('input[type="file"]');
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      data.files = [];
      const uploadPromises = [];
      for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];
        if (file && file.size > 0) {
          const fileRef = ref(storage, `inquiries/${Date.now()}_${file.name}`);
          const uploadPromise = uploadBytes(fileRef, file).then(() => getDownloadURL(fileRef)).then((fileURL) => {
            data.files.push({
              name: file.name,
              url: fileURL,
              type: file.type
            });
          });
          uploadPromises.push(uploadPromise);
        }
      }
      await Promise.all(uploadPromises);
    }

    // حفظ في Firebase
    const docRef = await addDoc(collection(db, 'inquiries'), data);
    console.log('تم حفظ الطلب بنجاح:', docRef.id);

    sendWhatsAppNotification(data);
    // await sendEmailNotification(data);

    if (statusEl) {
      statusEl.style.color = '#2ecc71';
      statusEl.textContent = '✅ تم إرسال طلبك بنجاح! سنتواصل معك قريباً.';
    }
    form.reset();
  } catch (error) {
    console.error('خطأ في إرسال النموذج:', error);
    if (statusEl) {
      statusEl.style.color = '#e74c3c';
      statusEl.textContent = '❌ حدث خطأ. الرجاء المحاولة مرة أخرى أو التواصل عبر الواتساب.';
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'إرسال الطلب';
  }
}

/**
 * إرسال إشعار واتساب
 */
function sendWhatsAppNotification(data) {
  const message = `🔔 *طلب جديد من الموقع*\n\n` +
    `📋 الخدمة: ${getServiceName(data.service)}\n` +
    `👤 الاسم: ${data.name}\n` +
    `📞 الجوال: ${data.phone}\n` +
    `${data.email ? `📧 البريد: ${data.email}\n` : ''}` +
    `${data.projectDescription ? `\n📝 التفاصيل:\n${data.projectDescription}` : ''}` +
    `${data.details ? `\n📝 التفاصيل:\n${data.details}` : ''}` +
    `${data.companyName ? `\n🏢 الشركة: ${data.companyName}` : ''}` +
    `${data.services && data.services.length ? `\n✓ الخدمات المطلوبة: ${data.services.join(', ')}` : ''}` +
    `${data.files && data.files.length ? `\n📎 ${data.files.length} ملف مرفق` : ''}\n\n` +
    `🕐 ${new Date().toLocaleString('ar-SA')}`;
  
  const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  
  // فتح واتساب في تبويب جديد (اختياري)
  // window.open(whatsappURL, '_blank');
  
  console.log('رابط واتساب:', whatsappURL);
  console.log('رسالة واتساب:', message);
}

/**
 * إرسال بريد إلكتروني عبر EmailJS
 */
async function sendEmailNotification(data) {
  // راح نفعلها لاحقاً بعد إعداد EmailJS
  try {
    // await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, data, EMAILJS_PUBLIC_KEY);
    console.log('تم إرسال البريد الإلكتروني بنجاح');
  } catch (error) {
    console.error('خطأ في إرسال البريد:', error);
  }
}

/**
 * الحصول على اسم الخدمة بالعربي
 */
function getServiceName(serviceKey) {
  const services = {
    'feasibility': 'دراسات الجدوى',
    'finance': 'استشارات إدارية',
    'marketing': 'مجالات تسويقية',
    'business-services': 'خدمات متكاملة للمستثمرين',
    'creative-services': 'خدمات إبداعية',
    'tech-services': 'خدمات تقنية'
  };
  return services[serviceKey] || serviceKey;
}

/**
 * التحقق من صحة البيانات
 */
export function validateForm(form) {
  let isValid = true;
  
  // التحقق من الاسم
  const name = form.querySelector('[name="contactName"], [name="name"]');
  if (name && !name.value.trim()) {
    showError(form, name.name, 'الاسم مطلوب');
    isValid = false;
  }
  
  // التحقق من رقم الجوال
  const phone = form.querySelector('[name="contactPhone"], [name="phone"]');
  if (phone && !phone.value.trim()) {
    showError(form, phone.name, 'رقم الجوال مطلوب');
    isValid = false;
  } else if (phone && !/^(05|5)[0-9]{8}$/.test(phone.value.replace(/\s/g, ''))) {
    showError(form, phone.name, 'رقم جوال غير صحيح (مثال: 05xxxxxxxx)');
    isValid = false;
  }
  
  // التحقق من البريد (اختياري لكن إذا موجود يجب أن يكون صحيح)
  const email = form.querySelector('[name="contactEmail"], [name="email"]');
  if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    showError(form, email.name, 'البريد الإلكتروني غير صحيح');
    isValid = false;
  }
  
  return isValid;
}

/**
 * عرض رسالة خطأ
 */
function showError(form, fieldName, message) {
  const errorEl = form.querySelector(`.error[data-for="${fieldName}"]`);
  if (errorEl) {
    errorEl.textContent = message;
  }
}
