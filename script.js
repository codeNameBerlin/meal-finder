const formSubmit = document.getElementById('submit-form'),
	searchBar = document.getElementById('search'),
	randomBtn = document.getElementById('random'),
	landingPageEl = document.getElementById('landing-page')
	resultHeadingEl = document.getElementById('result-heading'),
	mealsEl = document.getElementById('meals'),
	singleMealEl = document.getElementById('single-meal');


// Search Meal and Fetch from API
const searchMeal = (e) => {
	// Presvent auto submission
	e.preventDefault();

	// Clear single meal 
	singleMealEl.innerHTML = '';
	landingPageEl.innerHTML = '';

	//Get search term
	const term = searchBar.value

	// check for empty searchbar value
	if (term.trim()) {
		fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
		.then(res => res.json())
		.then(data => {
			// console.log(data);
	
			resultHeadingEl.innerHTML = `<h2>Search results for '${term}':</h2>`;
			
			if (data.meals === null) {
				resultHeadingEl.innerHTML = 
				`<p>There are no search results for this meal. Try again</p>`
					// Clear meals and heading
					mealsEl.innerHTML = '';
					landingPageEl.innerHTML = '';
			} else {
				mealsEl.innerHTML = data.meals.map(mealProp => `
					<div class='meal'>
					<img src='${mealProp.strMealThumb}' alt='${mealProp.strMeal}' />
					<div class="meal-info" data-mealid='${mealProp.idMeal}'>
						<h3>${mealProp.strMeal}</h3>
					</div>
					</div>
					`).join('');
			}
		})
		// clear search bar
		searchBar.value = '';
	} else {
		alert('Please enter a valid search term')
	}
}

// Fetch Meal By Id
const getMealById = (mealID) => {
	fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
	.then(res => res.json())
	.then(data => {
		console.log(data)
		const meal = data.meals[0];

		addMealToDOM(meal);
	})
}

// Add Meal to DOM
const addMealToDOM = (meal) => {
	const ingredients = [];

	for (let i = 1; i >= ingredients.length; i++) {
		if (meal[`strIngredient${i}`]) {
			ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
		} else {
			 break;
		}
	}

	// console.log(ingredients)
	singleMealEl.innerHTML = `
	<div class=single-meal>
		<h2>${meal.strMeal}</h2>
		<img src='${meal.strMealThumb}' alt='${meal.strMeal}' />
		<div class='single-meal-info'>
			${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
			${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
		</div>
		<div class='main'>
			<p>${meal.strInstructions}</p>
			<h2>Ingredients</h2>
			<ul>
				${ingredients.map(ing => `<li>${ing}</li>`).join('')}
			</ul>
		</div>
	</div>
	`;
}

// Fetch random Meal from API
const randomMeal = () => {
	// Clear meals and heading
	mealsEl.innerHTML = '';
	resultHeadingEl.innerHTML = '';
	landingPageEl.innerHTML = '';

	fetch('https://www.themealdb.com/api/json/v1/1/random.php')
	.then(res => res.json())
	.then(data => {
		const randomFood = data.meals[0];

		addMealToDOM(randomFood);
	});
}

// Display landing page
const landingPage = () => {
	fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
	.then(res => res.json())
	.then(data => {
		// console.log(data);
		const categoriesArr = data.categories;

		categoriesArr.forEach(index => {
			const newElement = document.createElement('div');
			newElement.classList.add('catId');
			newElement.innerHTML = `
			<h3>${index.strCategory}</h3>
			<p>${index.strCategoryDescription}</p>
			<img src='${index.strCategoryThumb}' alt='${index.strCategory}' />
			`;
			landingPageEl.appendChild(newElement);
		})
})
};


//Event Listener
formSubmit.addEventListener('submit', searchMeal);
randomBtn.addEventListener('click', randomMeal);
mealsEl.addEventListener('click', e => {
	const mealInfo = e.path.find(tag => {
		if (tag.classList) {
			return tag.classList.contains('meal-info')
		} else {
			return false
		}
	})

	if (mealInfo) {
		const mealID = mealInfo.getAttribute('data-mealid');
		getMealById(mealID);
	}
})
landingPage();