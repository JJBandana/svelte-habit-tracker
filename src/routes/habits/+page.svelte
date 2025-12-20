<script lang="ts">
  import HabitComponent from "./HabitComponent.svelte";
  import { getHabitState } from "$lib/state.svelte";
  import Modal2 from "$lib/components/Modal2.svelte";
  import Calendar from "./Calendar.svelte";
  import CreateForm from "./CreateForm.svelte";
  import { SvelteMap } from "svelte/reactivity";
  import { Habit, type IHabit } from "$lib/Habit.svelte";

  const habitState = getHabitState();
  const today = new Date().toLocaleDateString("en-CA");

  let modalState = $state<boolean>(false);
  let foundHabit: Habit | undefined = $state();

  const toggleEdit = (id: number) => {
    foundHabit = habitState.habits.find((habit) => habit.id === id)?.clone();
    if (foundHabit) {
      modalState = true;
    }
  };

  const updateHabit = (updatedHabit: Habit) => {
    const index = habitState.habits.findIndex(
      (habit) => habit.id === updatedHabit.id
    );
    habitState.habits[index] = updatedHabit;
  };

  const onsubmit = () => {
    if (foundHabit) {
      updateHabit(foundHabit);
    }
  };

  $effect(() => {
    const savedHabits = localStorage.getItem("habits");
    console.log(savedHabits);

    if (savedHabits) {
      const habits: IHabit[] = JSON.parse(savedHabits);

      habitState.habits = habits.map((habit) => {
        const calendarMap = new SvelteMap<string, boolean>(
          Object.entries(habit.calendar)
        );
        return new Habit(habit.name, habit.id, habit.createDate, calendarMap);
      });
    }
  });

  $effect(() => {
    const habitsToSave = habitState.habits.map((habit) => ({
      ...habit,
      calendar: Object.fromEntries(habit.calendar),
    }));

    localStorage.setItem("habits", JSON.stringify(habitsToSave));
  });

  $inspect(habitState.habits);
</script>

<div class="container">
  <h1 class="title">Habits</h1>
  <CreateForm {habitState} />

  <Modal2 bind:modalState>
    <form method="dialog" {onsubmit}>
      {#if foundHabit}
        <input type="text" bind:value={foundHabit.name} />
      {/if}
      <button type="submit">Submit</button>
      <button onclick={(e) => e.preventDefault()}>Calendar</button>
      <!-- TO-DO ⬆️⬆️⬆️ calendar btn -->
    </form>

    {#if foundHabit}
      <Calendar {foundHabit} />
    {/if}
  </Modal2>

  <div class="habits">
    {#each habitState.habits as habit}
      <HabitComponent
        {habit}
        {today}
        handleDelete={(id: number) => habitState.remove(id)}
        toggleEdit={(id: number) => toggleEdit(id)}
      />
    {/each}
  </div>
</div>

<style>
  .container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .habits {
    display: flex;
    flex-direction: column;
    gap: 8px; /* Increased gap slightly */
    align-items: center;
    width: 100%;

    margin-top: 20px;
  }

  .title {
    font-size: 3rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 2rem;
  }

  @media (max-width: 600px) {
    .title {
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }
    
    .container {
      padding-top: 1rem;
    }
  }
</style>
