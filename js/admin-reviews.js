// لوحة التحكم - إدارة التقييمات باستخدام Firestore

// تكوين Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBXhgIv3LbjcPwPYZ3u0tw7ZNSqox8pSmI",
  authDomain: "jenan-star.firebaseapp.com",
  projectId: "jenan-star",
  storageBucket: "jenan-star.firebasestorage.app",
  messagingSenderId: "506906396662",
  appId: "1:506906396662:web:57b4ed3b38ab2c0086c68f"
};

// تهيئة Firebase Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const reviewsCollection = db.collection('reviews');

(function() {
  'use strict';

  let allReviews = [];
  let currentAction = null;
  let targetReviewId = null;

  const reviewsList = document.getElementById('reviewsList');
  const reviewsLoading = document.getElementById('reviewsLoading');
  const noReviews = document.getElementById('noReviews');
  const totalReviewsEl = document.getElementById('totalReviews');
  const avgRatingEl = document.getElementById('avgRating');
  const todayReviewsEl = document.getElementById('todayReviews');
  const sortOrder = document.getElementById('sortOrder');
  const filterRating = document.getElementById('filterRating');
  const searchBox = document.getElementById('searchBox');
  const confirmationOverlay = document.getElementById('confirmationOverlay');
  const confirmMessage = document.getElementById('confirmMessage');
  const confirmBtn = document.getElementById('confirmBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  // تحميل التقييمات من Firestore
  async function loadReviews() {
    reviewsLoading.style.display = 'block';
    reviewsList.innerHTML = '';
    allReviews = [];

    try {
      const snapshot = await reviewsCollection.get();
      reviewsLoading.style.display = 'none';

      if (snapshot.empty) {
        noReviews.style.display = 'block';
        updateStats();
        return;
      }

      snapshot.forEach((doc) => {
        allReviews.push({
          id: doc.id,
          ...doc.data()
        });
      });

      updateStats();
      displayReviews();
    } catch (error) {
      console.error('خطأ في تحميل التقييمات:', error);
      reviewsLoading.style.display = 'none';
      noReviews.style.display = 'block';
    }
  }

  // تحديث الإحصائيات
  function updateStats() {
    const total = allReviews.length;
    totalReviewsEl.textContent = total;

    if (total > 0) {
      const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1);
      avgRatingEl.textContent = avgRating;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCount = allReviews.filter(r => {
        if (r.createdAt?.seconds) {
          const reviewDate = new Date(r.createdAt.seconds * 1000);
          reviewDate.setHours(0, 0, 0, 0);
          return reviewDate.getTime() === today.getTime();
        }
        return false;
      }).length;
      todayReviewsEl.textContent = todayCount;
    } else {
      avgRatingEl.textContent = '0.0';
      todayReviewsEl.textContent = '0';
    }
  }

  // عرض التقييمات
  function displayReviews() {
    let reviews = [...allReviews];

    // التصفية حسب التقييم
    const ratingFilter = filterRating.value;
    if (ratingFilter !== 'all') {
      reviews = reviews.filter(r => r.rating === parseInt(ratingFilter));
    }

    // البحث
    const searchTerm = searchBox.value.trim().toLowerCase();
    if (searchTerm) {
      reviews = reviews.filter(r => 
        r.name?.toLowerCase().includes(searchTerm) ||
        r.location?.toLowerCase().includes(searchTerm) ||
        r.text?.toLowerCase().includes(searchTerm)
      );
    }

    // الترتيب
    const sort = sortOrder.value;
    const sortMap = {
      'newest': (a, b) => (b.createdAt?.seconds || b.timestamp || 0) - (a.createdAt?.seconds || a.timestamp || 0),
      'oldest': (a, b) => (a.createdAt?.seconds || a.timestamp || 0) - (b.createdAt?.seconds || b.timestamp || 0),
      'highest': (a, b) => b.rating - a.rating,
      'lowest': (a, b) => a.rating - b.rating
    };
    reviews.sort(sortMap[sort] || sortMap['newest']);

    // عرض النتائج
    if (reviews.length === 0) {
      reviewsList.innerHTML = '';
      noReviews.style.display = 'block';
      return;
    }

    noReviews.style.display = 'none';
    reviewsList.innerHTML = '';

    reviews.forEach(review => {
      const card = createReviewCard(review);
      reviewsList.appendChild(card);
    });
  }

  // إنشاء كرت التقييم
  function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'review-admin-card';
    card.dataset.id = review.id;

    let formattedDate = 'غير محدد';
    if (review.createdAt?.seconds) {
      const dateObj = new Date(review.createdAt.seconds * 1000);
      formattedDate = dateObj.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (review.date) {
      const dateObj = new Date(review.date);
      formattedDate = dateObj.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    const isPublished = review.status === 'published';

    card.innerHTML = `
      <div class="review-header">
        <div class="reviewer-info">
          <h4>${escapeHtml(review.name || 'غير محدد')}</h4>
          <p class="reviewer-location">📍 ${escapeHtml(review.location || 'غير محدد')}</p>
        </div>
        <div class="review-rating">
          ${generateStars(review.rating)}
        </div>
      </div>
      <div class="review-content">
        <p>${escapeHtml(review.text || 'لا يوجد نص')}</p>
      </div>
      <div class="review-meta">
        <span>🕒 ${formattedDate}</span>
        <button class="delete-btn" data-review-id="${review.id}" data-review-name="${escapeHtml(review.name || 'غير محدد')}">
          🗑️ حذف
        </button>
      </div>
    `;

    return card;
  }

  // إضافة event listener للحذف
  reviewsList.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
      const btn = e.target.classList.contains('delete-btn') ? e.target : e.target.closest('.delete-btn');
      const reviewId = btn.getAttribute('data-review-id');
      const reviewName = btn.getAttribute('data-review-name');
      
      if (reviewId && reviewName) {
        deleteReview(reviewId, reviewName);
      }
    }
  });

  // حذف تقييم
  function deleteReview(reviewId, reviewerName) {
    currentAction = 'delete';
    targetReviewId = reviewId;
    confirmMessage.textContent = `هل تريد حذف تقييم "${reviewerName}"؟`;
    confirmationOverlay.classList.add('active');
  }

  // تأكيد الحذف
  confirmBtn.addEventListener('click', async () => {
    if (currentAction === 'delete' && targetReviewId) {
      try {
        await reviewsCollection.doc(targetReviewId).delete();
        confirmationOverlay.classList.remove('active');
        loadReviews();
      } catch (error) {
        console.error('خطأ في حذف التقييم:', error);
        alert('حدث خطأ أثناء الحذف');
      }
    }
    currentAction = null;
    targetReviewId = null;
  });

  // إلغاء
  cancelBtn.addEventListener('click', closeConfirmation);
  confirmationOverlay.addEventListener('click', (e) => {
    if (e.target === confirmationOverlay) closeConfirmation();
  });

  function closeConfirmation() {
    confirmationOverlay.classList.remove('active');
    currentAction = null;
    targetReviewId = null;
  }

  // توليد النجوم
  function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += `<span class="star">${i <= rating ? '★' : '☆'}</span>`;
    }
    return stars;
  }

  // حماية من XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Event Listeners للفلاتر
  sortOrder.addEventListener('change', displayReviews);
  filterRating.addEventListener('change', displayReviews);
  searchBox.addEventListener('input', displayReviews);

  // تحميل التقييمات عند بدء الصفحة
  loadReviews();

})();
