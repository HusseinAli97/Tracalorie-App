import Storage from "../Storage/Storage";

// CaloriesTracking Class : apply changes and Ui and do Main mathematics operations

class CalorieTracker {
    // Private Fields
    #calorieLimit;
    #totalCalories;
    #meals;
    #workouts;
    // initial values
    constructor() {
        // initial values on load
        this.#calorieLimit = Storage.getCaloriesLimit();
        this.#totalCalories = Storage.getTotalCalories();
        this.#meals = Storage.getMeals();
        this.#workouts = Storage.getWorkouts();
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
        Storage.setTotalCalories(this.#totalCalories);
        Storage.saveMeal(meal);
        this.#displayNewItem(meal, "mealItem", "bg-primary");
        this.#renderStats();
    }
    addWorkout(workout) {
        this.#workouts.push(workout);
        this.#totalCalories -= workout.calories;
        Storage.setTotalCalories(this.#totalCalories);
        Storage.saveWorkout(workout);
        this.#displayNewItem(workout, "workoutItem", "bg-secondary");
        this.#renderStats();
    }
    // Reset
    resetDay() {
        this.#totalCalories = 0;
        this.#meals = [];
        this.#workouts = [];
        Storage.clearAll();
        this.#renderStats();
    }
    // Remove Method
    removeTheItem(id, type) {
        switch (type) {
            case "meal":
                let indexMeal = this.#meals.findIndex((meal) => meal.id === id);
                if (indexMeal !== -1) {
                    this.#totalCalories -= this.#meals[indexMeal].calories;
                    Storage.setTotalCalories(this.#totalCalories);
                    this.#meals.splice(indexMeal, 1);
                    Storage.removeMeal(id);
                    this.#renderStats();
                }
                break;
            case "workout":
                let indexWorkout = this.#workouts.findIndex((workout) => workout.id === id);
                if (indexWorkout !== -1) {
                    this.#totalCalories += this.#workouts[indexWorkout].calories;
                    Storage.setTotalCalories(this.#totalCalories);
                    this.#workouts.splice(indexWorkout, 1);
                    Storage.removeWorkout(id);
                    this.#renderStats();
                }
                break;
            default:
                break;
        }
    }
    // set Limit
    set setLimit(calorieLimit) {
        this.#calorieLimit = calorieLimit;
        Storage.setCaloriesLimit(calorieLimit);
        this.#displayCaloriesLimit();
        this.#renderStats();
    }
    // LoadItems
    loadItems() {
        this.#meals.forEach((meal) => this.#displayNewItem(meal, "mealItem", "bg-primary"));
        this.#workouts.forEach((workout) => this.#displayNewItem(workout, "workoutItem", "bg-secondary"));
    }

    // Private
    // Display Methods In UI
    #displayTotalCalories() {
        const totalCaloriesEL = document.getElementById("calories-total");
        //TODO - Need Refactor this in future to depend on the arrays
        const meals = this.#meals.reduce((a, c) => a + c.calories, 0);
        const workout = this.#workouts.reduce((a, c) => a + c.calories, 0);
        const totalCalories = meals - workout;
        totalCaloriesEL.innerHTML = totalCalories;
        if (totalCalories >= this.#calorieLimit || totalCalories < 0) {
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
        let remaining = this.#calorieLimit - this.#totalCalories;
        caloriesRemainingEL.innerHTML = remaining;
        let clRemaining = caloriesRemainingEL.parentElement.parentElement;
        if (remaining <= 0 || remaining > this.#calorieLimit) {
            if (clRemaining.classList.contains("bg-light")) {
                clRemaining.classList.replace("bg-light", "bg-danger");
            }
        } else {
            if (clRemaining.classList.contains("bg-danger")) {
                clRemaining.classList.replace("bg-danger", "bg-light");
            }
        }
    }

    #displayCalorieProgress() {
        const progressEL = document.getElementById("calorie-progress");
        const percentage = (this.#totalCalories / this.#calorieLimit) * 100;
        const width = Math.min(percentage, 100);
        progressEL.style.width = `${width}%`;
        if (percentage >= 100) {
            progressEL.classList.add("bg-danger");
        } else {
            progressEL.classList.remove("bg-danger");
        }
    }
    #displayNewItem(oneItem, type, bg) {
        const mealItems = document.getElementById("meal-items");
        const workoutItems = document.getElementById("workout-items");
        const item = this.#createCard(oneItem, bg);

        // initial collapsed state ===
        item.style.boxSizing = "border-box";
        item.style.height = "0px";
        item.style.overflow = "hidden";
        item.style.opacity = "0";
        item.style.paddingTop = "0";
        item.style.paddingBottom = "0";

        // Append to DOM
        switch (type) {
            case "mealItem":
                mealItems.append(item);
                break;
            case "workoutItem":
                workoutItems.append(item);
                break;
            default:
                break;
        }

        // Force reflow so browser registers the starting height = 0
        void item.offsetHeight;

        // Measure the natural height by temporarily clearing height
        item.style.height = "auto";
        const targetHeight = item.offsetHeight + "px";

        // Re-set to 0 immediately (we want to animate from 0 -> targetHeight)
        item.style.height = "0px";

        // Force reflow again before starting transition
        void item.offsetHeight;

        // Setup transition and animate to target height + opacity
        item.style.transition = "height 260ms cubic-bezier(.2,.8,.2,1), opacity 200ms ease";

        // start animation in next frame
        requestAnimationFrame(() => {
            item.style.height = targetHeight;
            item.style.opacity = "1";
        });

        // cleanup after transition ends: remove inline height so card is responsive
        const cleanup = (e) => {
            // ensure we respond once
            item.removeEventListener("transitionend", cleanup);
            // clear inline styles used only for animation
            item.style.transition = "";
            item.style.height = "";
            item.style.overflow = "";
            item.style.opacity = "";
            item.style.boxSizing = "";
            item.style.paddingTop = "";
            item.style.paddingBottom = "";
        };
        item.addEventListener("transitionend", cleanup);

        // if transitionend doesn't fire, cleanup after timeout
        setTimeout(() => {
            if (item.parentElement) {
                // call cleanup manually if still attached
                cleanup();
            }
        }, 500);
    }

    // Render and Create ELements In DOM
    #renderStats() {
        this.#displayTotalCalories();
        this.#displayCaloriesLimit();
        this.#displayConsumedCalories();
        this.#displayBurnedCalories();
        this.#displayCaloriesRemaining();
        this.#displayCalorieProgress();
    }
    #createCard(type, bgColor) {
        const card = document.createElement("div");
        card.classList.add("card", "my-2");
        card.setAttribute("data-id", type.id);

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        card.appendChild(cardBody);

        const insideBody = document.createElement("div");
        insideBody.classList.add("row", "align-items-center");
        cardBody.appendChild(insideBody);

        // Name Column
        const nameH4 = document.createElement("h4");
        nameH4.classList.add("col-4", "mb-0");
        nameH4.textContent = type.name;
        insideBody.appendChild(nameH4);

        // Calories Column
        const caloriesDiv = document.createElement("div");
        caloriesDiv.classList.add("col-4", "fs-4", bgColor, "text-white", "text-center", "rounded-2", "py-2");
        caloriesDiv.textContent = type.calories;
        insideBody.appendChild(caloriesDiv);

        // Delete Button Column
        const delBtnWrapper = document.createElement("div");
        delBtnWrapper.classList.add("col-4", "text-end");
        insideBody.appendChild(delBtnWrapper);

        const delBtn = document.createElement("button");
        delBtn.classList.add("delete", "btn", "btn-danger", "btn-sm");
        delBtnWrapper.appendChild(delBtn);

        const xIcon = document.createElement("i");
        xIcon.classList.add("fa-solid", "fa-xmark");
        delBtn.appendChild(xIcon);
        return card;
    }
}
export default CalorieTracker;
