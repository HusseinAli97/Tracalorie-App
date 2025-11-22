
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
        localStorage.removeItem("meals");
        localStorage.removeItem("workouts");
        localStorage.removeItem("totalCalorie");
    }
}
export default Storage;
