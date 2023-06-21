"use strict";

let counter = 0;

function incrementCounter() {
  counter++;
  updateCounter();
  document.getElementById("counter").classList.add("clicked");
  setTimeout(() => {
    document.getElementById("counter").classList.remove("clicked");
  }, 1000);
}

function updateCounter() {
  document.getElementById("counter").textContent = counter;
}

// Submit button Function

document.getElementById("email-input").addEventListener("input", function () {
  var email = document.getElementById("email-input").value;
  var submitBtn = document.getElementById("submit-btn");

  if (email) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
});

document
  .getElementById("submit-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();

    var email = document.getElementById("email-input").value;

    if (validateEmail(email)) {
      showSuccessModal();
    } else {
      alert("Invalid email address!");
    }
  });

function validateEmail(email) {
  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function showSuccessModal() {
  var dialog = document.getElementById("d");
  dialog.showModal();
}

// Jquery For the nav bar shrink on scroll

$(document).ready(function () {
  $(window).scroll(function () {
    if ($(document).scrollTop() > 100) {
      $(".navbar").addClass("navbar-shrink");
    } else {
      $(".navbar").removeClass("navbar-shrink");
    }
  });
});

// Jquery For the Show results H2
$(document).ready(function () {
  $("#searchBtn").click(function () {
    $("#searchResults").show();
    $("#mealResult").show();
  });
});

// API LINK

const searchBtn = document.getElementById("searchBtn");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details");

// Event Listeners

searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);

// get meal list that matches with the ingredeiants

function getMealList() {
  let searchInputTxt = document.getElementById("search-input").value.trim();
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`
  )
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      if (data.meals) {
        data.meals.forEach((meal) => {
          html += `
          <div class="meal-item" data-id="${meal.idMeal}">
            <div class="meal-img">
              <img src="${meal.strMealThumb}" alt="food">
            </div>
            <div class="meal-name">
              <h3>${meal.strMeal}</h3></div>
              <div class='meal-name'><a href="#" class="recipeBtn">Get Recipe</a></div>
            </div>
          </div>`;
        });
      } else {
        html = "<p>No meals found :(</p>";
        mealList.classList.add("notFound");
      }

      mealList.innerHTML = html;
    });
}

// get recipe of the meal
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipeBtn")) {
    let mealItem = e.target.parentElement.parentElement;
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    )
      .then((response) => response.json())
      .then((data) => mealRecipeModal(data.meals));
  }
}

// Create a modal for details
function mealRecipeModal(meal) {
  // Create a bootstrap modal for the recipe
  meal = meal[0];
  let modal = document.getElementById("recipe-modal");
  modal.innerHTML = `
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">${meal.strMeal}</h3>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="closeBtn">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <img src="${meal.strMealThumb}" alt="food">
        <p>${meal.strInstructions}</p>
        <h4>Ingredients</h4>
        <ul>

        </ul>
      </div>
    </div>
  </div>
  `;

  // Get the ingredients and measures from the object.
  for (let i = 1; i <= 20; i++) {
    let ingredient = `strIngredient${i}`;
    let measure = `strMeasure${i}`;
    if (meal[ingredient]) {
      let li = document.createElement("li");
      li.innerHTML = `${meal[ingredient]} - ${meal[measure]}`;
      document
        .getElementsByClassName("modal-body")[0]
        .getElementsByTagName("ul")[0]
        .appendChild(li);
    }
  }
  $(modal).modal("show");
  const recipeCloseBtn = document.getElementById("closeBtn");
  recipeCloseBtn.addEventListener("click", closeModal);

  function closeModal() {
    let modal = document.getElementById("recipe-modal");
    $(modal).modal("hide");
  }
}
