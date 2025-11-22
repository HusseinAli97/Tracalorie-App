import "@fortawesome/fontawesome-free/js/all";
import { Collapse, Modal } from "bootstrap";
import { Meal, Workout } from "./components/Items/Items";
import Storage from "./components/Storage/Storage";
import CalorieTracker from "./components/Tracker/Tracker";
import "./css/bootstrap.css";
import "./css/style.css";

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
        // Add Value of limit inside ui
        document.getElementById("modal-btn").addEventListener("click", this.#setLimitCurrant.bind(this));
        document.getElementById("daily").addEventListener("click", this.#openModal.bind(this));
    }
    // create New Item
    #newItem(type, e) {
        e.preventDefault();
        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);
        const collapse = document.getElementById(`collapse-${type}`);
        // validation
        if (name.value === "" || calories.value === "") {
            alert(`Fill ${type.toUpperCase()} Field Please!`);
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
        // collapse from collapse bootStrap constructor
        new Collapse(collapse, {
            toggle: true,
        });
    }
    // add limit value in placeholder of modal
    #setLimitCurrant() {
        document.getElementById("limit").value = Storage.getCaloriesLimit();
    }
    // edit limit by click on Daily Card
    #openModal() {
        document.getElementById("limit").value = Storage.getCaloriesLimit();
        const modalElement = document.getElementById("limit-modal");
        const modal = Modal.getOrCreateInstance(modalElement);
        modal.show();
    }
    // delete Items & Animation
    #removeItem(type, e) {
        if (e.target.classList.contains("delete") || e.target.classList.contains("fa-xmark")) {
            if (confirm("Are You Sure ?")) {
                const theItemCard = e.target.closest(".card");
                const id = String(theItemCard.dataset.id);
                this.#tracker.removeTheItem(id, type);
                const el = theItemCard;
                // get current height (includes padding + border)
                const startHeight = el.offsetHeight + "px";
                // prepare element for collapsing
                el.style.boxSizing = "border-box";
                el.style.height = startHeight;
                el.style.overflow = "hidden";
                // ensure any existing transition cleared
                el.style.transition = "none";
                // force reflow to make sure browser registers starting height
                void el.offsetHeight;
                // set transition
                el.style.transition = "height 220ms ease, margin 220ms ease, padding 220ms ease, opacity 180ms ease";
                // collapse in next frame
                requestAnimationFrame(() => {
                    el.style.height = "0";
                    el.style.paddingTop = "0";
                    el.style.paddingBottom = "0";
                    el.style.marginTop = "0";
                    el.style.marginBottom = "0";
                    el.style.opacity = "0";
                });
                // cleanup and remove on transition end with timeout fallback
                let removed = false;
                const onEnd = (evt) => {
                    if (removed) return;
                    removed = true;
                    el.removeEventListener("transitionend", onEnd);
                    el.remove();
                };
                el.addEventListener("transitionend", onEnd);
                // fallback: in case transitionend doesn't fire
                setTimeout(() => {
                    if (!removed) {
                        removed = true;
                        el.removeEventListener("transitionend", onEnd);
                        el.remove();
                    }
                }, 400);
            }
        }
    }
    // filter Items Using Html Element
    #filterItems(type, e) {
        const keyword = e.target.value.toLowerCase().trim();
        const allCard = document.querySelectorAll(`#${type}-items .card h4`);
        allCard.forEach((element) => {
            const card = element.parentElement.parentElement.parentElement;
            const name = element.textContent.toLowerCase();
            if (!name.includes(keyword)) {
                card.classList.add("d-none");
            } else {
                card.classList.remove("d-none");
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
            const modal = Modal.getInstance(modalElement);
            modal.hide();
            input.value = "";
        }
    }
}
new App();
