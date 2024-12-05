<script lang="ts">
  import Habit from "$lib/Habit.svelte";
  import Check from "../../icons/Check.svelte";
  import Uncheck from "../../icons/Uncheck.svelte";

  interface Props {
    habit: Habit;
    today: string;
    handleDelete: (id: number) => void;
    toggleEdit: (id: number) => void;
  }

  let { habit, handleDelete, today, toggleEdit } : Props = $props()
  
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
    <button onclick={toggleToday}>
      {#if !habit.completedToday()}
        <Check />
      {:else}
        <Uncheck />
      {/if}
    </button>
    <button onclick={() => handleDelete(habit.id)}>Delete</button>
    <!-- <textarea class:open={isRenaming} class="rename" name="rename" id="rename" bind:value={newName}></textarea> -->
    <button onclick={() => toggleEdit(habit.id)}>rename</button>
  </div>

  <div class="calendar">
    {#each habit.calendar as [date, value]}
      <div class:on={value} class="day" title={date}></div>
    {/each}
  </div>
</div>

<style>
  :global {
    h1 {
      margin: 0;
    }
  }

  .container {
    height: min-content;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .habit {
    background-color: hsl(240, 70%, 12%);
    color: white;
  }

  .calendar {
    padding-block: 4px;
    background-color: hsl(240, 70%, 12%);
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(7, 14px);
    grid-template-columns: 14px;
    grid-auto-columns: 14px;
    gap: 2px;
    overflow-x: auto;
  }

  .day {
    background-color: #18381A;
    border-radius: 3px;
    width: 14px;
    height: 14px;
    border: #0e200f solid 1px;
    transition-property: background-color, border;
    transition-duration: .3s;
    transition-timing-function: ease-in-out;
  }

  .day.on {
    background-color: #4CAF50;
    border: #205e22 solid 1px;
  }
</style>