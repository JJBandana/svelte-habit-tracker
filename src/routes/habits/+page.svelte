<script lang="ts">
  import HabitComponent from "./HabitComponent.svelte";
  import Habit from "$lib/Habit.svelte";

  let habits = $state<Habit[]>([])

  const deleteHabit = (id : number) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      habits = habits.filter(habit => habit.id !== id)
    }
  }
  
  let habitName = $state("")

  const onsubmit = (e: SubmitEvent) => {
    e.preventDefault
    if (habitName.trim() !== "") {
      const newHabit = new Habit(habitName);
      habits = [...habits, newHabit]
      habitName = ""
    } else {
      alert("The habit name can not be an empty string")
    }
  }
</script>

<form {onsubmit}>
  <input type="text" name="habit-name" id="habit-name" placeholder="New Habit Name" bind:value={habitName}>
  <button type="submit">Add</button>
</form>

<div id="habits">
  <h1>Habits</h1>
  <hr>
  {#each habits as habit}
    <HabitComponent {habit} handleDelete={(id : number) => deleteHabit(id)} />
  {/each}
</div>



