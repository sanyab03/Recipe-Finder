const searchForm = document.querySelector('form');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

// Function to fetch recipes from API
const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
  try {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();

    if (response.meals) {
      recipeContainer.innerHTML = "";
      response.meals.forEach(meal => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.setAttribute('data-category', meal.strCategory); // Add category attribute
        recipeDiv.innerHTML = `
          <img src="${meal.strMealThumb}">
          <p><span>${meal.strArea}</span> Dish</p>
          <p> ${meal.strCategory} Category</p>
        `;

        const button = document.createElement('button');
        button.textContent = "View Recipe";
        button.addEventListener('click', () => {
          openRecipePopup(meal);
        });
        recipeDiv.appendChild(button);
        recipeContainer.appendChild(recipeDiv);
      });
    } else {
      recipeContainer.innerHTML = "<h2>No recipes found!</h2>";
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    recipeContainer.innerHTML = "<h2>Error fetching recipes. Please try again later.</h2>";
  }
}

// Function to fetch ingredients and measurements
const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i < 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
}

// Function to open recipe details popup
const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3 class="ingredientList">Ingredients:</h3>
    <ul>${fetchIngredients(meal)}</ul>
    <div>
      <h3>Instructions:</h3>
      <p class="recipeInstructions">${meal.strInstructions}</p>
    </div>
  `;
  recipeDetailsContent.parentElement.style.display = "block";
}

// Event listener for recipe close button
recipeCloseBtn.addEventListener('click', () => {
  recipeDetailsContent.parentElement.style.display = "none";
});

// Event listener for form submission
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchInput = document.querySelector('.searchBox').value.trim();
  if (!searchInput){
    recipeContainer.innerHTML =`<h2> Type the meal in the searchbox</h2>`;
    return;
  }
  fetchRecipes(searchInput);
});

// Function to filter recipes by category
const filterRecipesByCategory = (category) => {
  const recipes = document.querySelectorAll('.recipe');
  recipes.forEach(recipe => {
    if (category === 'All Category') {
      recipe.style.display = 'flex';
    } else {
      const recipeCategory = recipe.getAttribute('data-category');
      if (recipeCategory === category) {
        recipe.style.display = 'flex';
      } else {
        recipe.style.display = 'none';
      }
    }
  });
}

// Event listener for category buttons
document.querySelectorAll('.category').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.textContent.trim();
    filterRecipesByCategory(category);
   
  });
});




