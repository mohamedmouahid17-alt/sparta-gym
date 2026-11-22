const API_URL = "https://script.google.com/macros/s/AKfycbzvo1wD-lXJYCeCBmUNthtU0dsbDDENQ9WEWwJrHQRoY9RquQUzYd1g8vs5ESBJsOhYWA/exec";

const nameInput = document.getElementById("review-name");
const ratingInput = document.getElementById("review-rating");
const textInput = document.getElementById("review-text");
const submitButton = document.getElementById("submit-review");
const reviewsList = document.getElementById("reviews-list");

// Display reviews
function displayReviews(reviews) {
  reviewsList.innerHTML = "";

  if (!reviews || reviews.length === 0) {
    reviewsList.textContent = "Be the first to leave a review!";
    return;
  }

  reviews.slice().reverse().forEach(review => {
    const card = document.createElement("div");
    card.style.cssText = `
      background:#202020;
      padding:20px;
      margin:15px auto;
      max-width:550px;
      border:1px solid #b99a38;
      border-radius:8px;
      text-align:left;
    `;

    const name = document.createElement("h3");
    name.textContent = review.name;
    name.style.color = "#f2c94c";

    const stars = document.createElement("p");
    stars.textContent = "★".repeat(review.rating);
    stars.style.color = "#f2c94c";

    const message = document.createElement("p");
    message.textContent = review.review;

    card.append(name, stars, message);
    reviewsList.appendChild(card);
  });
}

// Load reviews from Google Sheets
function loadReviews() {
  const oldScript = document.getElementById("reviews-loader");
  if (oldScript) oldScript.remove();

  window.spartaReviewsCallback = function(reviews) {
    displayReviews(reviews);
  };

  const script = document.createElement("script");
  script.id = "reviews-loader";
  script.src = API_URL + "?callback=spartaReviewsCallback&t=" + Date.now();

  script.onerror = function() {
    reviewsList.textContent = "Unable to load reviews. Please try again.";
  };

  document.body.appendChild(script);
}

// Submit a new review
submitButton.addEventListener("click", async function() {
  const name = nameInput.value.trim();
  const rating = Number(ratingInput.value);
  const review = textInput.value.trim();

  if (!name || !review) {
    alert("Please complete all fields!");
    return;
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    alert("Please select a valid rating.");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "SENDING...";

  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=UTF-8"
      },
      body: JSON.stringify({
        name: name,
        rating: rating,
        review: review
      })
    });

    nameInput.value = "";
    textInput.value = "";
    ratingInput.value = "5";

    alert("Your review has been submitted!");

    setTimeout(loadReviews, 2000);

  } catch (error) {
    alert("Connection error. Please try again.");
  }

  submitButton.disabled = false;
  submitButton.textContent = "SUBMIT REVIEW";
});

// Load reviews when page opens
loadReviews();