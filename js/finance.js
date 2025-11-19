// Rewritten finance JS: simplified apply flow with single "أود التقدم" button
// Rewritten finance JS: simplified apply flow with single "أود التقدم" button
(function(){
  const form = document.getElementById('eligibilityForm');
  const statusEl = form ? form.querySelector('.form-status') : null;
  const resultBox = document.getElementById('eligibilityResult');
  const applySection = document.getElementById('apply');
  const requirements = document.getElementById('requirements');
  const startApplyBtn = applySection ? applySection.querySelector('#startApply') : null;
  const uploadArea = document.getElementById('uploadArea');
  const applyNote = document.getElementById('applyNote');
  const fileInput = document.getElementById('files');
  const fileList = document.getElementById('fileList');

  // DEBUG: confirm script loaded and elements found
  try {
    console.log('finance.js loaded — elements:', {
      form: !!form,
      applySection: !!applySection,
      startApplyBtn: !!startApplyBtn,
      uploadArea: !!uploadArea,
      fileInput: !!fileInput
    });
  } catch (err) { console.log('finance.js debug error', err); }

  // قواعد أولية قابلة للتعديل لاحقاً
  const RULES = {
    minDeposits: 200000, // SAR — عدّلها لاحقاً كما تريد
    ownershipAllowed: new Set(['saudi','mixed','foreign']),
  };

  function setError(name, msg) {
    const err = document.querySelector(`.error[data-for="${name}"]`);
    if (err) err.textContent = msg || '';
  }

  // تفعيل أزرار اختيار الملكية
  const ownershipBtns = document.getElementById('ownershipBtns');
  if (ownershipBtns) {
    const labels = Array.from(ownershipBtns.querySelectorAll('label'));
    labels.forEach(lbl => {
      lbl.addEventListener('click', function(e) {
        labels.forEach(l => l.classList.remove('btn-primary'));
        lbl.classList.add('btn-primary');
        labels.forEach(l => {
          const inp = l.querySelector('input'); if (inp) inp.checked = false;
        });
        const inp = lbl.querySelector('input'); if (inp) inp.checked = true;
      });
    });
    const selected = ownershipBtns.querySelector('input[name="ownership"]:checked');
    if (selected) { const parent = selected.closest('label'); if (parent) parent.classList.add('btn-primary'); }
  }

  let lastEvaluation = null;
  function evaluate(data){
    const deposits = Number(data.deposits||0);
    const ownership = data.ownership;
    const meetsDeposits = deposits >= RULES.minDeposits;
    const meetsOwnership = RULES.ownershipAllowed.has(ownership);
    
    // DEBUG: log evaluation details
    console.log('Evaluation:', {
      deposits,
      ownership,
      meetsDeposits,
      meetsOwnership,
      allowedValues: Array.from(RULES.ownershipAllowed)
    });
    
    const result = {
      eligible: meetsDeposits && meetsOwnership,
      notes: { deposits: meetsDeposits, ownership: meetsOwnership }
    };
    lastEvaluation = result;
    return result;
  }

  if (form) {
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      setError('activity'); setError('deposits'); setError('location'); setError('ownership');
      if (statusEl) { statusEl.textContent=''; }

      const data = Object.fromEntries(new FormData(form).entries());
      let ok = true;
      if (!data.activity) { setError('activity', 'النشاط مطلوب'); ok=false; }
      if (!data.deposits || Number(data.deposits) <= 0) { setError('deposits', 'أدخل مجموع الإيداعات'); ok=false; }
      if (!data.location) { setError('location', 'الموقع مطلوب'); ok=false; }
      if (!data.ownership) { setError('ownership', 'اختر الكيان'); ok=false; }
      if (!ok) return;

      const res = evaluate(data);
      if (resultBox) {
        const badge = res.eligible ? '✅' : 'ℹ️';
        const title = res.eligible ? 'مؤهل مبدئياً' : 'تقييم مبدئي — يحتاج مراجعة';
        const hint = res.eligible
          ? 'تبدو مؤهلاً مبدئياً وفق معلوماتك. يمكنك المتابعة للتقديم الآن.'
          : 'قد تحتاج بعض المتطلبات الإضافية. يمكنك متابعة التقديم وسنراجع حالتك بالتفصيل.';
        resultBox.innerHTML = `
          <div class="about-card" style="border-color:${res.eligible ? 'var(--primary)' : 'var(--border)'}">
            <h3 style="margin-bottom:6px;">${badge} ${title}</h3>
            <p class="muted" style="margin:0 0 8px;">${hint}</p>
            <ul class="faq" style="margin:10px 0 0;">
              <li>الإيداعات: ${res.notes.deposits ? 'مناسبة' : 'أقل من الحد الموصى به ('+RULES.minDeposits.toLocaleString('ar')+' ر.س)'} </li>
              <li>الملكية: ${res.notes.ownership ? 'مناسبة' : 'قد تتطلب حلولاً بديلة'} </li>
            </ul>
          </div>`;
        resultBox.style.display='block';
      }

      // reveal apply section and reset apply UI
      if (applySection) {
        applySection.style.display = 'block';
        if (startApplyBtn) { startApplyBtn.style.display = 'inline-flex'; }
        if (uploadArea) { uploadArea.style.display = 'none'; }
        if (applyNote) { applyNote.style.display = 'none'; applyNote.textContent = ''; }
      }
      document.querySelector('#apply')?.scrollIntoView({behavior:'smooth', block:'start'});
    });
  }

  // Start apply button behavior: reveal upload area and note
  if (startApplyBtn) {
    startApplyBtn.addEventListener('click', function(){
      if (!lastEvaluation) {
        if (applyNote) { applyNote.style.display='block'; applyNote.textContent = 'الرجاء إكمال التحقق الأولي من الأهلية أولاً.'; }
        return;
      }
      // if not eligible, show message and do NOT reveal upload area
      if (!lastEvaluation.eligible) {
        if (applyNote) { applyNote.style.display='block'; applyNote.textContent = 'أنت غير مؤهل للتمويل.'; }
        return;
      }
      // hide start button and show upload area for eligible users
      startApplyBtn.style.display = 'none';
      if (uploadArea) uploadArea.style.display = 'block';
      if (requirements) requirements.style.display = 'block';
      if (applyNote) { applyNote.style.display='none'; }
      uploadArea.scrollIntoView({behavior:'smooth', block:'start'});
    });
  }

  // عرض الملفات المختارة مع معاينة الصور
  const filePreview = document.getElementById('filePreview');
  const uploadProgress = document.getElementById('uploadProgress');
  if (fileInput && fileList) {
    fileInput.addEventListener('change', () => {
      const files = Array.from(fileInput.files || []);
      if (!files.length) { fileList.textContent = ''; if (filePreview) filePreview.innerHTML=''; return; }
      fileList.innerHTML = files.map(f => `• ${f.name} (${Math.round(f.size/1024)} ك.ب)`).join('<br>');
      // thumbnails for images
      if (filePreview) {
        filePreview.innerHTML = '';
        files.forEach(f => {
          if (f.type && f.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(f);
            img.style.width = '88px';
            img.style.height = '88px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '6px';
            img.alt = f.name;
            img.title = f.name;
            filePreview.appendChild(img);
          }
        });
      }
    });
  }

  // عند إرسال نموذج التقديم: نرسل عبر XHR إلى /upload مع تقدم الرفع
  const applyForm = document.getElementById('applyForm');
  if (applyForm) {
    applyForm.addEventListener('submit', function(e){
      e.preventDefault();
      const status = applyForm.querySelector('.form-status');
      if (!lastEvaluation) {
        if (status) status.textContent = 'الرجاء إكمال التحقق الأولي من الأهلية قبل الإرسال.';
        return;
      }
      if (!lastEvaluation.eligible) {
        if (status) status.textContent = 'عذراً، لا يمكنك إرسال الملفات لأنك غير مؤهل للتمويل.';
        return;
      }

      // build FormData
      const fd = new FormData();
      // append form fields
      const formPairs = new FormData(applyForm);
      for (const pair of formPairs.entries()) {
        // skip empty honeypot
        if (pair[0] === '_gotcha' && !pair[1]) continue;
        fd.append(pair[0], pair[1]);
      }
      fd.append('eligible', 'yes');

      const files = fileInput ? Array.from(fileInput.files || []) : [];
      files.forEach(f => fd.append('files', f, f.name));

      // send via XHR to support progress events
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/upload');
      xhr.responseType = 'json';

      xhr.upload.addEventListener('progress', (ev) => {
        if (ev.lengthComputable) {
          const pct = Math.round((ev.loaded / ev.total) * 100);
          if (uploadProgress) { uploadProgress.style.display='block'; uploadProgress.value = pct; }
          if (status) status.textContent = `جاري رفع الملفات... ${pct}%`;
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >=200 && xhr.status < 300) {
          if (uploadProgress) { uploadProgress.value = 100; }
          if (status) status.textContent = 'تم إرسال الطلب بنجاح. شكراً لك!';
          applyForm.reset();
          if (fileList) fileList.textContent = '';
          if (filePreview) filePreview.innerHTML = '';
        } else {
          if (status) status.textContent = 'حدث خطأ أثناء الإرسال. حاول مرة أخرى لاحقاً.';
        }
      });

      xhr.addEventListener('error', () => {
        if (status) status.textContent = 'فشل الاتصال بالخادم. تحقق من تشغيل السيرفر المحلي.';
      });

      xhr.send(fd);
      if (status) status.textContent = 'بدء الإرسال...';
    });
  }
})();
