// CaloriesTracking Class : apply changes and Ui and do Main mathematics operations
class CalorieTracker {
    // Private Fields
    #calorieLimit;
    #totalCalories;
    #meals;
    #workouts;

    // initial values
    constructor() {
        this.#calorieLimit = 2000;
        this.#totalCalories = 0;
        this.#meals = [];
        this.#workouts = [];

        // Render on Page Load
        this.#displayTotalCalories();
        this.#displayCaloriesLimit();
        this.#displayConsumedCalories();
        this.#displayBurnedCalories();
        this.#displayCaloriesRemaining();
        this.#displayCalorieProgress();
    }

    // Public
    addMeal(meal) {
        this.#meals.push(meal);
        this.#totalCalories += meal.calories;
        this.#renderStats();
    }

    addWorkout(workout) {
        this.#workouts.push(workout);
        this.#totalCalories -= workout.calories;
        this.#renderStats();
    }

    get fullData() {
        return {
            Meals: this.#meals,
            Workouts: this.#workouts,
            ToTalCalories: this.#totalCalories,
        };
    }

    // Private
    #displayTotalCalories() {
        const totalCaloriesEL = document.getElementById("calories-total");
        totalCaloriesEL.innerHTML = this.#totalCalories;

        if (this.#totalCalories >= this.#calorieLimit || this.#totalCalories < 0) {
            totalCaloriesEL.parentElement.parentElement.classList.replace("bg-primary", "bg-warning");
        } else {
            totalCaloriesEL.parentElement.parentElement.classList.replace("bg-warning", "bg-primary");
        }
    }

    #displayCaloriesLimit() {
        const caloriesLimitEL = document.getElementById("calories-limit");
        caloriesLimitEL.innerHTML = this.#calorieLimit;
    }

    #displayConsumedCalories() {
        const caloriesConsumeEL = document.getElementById("calories-consumed");
        let totalMealsCl = this.#meals.reduce((total, meal) => {
            return total + meal.calories;
        }, 0);
        caloriesConsumeEL.innerHTML = totalMealsCl;
    }

    #displayBurnedCalories() {
        const caloriesBurnedEL = document.getElementById("calories-burned");
        let totalburnedCl = this.#workouts.reduce((total, workout) => {
            return total + workout.calories;
        }, 0);
        caloriesBurnedEL.innerHTML = totalburnedCl;
    }

    #displayCaloriesRemaining() {
        const caloriesRemainingEL = document.getElementById("calories-remaining");
        const progressEL = document.getElementById("calorie-progress");

        let remaining = this.#calorieLimit - this.#totalCalories;
        caloriesRemainingEL.innerHTML = remaining;

        if (remaining <= 0 || remaining > this.#calorieLimit) {
            caloriesRemainingEL.parentElement.parentElement.classList.replace("bg-light", "bg-danger");
            progressEL.classList.add("bg-danger");
        } else {
            caloriesRemainingEL.parentElement.parentElement.classList.replace("bg-danger", "bg-light");
            progressEL.classList.remove("bg-danger");
        }
    }

    // Ui Elements
    #displayCalorieProgress() {
        const progressEL = document.getElementById("calorie-progress");
        const percentage = (this.#totalCalories / this.#calorieLimit) * 100;
        const width = Math.min(percentage, 100);
        progressEL.style = `width:${width}%`;
    }

    // Render ELement In DOM
    #renderStats() {
        this.#displayTotalCalories();
        this.#displayCaloriesLimit();
        this.#displayConsumedCalories();
        this.#displayBurnedCalories();
        this.#displayCaloriesRemaining();
        this.#displayCalorieProgress();
    }
}

// Meals constructor : create New Meal(id,name,calories)
class Meal {
    constructor(name, calories) {
        this.id = `${Math.random().toString(36).slice(2, 5).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
        this.name = name;
        this.calories = calories;
    }
}

// WorkOuts constructor : create New Workout(id,name,calories)
class Workout {
    constructor(name, calories) {
        this.id = `${Math.random().toString(36).slice(2, 5).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
        this.name = name;
        this.calories = calories;
    }
}

// App Class :Handle events In project
class App {
    #tracker;
    constructor() {
        this.#tracker = new CalorieTracker();
        ["meal", "workout"].forEach((type) => {
            document.getElementById(`${type}-form`).addEventListener("submit", this.#newItem.bind(this, type));
        });
    }
    // create New Item
    #newItem(type, e) {
        e.preventDefault();
        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);
        const collapse = document.getElementById(`collapse-${type}`);

        // validation
        if (name.value === "" && calories.value === "") {
            alert(`Fill ${type} Field Please!`);
            return;
        }
        
        // form new item
        switch (type) {
            case "meal":
                const meal = new Meal(name.value, +calories.value);
                this.#tracker.addMeal(meal);
                break;
            case "workout":
                const workout = new Workout(name.value, +calories.value);
                this.#tracker.addWorkout(workout);
                break;
            default:
                break;
        }

        // clear
        name.value = "";
        calories.value = "";

        // collapse html way and bs constructor  way

        // collapse.classList.remove("show");
        const bsCollapse = new bootstrap.Collapse(collapse, {
            toggle: true,
        });
    }
}
new App();
