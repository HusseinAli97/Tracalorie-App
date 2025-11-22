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

export { Meal, Workout };
