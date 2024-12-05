<script lang="ts">
  import HabitComponent from "./HabitComponent.svelte";
  import Habit from "$lib/Habit.svelte";
  import Modal from "./Modal.svelte";
  import Calendar from "./Calendar.svelte";

  let habits = $state<Habit[]>([])
  let showModal = $state(true)
  let newHabitName = $state("")

  let foundHabit: Habit | undefined = $state();
  const toggleEdit = (id:number) => {
    foundHabit = habits.find(habit => habit.id === id)
    if (foundHabit) {
      showModal = true
    }
  }

  const updateHabit = (updatedHabit: Habit) => {
    const index = habits.findIndex(habit => habit.id === updatedHabit.id)
    habits[index] = updatedHabit
  }

  const deleteHabit = (id: number) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      habits = habits.filter(habit => habit.id !== id)
    }
  }

  const getToday = (): string => new Date().toLocaleDateString("en-CA");
  const today = getToday();
  
  const onsubmit = (e: SubmitEvent) => {
    e.preventDefault()
    if (newHabitName.trim() !== "") {
      const newHabit = new Habit(newHabitName);
      habits = [...habits, newHabit]
      newHabitName = ""
    } else {
      alert("The habit name can not be an empty string")
    }
  }
</script>

<form {onsubmit}>
  <input type="text" name="habit-name" id="habit-name" placeholder="New Habit Name" bind:value={newHabitName}>
  <button type="submit">Add</button>
</form>

{#if showModal}
  <Modal bind:showModal {foundHabit} {updateHabit} />
{/if}

<div id="habits">
  <h1>Habits</h1>
  <hr>
  {#each habits as habit}
    <HabitComponent
    {habit}
    {today}
    handleDelete={(id : number) => deleteHabit(id)}
    toggleEdit={(id: number) => toggleEdit(id)}
    />
  {/each}
</div>



