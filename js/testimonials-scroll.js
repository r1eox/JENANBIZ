// ==============================================
// Testimonials Slider مع أسهم وتبديل تلقائي
// ==============================================
window.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.testimonials-carousel');
  const track = document.querySelector('.testimonials-track');
  
  if (!container || !track) {
    console.error('لم يتم العثور على عناصر التقييمات');
    return;
  }
  
  const reviews = Array.from(track.querySelectorAll('blockquote'));
  let currentIndex = 0;
  let autoPlayInterval;
  
  // إنشاء أزرار التنقل
  const prevBtn = document.createElement('button');
  prevBtn.className = 'testimonial-nav prev';
  prevBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
  prevBtn.setAttribute('aria-label', 'التقييم السابق');
  
  const nextBtn = document.createElement('button');
  nextBtn.className = 'testimonial-nav next';
  nextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
  nextBtn.setAttribute('aria-label', 'التقييم التالي');
  
  // إنشاء المؤشرات (dots)
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'testimonial-dots';
  
  reviews.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('aria-label', `التقييم ${index + 1}`);
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
  
  container.appendChild(prevBtn);
  container.appendChild(nextBtn);
  container.appendChild(dotsContainer);
  
  // إخفاء جميع التقييمات ماعدا الأول
  reviews.forEach((review, index) => {
    review.style.display = index === 0 ? 'block' : 'none';
  });
  
  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }
  
  function goToSlide(index) {
    reviews[currentIndex].style.display = 'none';
    currentIndex = index;
    reviews[currentIndex].style.display = 'block';
    updateDots();
    resetAutoPlay();
  }
  
  function nextSlide() {
    const nextIndex = (currentIndex + 1) % reviews.length;
    goToSlide(nextIndex);
  }
  
  function prevSlide() {
    const prevIndex = (currentIndex - 1 + reviews.length) % reviews.length;
    goToSlide(prevIndex);
  }
  
  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000); // تبديل كل 5 ثواني
  }
  
  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }
  
  // إضافة الأحداث
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);
  
  // بدء التشغيل التلقائي
  startAutoPlay();
  
  // إيقاف التشغيل التلقائي عند المرور بالماوس
  container.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  container.addEventListener('mouseleave', startAutoPlay);
  
  console.log('Testimonials Slider جاهز -', reviews.length, 'تقييمات');
});

