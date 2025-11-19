# إعداد Google Analytics لموقع جنان بيزنس

## خطوات التفعيل:

### 1. إنشاء حساب Google Analytics
1. اذهب إلى: https://analytics.google.com
2. سجل دخول بحساب Gmail الخاص بك
3. اضغط على "بدء القياس" أو "Start measuring"
4. أدخل تفاصيل الموقع:
   - اسم الحساب: جنان بيزنس
   - اسم الموقع: Jenan Biz
   - رابط الموقع: موقعك
   - المنطقة الزمنية: Arabia Standard Time
   - العملة: SAR (ريال سعودي)

### 2. الحصول على معرف القياس (Measurement ID)
1. بعد إنشاء الحساب، ستحصل على معرف مثل: `G-XXXXXXXXXX`
2. انسخ هذا المعرف

### 3. تفعيله في الموقع
1. افتح ملف `index.html`
2. ابحث عن السطر: `gtag('config', 'G-XXXXXXXXXX');`
3. استبدل `G-XXXXXXXXXX` بمعرفك الحقيقي
4. كرر نفس الخطوة في باقي ملفات HTML:
   - about.html
   - finance.html
   - feasibility.html
   - marketing.html
   - tech-services.html
   - business-services.html
   - creative-services.html
   - reviews.html

### 4. التحقق من التفعيل
1. ارفع الموقع على السيرفر
2. افتح موقعك في المتصفح
3. ارجع لـ Google Analytics
4. في قسم "Realtime" ستشاهد زيارتك مباشرة
5. إذا ظهرت، معناها التفعيل نجح! ✅

## ملاحظات مهمة:
- البيانات تبدأ تظهر بعد 24-48 ساعة من التفعيل
- تأكد إن الموقع على الإنترنت (مو localhost)
- احفظ معرف القياس في مكان آمن

## معلومات إضافية عن الموقع:
- **الدومين**: غيّر `https://yourwebsite.com` في `sitemap.xml` و `robots.txt`
- **رقم الواتساب**: 966569202920 (موجود في زر الواتساب)
- **السوشيال ميديا**: Twitter, Instagram, TikTok (موجود في الموقع)
