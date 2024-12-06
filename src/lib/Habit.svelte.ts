import { SvelteMap } from "svelte/reactivity";

class Habit {
  private _name: string = $state("New Habit");
  private _id;
  createDate = new Date();
  calendar: SvelteMap<string, boolean>;

  constructor(name = "New Habit") {
    this._id = Date.now();
    this.calendar = createCalendar(this.createDate);
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

  toggleDate(str: string) {
    this.calendar.set(str, !this.calendar.get(str));
  }

  clone(): Habit {
    const newHabit = new Habit(this._name);
    newHabit._id = this._id;
    newHabit.calendar = this.calendar;
    newHabit.createDate = this.createDate;

    return newHabit;
  }

  isComplete(date: string): boolean {
    return this.calendar.get(date) || false;
  }
}

function createCalendar(actualDate: Date) {
  // .setHours(0, 0, 0, 0) to avoid errors when comparing
  actualDate.setHours(0, 0, 0, 0);

  let startDate = new Date(actualDate);
  startDate.setFullYear(actualDate.getFullYear() - 1);

  // Arrange the calendar to start in sunday
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // Arrange the calendar to end in saturday
  let finalDate = new Date(actualDate);
  finalDate.setDate(actualDate.getDate() + (6 - actualDate.getDay()));

  let calendar: SvelteMap<string, boolean> = new SvelteMap();

  while (startDate.getTime() <= finalDate.getTime()) {
    calendar.set(startDate.toLocaleDateString("en-CA"), false);
    startDate.setDate(startDate.getDate() + 1);
  }

  return calendar;
}

export default Habit;
