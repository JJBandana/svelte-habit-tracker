<script lang="ts">
  import HabitComponent from "./HabitComponent.svelte";
  import Habit from "$lib/Habit.svelte";
  import { getHabitState } from "$lib/state.svelte";
  import Modal2 from "$lib/components/Modal2.svelte";
  import Calendar from "./Calendar.svelte";
  import CreateForm from "./CreateForm.svelte";

  const habitState = getHabitState()
  const today = new Date().toLocaleDateString("en-CA");

  let modalState = $state<boolean>(false)
  let foundHabit: Habit | undefined = $state();

  const toggleEdit = (id:number) => {
    foundHabit = habitState.habits.find(habit => habit.id === id)?.clone()
    if (foundHabit) {
      modalState = true
    }
  }

  const updateHabit = (updatedHabit: Habit) => {
    const index = habitState.habits.findIndex(habit => habit.id === updatedHabit.id)
    habitState.habits[index] = updatedHabit
  }

  const onsubmit = () => {
    if (foundHabit) {
      updateHabit(foundHabit)
    }
  }
</script>

<CreateForm {habitState} />

<Modal2 bind:modalState>
  <form method="dialog" {onsubmit}>
    {#if foundHabit}
      <input type="text" bind:value={foundHabit.name}>
    {/if}
    <button type="submit">Submit</button>
    <button onclick={(e) => e.preventDefault()}>Calendar</button>
    <!-- TO-DO ⬆️⬆️⬆️ calendar btn -->
  </form>

  {#if foundHabit}
    <Calendar {foundHabit} />
  {/if}
  
</Modal2>


<div id="habits">
  <h1>Habits</h1>
  <hr>
  {#each habitState.habits as habit}
    <HabitComponent
    {habit}
    {today}
    handleDelete={(id : number) => habitState.remove(id)}
    toggleEdit={(id: number) => toggleEdit(id)}
    />
  {/each}
</div>



