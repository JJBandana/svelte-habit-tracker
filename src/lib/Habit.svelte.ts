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

  clone() {
    const newHabit = new Habit(this._name);
    newHabit._id = this._id;
    newHabit.calendar = this.calendar;
    newHabit.createDate = this.createDate;

    return newHabit;
  }

  completedToday() {
    const today = new Date();
    return this.calendar.get(today.toLocaleDateString("en-CA"));
  }
}

function createCalendar(actualDate: Date) {
  let startDate = new Date(actualDate);
  startDate.setFullYear(actualDate.getFullYear() - 1);

  // Arrange the calendar to start in sunday
  let startDay = startDate.getDay();
  let daysToSunday = startDay === 0 ? 0 : startDay;
  startDate.setDate(startDate.getDate() - daysToSunday);

  // Arrange the calendar to end in saturday
  let finalDay = actualDate.getDay();
  console.group("Dates");
  console.log("finalDay", finalDay);
  let daysToSaturday = finalDay === 6 ? 0 : 6 - finalDay;
  console.log("daysToSaturday", daysToSaturday);
  let finalDate = new Date(actualDate);
  finalDate.setDate(actualDate.getDate() + daysToSaturday);
  console.log("actualDate", actualDate);
  console.log("actualDate + DaysToSaturday: ", finalDate);

  let calendar: SvelteMap<string, boolean> = new SvelteMap();
  let tempDate = new Date(startDate);

  // .setHours(0, 0, 0, 0) and .getTime() to avoid errors when comparing
  tempDate.setHours(0, 0, 0, 0);
  finalDate.setHours(0, 0, 0, 0);

  while (tempDate.getTime() <= finalDate.getTime()) {
    const dateStr = tempDate.toLocaleDateString("en-CA");
    calendar.set(dateStr, false);
    tempDate.setDate(tempDate.getDate() + 1);
    console.log(tempDate.getTime() == finalDate.getTime());
  }

  console.log("tempDate", tempDate.toLocaleDateString("en-CA"));
  console.groupEnd();
  return calendar;
}

export default Habit;
