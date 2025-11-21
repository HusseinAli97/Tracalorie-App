// CaloriesTracking Class : apply changes and Ui and do Main mathematics operations
class CalorieTracker {
    // Private Fields
    #calorieLimit;
    #totalCalories;
    #meals;
    #workouts;

    // initial values
    constructor() {
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
    // Adding Methods
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
    // Getter
    get fullData() {
        return {
            Meals: this.#meals,
            Workouts: this.#workouts,
            ToTalCalories: this.#totalCalories,
        };
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

    #displayCalorieProgress() {
        const progressEL = document.getElementById("calorie-progress");
        const percentage = (this.#totalCalories / this.#calorieLimit) * 100;
        const width = Math.min(percentage, 100);
        progressEL.style = `width:${width}%`;
    }

    #displayNewItem(oneItem, type, bg) {
        const mealItems = document.getElementById("meal-items");
        const workoutItems = document.getElementById("workout-items");
        const item = this.#createCard(oneItem, bg);
        item.classList.add("card-enter");
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
        // force reflow to make window read card enter first
        void item.offsetWidth;

        // active class to start transition
        item.classList.add("card-enter-active");

        // cleanup after transition ends
        const cleanupEnter = (e) => {
            item.classList.remove("card-enter", "card-enter-active");
            item.removeEventListener("transitionend", cleanupEnter);
        };
        item.addEventListener("transitionend", cleanupEnter);
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
// Storage store Values and Elements inside Local

class Storage {
    // get and set Limit Calories On storage
    static getCaloriesLimit(defaultLimit = 2000) {
        let calorieLimit;
        let local = localStorage.getItem("calorieLimit");
        if (local === null) {
            calorieLimit = defaultLimit;
        } else {
            calorieLimit = +localStorage.getItem("calorieLimit");
        }
        return calorieLimit;
    }
    static setCaloriesLimit(calorieLimit) {
        localStorage.setItem("calorieLimit", calorieLimit);
    }

    // get and set TotalCalories on storage
    static getTotalCalories(defaultTotal = 0) {
        let totalCalorie;
        let local = localStorage.getItem("totalCalorie");
        if (local === null) {
            totalCalorie = defaultTotal;
        } else {
            totalCalorie = +localStorage.getItem("totalCalorie");
        }
        return totalCalorie;
    }
    static setTotalCalories(totalCalorie) {
        localStorage.setItem("totalCalorie", totalCalorie);
    }

    // get and set Meals on storage
    static getMeals(defaultMeals = []) {
        let meals;
        let local = localStorage.getItem("meals");
        if (local === null) {
            meals = defaultMeals;
        } else {
            let localArr = localStorage.getItem("meals");
            meals = JSON.parse(localArr);
        }
        return meals;
    }
    static saveMeal(meal) {
        const meals = Storage.getMeals();
        meals.push(meal);
        localStorage.setItem("meals", JSON.stringify(meals));
    }

    // get and set WorkOuts on storage
    static getWorkouts(defaultWorkouts = []) {
        let workouts;
        let local = localStorage.getItem("workouts");
        if (local === null) {
            workouts = defaultWorkouts;
        } else {
            let localArr = localStorage.getItem("workouts");
            workouts = JSON.parse(localArr);
        }
        return workouts;
    }
    static saveWorkout(workout) {
        const workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem("workouts", JSON.stringify(workouts));
    }
    // Remove Meal And Work Out From Storage
    static removeMeal(id) {
        let storageMeals = Storage.getMeals();
        if (storageMeals.length !== 0) {
            storageMeals = storageMeals.filter((meal) => meal.id !== id);
            localStorage.setItem("meals", JSON.stringify(storageMeals));

            return;
        }
    }
    static removeWorkout(id) {
        let storageWorkouts = Storage.getWorkouts();
        if (storageWorkouts.length !== 0) {
            storageWorkouts = storageWorkouts.filter((workout) => workout.id !== id);
            localStorage.setItem("workouts", JSON.stringify(storageWorkouts));
            return;
        }
    }
    // reset
    static clearAll() {
        localStorage.clear("meals");
        localStorage.clear("workouts");
        localStorage.clear("totalCalorie");
    }
}

// App Class :Handle events In project
class App {
    #tracker;
    constructor() {
        this.#tracker = new CalorieTracker();
        this.#tracker.loadItems();
        this.#loadEvents();
    }

    // LoadEvents
    #loadEvents() {
        ["meal", "workout"].forEach((type) => {
            document.getElementById(`${type}-form`).addEventListener("submit", this.#newItem.bind(this, type));
            document.getElementById(`${type}-items`).addEventListener("click", this.#removeItem.bind(this, type));
            document.getElementById(`filter-${type}s`).addEventListener("keyup", this.#filterItems.bind(this, type));
        });
        document.getElementById("reset").addEventListener("click", this.#reset.bind(this, ["meal", "workout"]));
        document.getElementById("limit-form").addEventListener("click", this.#setLimit.bind(this));
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

    // delete Items
    #removeItem(type, e) {
        if (e.target.classList.contains("delete") || e.target.classList.contains("fa-xmark")) {
            if (confirm("Are You Sure ?")) {
                const theItemCard = e.target.closest(".card");
                const id = theItemCard.dataset.id;
                this.#tracker.removeTheItem(id, type);
                // Card Remove Animation
                theItemCard.classList.add("card-exit");
                void theItemCard.offsetWidth;
                theItemCard.classList.add("card-exit-active");
                const onTransitionEnd = (evt) => {
                    theItemCard.removeEventListener("transitionend", onTransitionEnd);
                    theItemCard.remove();
                };
                theItemCard.addEventListener("transitionend", onTransitionEnd);
            }
        }
    }

    // filter Items
    #filterItems(type, e) {
        const keyword = e.target.value.toLowerCase().trim();
        document.querySelectorAll(`#${type}-items .card`).forEach((element) => {
            // const name = element.children[0].children[0].children[0].innerText;
            const name = element.firstElementChild.firstElementChild.textContent.toLowerCase();
            if (!name.includes(keyword)) {
                element.classList.add("d-none");
            } else {
                element.classList.remove("d-none");
            }
        });
    }

    // reset
    #reset(type) {
        if (confirm("Are you Sure u wanna Reset! ?")) {
            this.#tracker.resetDay();
            type.forEach((type) => {
                document.getElementById(`${type}-items`).innerHTML = "";
                document.getElementById(`filter-${type}s`).value = "";
            });
        }
    }

    // set LimitCalories
    #setLimit(e) {
        e.preventDefault();
        const input = document.getElementById("limit");
        if (e.target.classList.contains("save")) {
            if (input.value === "") {
                alert("Fill The Limit Please!");
                return;
            }
            this.#tracker.setLimit = +input.value;
            const modalElement = document.getElementById("limit-modal");
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
            input.value = "";
        }
    }
}
new App();
