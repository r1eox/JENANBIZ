// ملف JavaScript لإدارة التقييمات باستخدام Firebase Firestore

// تكوين Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBXhgIv3LbjcPwPYZ3u0tw7ZNSqox8pSmI",
  authDomain: "jenan-star.firebaseapp.com",
  projectId: "jenan-star",
  storageBucket: "jenan-star.firebasestorage.app",
  messagingSenderId: "506906396662",
  appId: "1:506906396662:web:57b4ed3b38ab2c0086c68f"
};

let db;
let reviewsCollection;

(function() {
  'use strict';

  const modal = document.getElementById('reviewModal');
  const addReviewBtn = document.getElementById('addReviewBtn');
  const closeModal = document.getElementById('closeModal');
  const reviewForm = document.getElementById('reviewForm');
  const ratingInput = document.getElementById('ratingInput');
  const ratingValue = document.getElementById('ratingValue');
  const reviewsList = document.getElementById('reviewsList');
  const reviewsLoading = document.getElementById('reviewsLoading');
  const noReviews = document.getElementById('noReviews');

  // تهيئة Firebase Firestore
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    reviewsCollection = db.collection('reviews');
    loadReviewsFromFirestore();
  } catch (error) {
    console.error('خطأ في تهيئة Firebase:', error);
    reviewsLoading.style.display = 'none';
    noReviews.style.display = 'block';
  }

  // فتح Modal
  addReviewBtn.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // إغلاق Modal
  closeModal.addEventListener('click', closeModalFunc);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModalFunc();
  });

  function closeModalFunc() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    reviewForm.reset();
    resetRatingStars();
  }

  // نظام النجوم للتقييم
  const stars = ratingInput.querySelectorAll('span');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = star.getAttribute('data-rating');
      ratingValue.value = rating;
      updateStars(rating);
    });

    star.addEventListener('mouseenter', () => {
      const rating = star.getAttribute('data-rating');
      updateStars(rating);
    });
  });

  ratingInput.addEventListener('mouseleave', () => {
    const currentRating = ratingValue.value || 0;
    updateStars(currentRating);
  });

  function updateStars(rating) {
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('selected');
      } else {
        star.classList.remove('selected');
      }
    });
  }

  function resetRatingStars() {
    ratingValue.value = '';
    stars.forEach(star => star.classList.remove('selected'));
  }

  // إرسال التقييم
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = reviewForm.querySelector('button[type="submit"]');
    const statusEl = reviewForm.querySelector('.form-status');
    
    if (!ratingValue.value) {
      statusEl.textContent = '✗ يرجى اختيار تقييم';
      statusEl.classList.add('error');
      return;
    }

    const review = {
      name: document.getElementById('reviewerName').value.trim(),
      location: document.getElementById('reviewerLocation').value.trim(),
      rating: parseInt(ratingValue.value),
      text: document.getElementById('reviewText').value.trim(),
      status: 'published',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري الإرسال...';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    try {
      await reviewsCollection.add(review);
      
      statusEl.textContent = '✓ تم إضافة تقييمك بنجاح!';
      statusEl.classList.add('success');
      
      setTimeout(() => {
        closeModalFunc();
        loadReviewsFromFirestore(); // إعادة تحميل لعرض التقييم الجديد
      }, 1500);
      
    } catch (error) {
      console.error('خطأ في حفظ التقييم:', error);
      statusEl.textContent = '✗ حدث خطأ. يرجى المحاولة مرة أخرى.';
      statusEl.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'إرسال التقييم';
    }
  });

  // تحميل من Firestore
  async function loadReviewsFromFirestore() {
    reviewsLoading.style.display = 'block';
    reviewsList.innerHTML = '';
    
    try {
      const snapshot = await reviewsCollection.get();
      reviewsLoading.style.display = 'none';
      
      if (snapshot.empty) {
        noReviews.style.display = 'block';
        return;
      }

      const reviews = [];
      snapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() });
      });
      
      // ترتيب التقييمات حسب التاريخ (الأحدث أولاً)
      reviews.sort((a, b) => {
        const dateA = a.createdAt?.seconds || a.timestamp || 0;
        const dateB = b.createdAt?.seconds || b.timestamp || 0;
        return dateB - dateA;
      });
      
      displayReviews(reviews);
      
    } catch (error) {
      console.error('خطأ في تحميل التقييمات:', error);
      reviewsLoading.style.display = 'none';
      noReviews.style.display = 'block';
    }
  }

  // عرض التقييمات
  function displayReviews(reviews) {
    reviewsList.innerHTML = '';
    
    reviews.forEach(review => {
      const reviewCard = document.createElement('div');
      reviewCard.className = 'review-card';
      
      const initials = review.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      
      let formattedDate = 'غير محدد';
      if (review.createdAt?.seconds) {
        const dateObj = new Date(review.createdAt.seconds * 1000);
        formattedDate = dateObj.toLocaleDateString('ar-SA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } else if (review.date) {
        const dateObj = new Date(review.date);
        formattedDate = dateObj.toLocaleDateString('ar-SA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }

      reviewCard.innerHTML = `
        <div class="review-header">
          <div class="reviewer-info">
            <div class="reviewer-avatar">${initials}</div>
            <div class="reviewer-details">
              <h4>${escapeHtml(review.name)}</h4>
              <p class="reviewer-location">📍 ${escapeHtml(review.location)}</p>
            </div>
          </div>
          <div class="review-rating">
            ${generateStars(review.rating)}
          </div>
        </div>
        <div class="review-content">
          <p>${escapeHtml(review.text)}</p>
        </div>
        <div class="review-date">${formattedDate}</div>
      `;
      
      reviewsList.appendChild(reviewCard);
    });
  }

  // توليد النجوم
  function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars += '<span class="star">★</span>';
      } else {
        stars += '<span class="star empty">★</span>';
      }
    }
    return stars;
  }

  // حماية من XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

})();
