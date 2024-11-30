<script lang="ts">
  import Habit from "$lib/Habit.svelte";

  interface Props {
    habit: Habit,
    handleDelete: Function
  }

  let { habit, handleDelete } : Props = $props()

  let isRenaming = $state(false);
  let newName = $state(habit.name)

  const toggleRename = () => {
    isRenaming = !isRenaming
    
    if (!isRenaming) {
      habit.name = newName
    }
  }
  
  habit.calendar.set("2024-11-05", true)
  console.table(habit.calendar)


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
  <div class="container">
    <h1>{habit.name}</h1>
    <button onclick={toggleToday}>{habit.calendar.get(new Date().toLocaleDateString("en-CA"))? "Un-check" : "Check"}</button>
    <button onclick={() => handleDelete(habit.id)}>Delete</button>
    <textarea class={`rename ${isRenaming ? "open" : ""}`} name="rename" id="rename" bind:value={newName}></textarea>
    <button onclick={() => toggleRename()}>rename</button>
  </div>
  <div class="calendar">
    {#each habit.calendar as [date, value]}
      <div class={`day ${value ? "on": ""}`} title={date}></div>
    {/each}
  </div>
</div>

<style>
  :global {
    h1 {
      margin: 0;
    }
  }

  textarea {
    resize: none;
    box-sizing: border-box;
    border: none;
    padding: 0;
  }

  textarea.rename {
    width: 0;
    transition: width .3s ease;
  }

  textarea.open {
    width: 100px;
    transition: width .3s ease;
  }

  .container {
    height: min-content;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .habit {
    background-color: rgb(15, 46, 141);
    color: white;
  }

  .calendar {
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
    transition: background-color 0.3s ease;
  }

  .day.on {
    background-color: #4CAF50;
  }
</style>