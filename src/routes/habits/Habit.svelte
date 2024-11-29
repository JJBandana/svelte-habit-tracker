<script lang="ts">
  import Habit from "$lib/Habit.svelte";
  let { habitName = "Habit" } = $props()
  
  
  const habit = new Habit(habitName);
  console.log(habit)
  habit.calendar.set("2024-11-05", true)

  const getToday = (): string => new Date().toLocaleDateString("en-CA");

  const today = getToday();

  function toggleToday(){
    const state = habit.calendar.get(today)

    const confirmed = !state || confirm("Are you sure you want to uncheck today?")

    if (confirmed) {
      habit.calendar.set(today, !state)
    }
  }

</script>

<div class="habit">
  <h1>{habit.name}</h1>
  <button onclick={toggleToday}>{habit.calendar.get(new Date().toLocaleDateString("en-CA"))? "Un-check" : "Check"}</button>
  <div class="matrix">
    {#each habit.calendar as [_, value]}
      <div class={`day ${value ? "on": ""}`}></div>
    {/each}
  </div>
</div>

<style>
.habit {
  background-color: rgb(15, 46, 141);
  color: white;
}

.matrix {
  padding-block: 4px;
  background-color: rgb(15, 46, 141);
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(7, 14px);
  grid-template-columns: 14px;
  grid-auto-columns: 14px;
  gap: 2px;
  overflow-x: auto;
}

.day {
  background-color: rgb(179, 0, 255);
  border-radius: 3px;
  width: 14px;
  height: 14px;
  border: rgb(137, 38, 179) solid 1px;
}

.on {
  background-color: greenyellow;
}

</style>