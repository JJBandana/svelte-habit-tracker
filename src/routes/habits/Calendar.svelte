<script lang="ts">
  import type Habit from "$lib/Habit.svelte";
  import { SvelteDate, SvelteMap } from "svelte/reactivity";

  interface Props {
    foundHabit: Habit,
  }

  const { foundHabit } : Props = $props()
  const today = new SvelteDate()
  const todayFixed = new Date()

  const createCalendar = (todaysDate: Date, habitCalendar: SvelteMap<string, boolean>) => {
    const daysArray = []

    const currentMonth = todaysDate.getMonth()
    const currentYear = todaysDate.getFullYear()
    const firstDay = new Date(currentYear, currentMonth, 1)

    let aux = new Date(firstDay)
    aux.setDate(aux.getDate() - (firstDay.getDay() || 7))

    const availableMonth = (date: Date, today: Date, month: number) : boolean => {
      return date.getMonth() === month && date.getTime() < today.getTime()
    }

    for (let i = 0; i < 42; i++) {
      daysArray.push({
        day: aux.toLocaleDateString("en-CA"),
        isCompleted: habitCalendar.get(aux.toLocaleDateString("en-CA")),
        isCurrentMonth: availableMonth(aux, todayFixed, currentMonth)
      })
      aux.setDate(aux.getDate() + 1)
    }

    return daysArray
  }

  const prev = () => {
    today.setMonth(today.getMonth() - 1)
  }

  const next = () => {
    today.setMonth(today.getMonth() + 1)
  }

  const nextMonth = $derived((today.getMonth() === todayFixed.getMonth() && today.getFullYear() === todayFixed.getFullYear()))
  const array = $derived(createCalendar(today, foundHabit.calendar))
</script>



<div class="datepicker">
  <div class="datepicker-header">
    <button onclick={() => prev()} class="Prev">Prev</button>
    <span>{today.getMonth() + 1} - {today.getFullYear()}</span>
      <button disabled={nextMonth} onclick={() => next()} class="Next">Next</button>
  </div>
  
  <div class="days">
    <span>Sun</span>
    <span>Mon</span>
    <span>Tue</span>
    <span>Wed</span>
    <span>Thu</span>
    <span>Fri</span>
    <span>Sat</span>
      {#each array as {day, isCompleted, isCurrentMonth}}
        <button
        class="day"
        class:current={isCurrentMonth}
        class:done={isCompleted}
        disabled={!isCurrentMonth}
        onclick={() => {
          const value = foundHabit.calendar.get(day)

          // if (value) {
            foundHabit.calendar.set(day, !value)
          // }
        }}
        >{+day.split("-")[2]}</button>
      {/each}
  </div>
</div>

<style>
  .days {
    display: grid;
    grid-template-columns: repeat(7, 30px);
    grid-template-rows: 30px;
    grid-auto-rows: 30px;
    gap: 6px;
    justify-items: center;
    align-items: center;
  }

  .datepicker {
    background-color: dimgray;
    width: max-content;
    padding: 6px;
    border-radius: 5px;
  }
  
  .day {
    background-color: hsl(0, 0%, 75%);
    border-radius: 5px;
    width: 100%;
    height: 100%;
    text-align: center;
    vertical-align: middle;
    line-height: 30px;
    border: none;
    font-weight: 600;
  }

  .current {
    background-color: hsl(0, 0%, 90%);
    cursor: pointer;
  }

  .done {
    background-color: hsl(120, 80%, 40%);
    color: white;
  }

  button.done[disabled] {
    background-color: hsl(120, 25%, 50%);
  }
  
  .datepicker-header {
    display: flex;
    justify-content: space-between;
  }
</style>