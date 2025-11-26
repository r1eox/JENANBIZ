

// تهيئة Firebase إذا لم تكن مهيأة مسبقاً
if (!window._fbApp) {
  window._fbApp = firebase.initializeApp({
    apiKey: "AIzaSyBXhgIv3LbjcPwPYZ3u0tw7ZNSqox8pSmI",
    authDomain: "jenan-star.firebaseapp.com",
    projectId: "jenan-star",
    storageBucket: "jenan-star.firebasestorage.app",
    messagingSenderId: "506906396662",
    appId: "1:506906396662:web:57b4ed3b38ab2c0086c68f"
  });
}

// نموذج ديناميكي متعدد الخطوات لاستشارات إدارية
(function(){
  // --- تعريف الخطوات ---
  const steps = [
    // بيانات أساسية
    {
      name: 'fullName',
      label: 'الاسم الكامل',
      type: 'text',
      required: true
    },
    {
      name: 'mobile',
      label: 'رقم الجوال',
      type: 'text',
      required: true
    },
    {
      name: 'mainType',
      label: 'نوع النشاط',
      type: 'radio',
      required: true,
      options: [
        { value: 'تجاري', label: 'تجاري' },
        { value: 'خدمات', label: 'خدمات' },
        { value: 'مقاولات', label: 'مقاولات' }
      ]
    },
    // التجاري: حسب طلب المستخدم
    {
      name: 'entityAge',
      label: 'عمر المنشأة (بالسنوات)',
      type: 'number',
      required: true,
      showIf: data => data.mainType === 'تجاري'
    },
    {
      name: 'hq',
      label: 'مقر الشركة',
      type: 'text',
      required: true,
      showIf: data => data.mainType === 'تجاري'
    },
    {
      name: 'hasPos',
      label: 'هل لدى المنشأة أجهزة نقاط بيع موحدة؟',
      type: 'radio',
      required: true,
      options: [
        { value: 'نعم', label: 'نعم' },
        { value: 'لا', label: 'لا' }
      ],
      showIf: data => data.mainType === 'تجاري'
    },
    {
      name: 'posTotal',
      label: 'كم إجمالي نقاط البيع آخر 12 شهر؟ (ريال)',
      type: 'number',
      required: true,
      showIf: data => data.mainType === 'تجاري' && data.hasPos === 'نعم'
    },
    {
      name: 'deposits',
      label: 'كم مجموع الإيداعات آخر 12 شهر؟ (ريال)',
      type: 'number',
      required: true,
      showIf: data => data.mainType === 'تجاري' && data.hasPos === 'لا'
    },
    {
      name: 'hasCommitments',
      label: 'هل يوجد التزامات على المنشأة؟',
      type: 'radio',
      required: true,
      options: [
        { value: 'نعم', label: 'نعم' },
        { value: 'لا', label: 'لا' }
      ],
      showIf: data => data.mainType === 'تجاري'
    },
    {
      name: 'commitmentAmount',
      label: 'كم مبلغ الالتزامات؟ (ريال)',
      type: 'number',
      required: true,
      showIf: data => data.mainType === 'تجاري' && data.hasCommitments === 'نعم'
    },
    {
      name: 'commitmentLeft',
      label: 'كم المتبقي من الالتزامات؟ (ريال)',
      type: 'number',
      required: true,
      showIf: data => data.mainType === 'تجاري' && data.hasCommitments === 'نعم'
    },
    {
      name: 'entityAge',
      label: 'عمر المنشأة (بالسنوات)',
      type: 'number',
      required: true,
      showIf: data => data.mainType === 'خدمات'
    },
    {
      name: 'hq',
      label: 'مقر الشركة',
      type: 'text',
      required: true,
      showIf: data => data.mainType === 'خدمات'
    },
    {
      name: 'entityType',
      label: 'شركة أم مؤسسة؟',
      type: 'radio',
      required: true,
      options: [
        { value: 'شركة', label: 'شركة' },
        { value: 'مؤسسة', label: 'مؤسسة' }
      ],
      showIf: data => data.mainType === 'خدمات'
    },
    {
      name: 'ownership',
      label: 'نوع الشركة',
      type: 'radio',
      required: true,
      options: [
        { value: 'سعودية', label: 'سعودية' },
        { value: 'أجنبية', label: 'أجنبية' },
        { value: 'مختلطة', label: 'مختلطة' }
      ],
      showIf: data => data.mainType === 'خدمات' && data.entityType === 'شركة'
    },
    {
      name: 'hasStatements',
      label: 'هل توجد قوائم مالية لآخر سنتين؟',
      type: 'radio',
      required: true,
      options: [
        { value: 'نعم', label: 'نعم' },
        { value: 'لا', label: 'لا' }
      ],
      showIf: data => data.mainType === 'خدمات' && data.entityType === 'شركة'
    },
    {
      name: 'revenues',
      label: 'كم الإيرادات؟ (ريال)',
      type: 'number',
      required: true,
      showIf: data => data.mainType === 'خدمات' && data.entityType === 'شركة' && data.hasStatements === 'نعم'
    },
    {
      name: 'profit',
      label: 'كم الربح بعد الزكاة؟ (ريال)',
      type: 'number',
      required: true,
      showIf: data => data.mainType === 'خدمات' && data.entityType === 'شركة' && data.hasStatements === 'نعم'
    },
    {
      name: 'hasContracts',
      label: 'هل يوجد عقود للمنشأة مع الغير؟',
      type: 'radio',
      required: true,
      options: [
        { value: 'نعم', label: 'نعم' },
        { value: 'لا', label: 'لا' }
      ],
      showIf: data => data.mainType === 'خدمات'
    },
    {
      name: 'deposits',
      label: 'كم إجمالي الإيداعات آخر 12 شهر؟ (ريال)',
      type: 'number',
      required: true,
      showIf: data => data.mainType === 'خدمات'
    },
    {
      name: 'hasCommitments',
      label: 'هل توجد التزامات على المنشأة؟',
      type: 'radio',
      required: true,
      options: [
        { value: 'نعم', label: 'نعم' },
        { value: 'لا', label: 'لا' }
      ],
      showIf: data => data.mainType === 'خدمات'
    },
    {
      name: 'commitmentAmount',
      label: 'كم مبلغ الالتزامات؟ (ريال)',
      type: 'number',
      required: true,
      showIf: data => data.mainType === 'خدمات' && data.hasCommitments === 'نعم'
    },
    {
      name: 'commitmentLeft',
      label: 'كم المتبقي من الالتزامات؟ (ريال)',
      type: 'number',
      required: true,
      showIf: data => data.mainType === 'خدمات' && data.hasCommitments === 'نعم'
    },
    {
      name: 'activityDesc',
      label: 'وصف للنشاط',
      type: 'textarea',
      required: true,
      showIf: data => data.mainType === 'خدمات'
    },
    {
      name: 'hq',
      label: 'مقر الشركة',
      type: 'text',
      required: true,
      showIf: data => data.mainType === 'مقاولات'
    },
    {
      name: 'entityType',
      label: 'شركة أم مؤسسة؟',
      type: 'radio',
      required: true,
      options: [
        { value: 'شركة', label: 'شركة' },
        { value: 'مؤسسة', label: 'مؤسسة' }
      ],
      showIf: data => data.mainType === 'مقاولات'
    },
    // إذا شركة
    {
      name: 'ownership',
      label: 'نوع الشركة',
      type: 'radio',
      required: true,
      options: [
        { value: 'سعودية', label: 'سعودية' },
        { value: 'أجنبية', label: 'أجنبية' },
        { value: 'مختلطة', label: 'مختلطة' }
      ],
      showIf: data => data.mainType === 'مقاولات' && data.entityType === 'شركة'
    },
    {
      name: 'hasStatements',
      label: 'هل توجد قوائم مالية لآخر سنتين؟',
      type: 'radio',
      required: true,
      options: [
        { value: 'نعم', label: 'نعم' },
        { value: 'لا', label: 'لا' }
      ],
      showIf: data => data.mainType === 'مقاولات' && data.entityType === 'شركة'
    },
    {
      name: 'revenues',
      label: 'كم الإيرادات؟ (ريال)',
      type: 'number',
      required: true,
      showIf: data => data.mainType === 'مقاولات' && data.entityType === 'شركة' && data.hasStatements === 'نعم'
    },
    {
      name: 'profit',
      label: 'كم الربح بعد الزكاة؟ (ريال)',
      type: 'number',
      required: true,
      showIf: data => data.mainType === 'مقاولات' && data.entityType === 'شركة' && data.hasStatements === 'نعم'
    },
    // عقود حكومية
    {
      name: 'hasGovContracts',
      label: 'هل يوجد عقود حكومية؟',
      type: 'radio',
      required: true,
      options: [
        { value: 'نعم', label: 'نعم' },
        { value: 'لا', label: 'لا' }
      ],
      showIf: data => data.mainType === 'مقاولات'
    },
    // مجموع الإيداعات
    {
      name: 'deposits',
      label: 'كم إجمالي الإيداعات آخر 12 شهر؟ (ريال)',
      type: 'number',
      required: true,
      showIf: data => data.mainType === 'مقاولات'
    },
    // التزامات
    {
      name: 'hasCommitments',
      label: 'هل يوجد التزامات على المنشأة؟',
      type: 'radio',
      required: true,
      options: [
        { value: 'نعم', label: 'نعم' },
        { value: 'لا', label: 'لا' }
      ],
      showIf: data => data.mainType === 'مقاولات'
    },
    {
      name: 'commitmentAmount',
      label: 'كم مبلغ الالتزامات؟ (ريال)',
      type: 'number',
      required: true,
      showIf: data => data.mainType === 'مقاولات' && data.hasCommitments === 'نعم'
    },
    {
      name: 'commitmentLeft',
      label: 'كم المتبقي من الالتزامات؟ (ريال)',
      type: 'number',
      required: true,
      showIf: data => data.mainType === 'مقاولات' && data.hasCommitments === 'نعم'
    },
    {
      name: 'activityDesc',
      label: 'وصف النشاط الحالي',
      type: 'textarea',
      required: true
    }
  ];

  let step = 0;
  let formData = {};
  const stepContainer = document.getElementById('stepContainer');
  const stepActions = document.getElementById('stepActions');
  const summaryStep = document.getElementById('summaryStep');
  const resultBox = document.getElementById('eligibilityResult');

  function renderStep() {
    summaryStep.style.display = 'none';
    stepContainer.innerHTML = '';
    stepActions.innerHTML = '';
    const visibleSteps = steps.filter(s => !s.showIf || s.showIf(formData));
    if (step >= visibleSteps.length) {
      renderSummary();
      return;
    }
    const s = visibleSteps[step];
    let html = `<div class="form-row"><label style="font-weight:700;">${s.label}${s.required ? ' *' : ''}</label>`;
    if (s.type === 'radio') {
      html += `<div style="display:flex;gap:12px;margin-top:8px;" id="radioBtns">`;
      s.options.forEach(opt => {
        const active = formData[s.name] === opt.value ? 'btn-primary' : 'btn-outline';
        html += `<label class="btn ${active}" style="cursor:pointer;">
          <input type="radio" name="${s.name}" value="${opt.value}" style="display:none;" ${formData[s.name]===opt.value?'checked':''} />
          ${opt.label}
        </label>`;
      });
      html += `</div>`;
    } else if (s.type === 'number' || s.type === 'text') {
      html += `<input type="${s.type}" name="${s.name}" value="${formData[s.name]||''}" style="margin-top:8px;" />`;
    } else if (s.type === 'textarea') {
      html += `<textarea name="${s.name}" rows="3" style="margin-top:8px;width:100%;resize:vertical;">${formData[s.name]||''}</textarea>`;
    }
    html += `<small class="error" data-for="${s.name}" style="color:#e74c3c;"></small></div>`;
    stepContainer.innerHTML = html;

    // زر التالي/السابق
    if (step > 0) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'btn';
      prevBtn.textContent = 'رجوع';
      prevBtn.onclick = () => { step--; renderStep(); };
      stepActions.appendChild(prevBtn);
    }
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary';
    nextBtn.textContent = step === visibleSteps.length-1 ? 'ملخص البيانات' : 'التالي';
    nextBtn.onclick = (e) => {
      e.preventDefault();
      if (!validateStep(s)) return;
      step++;
      renderStep();
    };
    stepActions.appendChild(nextBtn);

    // تلوين أزرار الراديو
    if (s.type === 'radio') {
      const btns = stepContainer.querySelectorAll('label.btn');
      btns.forEach(lbl => {
        lbl.addEventListener('click', function(){
          btns.forEach(l => l.classList.remove('btn-primary'));
          this.classList.add('btn-primary');
        });
      });
    }

    // حفظ القيم عند التغيير
    stepContainer.querySelectorAll('input,textarea').forEach(inp => {
      inp.addEventListener('input', function(){
        if (s.type === 'radio') {
          formData[s.name] = stepContainer.querySelector('input[name="'+s.name+'"]:checked')?.value;
        } else {
          formData[s.name] = this.value;
        }
      });
      inp.addEventListener('change', function(){
        if (s.type === 'radio') {
          formData[s.name] = stepContainer.querySelector('input[name="'+s.name+'"]:checked')?.value;
        } else {
          formData[s.name] = this.value;
        }
      });
    });
  }

  function validateStep(s) {
    let valid = true;
    stepContainer.querySelectorAll('.error').forEach(e=>e.textContent='');
    if (s.required) {
      const val = formData[s.name];
      if (!val || (s.type==='number' && isNaN(Number(val)))) {
        stepContainer.querySelector(`.error[data-for="${s.name}"]`).textContent = 'هذا الحقل مطلوب';
        valid = false;
      }
    }
    return valid;
  }

  function renderSummary() {
    stepContainer.innerHTML = '';
    stepActions.innerHTML = '';
    summaryStep.style.display = 'block';
    let html = `<div class="about-card" style="border-color:var(--primary);margin-bottom:18px;">
      <h3>ملخص البيانات المدخلة</h3><ul style="margin:0 0 12px 0;">`;
    // عرض كل معلومة مرة واحدة فقط حسب أول ظهور في الخطوات
    const shown = {};
    steps.forEach(s => {
      if (s.showIf && !s.showIf(formData)) return;
      if (shown[s.label]) return; // لا تكرر نفس الحقل
      shown[s.label] = true;
      html += `<li><strong>${s.label}:</strong> ${formData[s.name]||'-'}</li>`;
    });
    html += '</ul></div>';
    html += `<button class="btn" id="editSummary">تعديل البيانات</button> <button class="btn btn-primary" id="sendSummary">إرسال الطلب</button>`;
    summaryStep.innerHTML = html;
    document.getElementById('editSummary').onclick = () => { step = 0; renderStep(); };
    document.getElementById('sendSummary').onclick = sendToFirestore;
  }

  async function sendToFirestore() {
    if (!window.firebase || !window.firebase.firestore) {
      alert('Firebase غير متوفر');
      return;
    }
    try {
      const db = firebase.firestore();
      const dataToSend = {
        ...formData,
        service: 'finance',
        serviceName: 'استشارات إدارية',
        createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
      };
      await db.collection('inquiries').add(dataToSend);
      summaryStep.innerHTML = `<div class="about-card" style="border-color:var(--primary)"><h3>✅ تم إرسال الطلب بنجاح</h3><p class="muted">سيتم التواصل معك بعد مراجعة المعلومات.</p></div>`;
      if (resultBox) {
        resultBox.innerHTML = '';
        resultBox.style.display = 'none';
      }
    } catch (err) {
      summaryStep.innerHTML = `<div class="about-card" style="border-color:#e74c3c"><h3>❌ تعذر إرسال الطلب</h3><p class="muted">حدث خطأ أثناء الإرسال. حاول لاحقاً أو تواصل مع الدعم.</p></div>`;
    }
  }

  // بدء النموذج
  renderStep();
})();
