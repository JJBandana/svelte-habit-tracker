<script lang="ts">
  import { type Habit } from "$lib/Habit.svelte";
  import { SvelteDate, SvelteMap } from "svelte/reactivity";

  interface Props {
    foundHabit: Habit;
  }

  const { foundHabit }: Props = $props();
  const today = new SvelteDate();
  const todayFixed = new Date();

  // I HAVE TO FIX THESE 2 NEXT LINES!
  const [firstHabitDateString] =
    foundHabit.calendar.entries().next().value || [];
  const firstHabitDate: Date = new Date(firstHabitDateString || "2024-01-01");

  const createCalendar = (
    todaysDate: Date,
    habitCalendar: SvelteMap<string, boolean>
  ) => {
    const daysArray = [];

    const currentMonth = todaysDate.getMonth();
    const currentYear = todaysDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);

    let aux = new Date(firstDay);
    aux.setDate(aux.getDate() - (firstDay.getDay() || 7));

    // I HAVE TO FIX THIS PART OF firstHabitDate.
    const availableMonth = (
      firstHabitDate: Date,
      date: Date,
      today: Date,
      month: number
    ): boolean => {
      return (
        date.getMonth() === month &&
        date.getTime() < today.getTime() &&
        date.getTime() > firstHabitDate.getTime()
      );
    };

    for (let i = 0; i < 42; i++) {
      daysArray.push({
        day: aux.toLocaleDateString("en-CA"),
        isCompleted: habitCalendar.get(aux.toLocaleDateString("en-CA")),
        isCurrentMonth: availableMonth(
          firstHabitDate,
          aux,
          todayFixed,
          currentMonth
        ),
      });
      aux.setDate(aux.getDate() + 1);
    }

    return daysArray;
  };

  const prev = () => {
    today.setMonth(today.getMonth() - 1);
  };

  const next = () => {
    today.setMonth(today.getMonth() + 1);
  };

  const nextMonth = $derived(
    today.getMonth() === todayFixed.getMonth() &&
      today.getFullYear() === todayFixed.getFullYear()
  );
  const array = $derived(createCalendar(today, foundHabit.calendar));
</script>

<div class="datepicker">
  <div class="datepicker-header">
    <button onclick={() => prev()} class="Prev">Prev</button>
    <span>{today.getMonth() + 1} - {today.getFullYear()}</span>
    <button disabled={nextMonth} onclick={() => next()} class="Next"
      >Next</button
    >
  </div>

  <div class="days">
    <span>Sun</span>
    <span>Mon</span>
    <span>Tue</span>
    <span>Wed</span>
    <span>Thu</span>
    <span>Fri</span>
    <span>Sat</span>
    {#each array as { day, isCompleted, isCurrentMonth }}
      <button
        class="day"
        class:current={isCurrentMonth}
        class:done={isCompleted}
        disabled={!isCurrentMonth}
        onclick={() => {
          if (foundHabit.calendar.has(day)) {
            const value = foundHabit.calendar.get(day);
            foundHabit.calendar.set(day, !value);
          }
        }}>{+day.split("-")[2]}</button
      >
    {/each}
  </div>
</div>

<style>
  .datepicker {
    background-color: transparent;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  .datepicker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 0 8px;
  }

  .datepicker-header span {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-main);
    text-transform: capitalize;
  }

  .datepicker-header button {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 6px 12px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s ease;
  }

  .datepicker-header button:hover:not(:disabled) {
    background-color: var(--bg-surface-hover);
    color: var(--text-main);
    border-color: var(--border-hover);
  }

  .datepicker-header button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    justify-items: center;
    align-items: center;
  }

  .days span {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-muted);
    margin-bottom: 8px;
  }

  .day {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background-color: transparent;
    color: var(--text-muted);
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .current {
    background-color: var(--bg-surface-hover);
    color: var(--text-main);
    cursor: pointer;
  }

  .current:hover {
    background-color: var(--border-hover);
    transform: scale(1.1);
  }

  .done {
    background-color: var(--primary);
    color: white;
    font-weight: 600;
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
  }

  .done:hover {
    background-color: var(--primary-hover);
  }

  button:disabled {
    opacity: 0.2;
    cursor: default;
    background-color: transparent;
  }
  
  button.done[disabled] {
    background-color: var(--bg-surface-hover);
    color: var(--text-muted);
    box-shadow: none;
  }
</style>
