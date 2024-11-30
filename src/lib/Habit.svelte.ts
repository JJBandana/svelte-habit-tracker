import { SvelteMap } from "svelte/reactivity";

class Habit {
  private _name: string = $state("None");
  private _id;
  createDate = new Date();
  calendar: SvelteMap<string, boolean>;

  constructor(name = "Habit") {
    this._id = Date.now();
    this.calendar = getYearDays(this.createDate);
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  get id() {
    return this._id;
  }
}

function getYearDays(date: Date) {
  const currentYear = date.getFullYear();
  const firstDay = new Date(currentYear, 0, 1);
  const lastDay = new Date(currentYear + 1, 0, 1);

  let currentDay = new Date(firstDay);
  let yearDays: SvelteMap<string, boolean> = new SvelteMap();

  while (currentDay < lastDay) {
    const dateStr = currentDay.toLocaleDateString("en-CA");
    yearDays.set(dateStr, false);

    currentDay.setDate(currentDay.getDate() + 1);
  }

  return yearDays;
}

export default Habit;
