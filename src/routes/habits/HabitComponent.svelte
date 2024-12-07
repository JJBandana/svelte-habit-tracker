<script lang="ts">
  import Habit from "$lib/Habit.svelte";
  import { onMount } from "svelte";
  import Check from "../../icons/Check.svelte";
  import Uncheck from "../../icons/Uncheck.svelte";

  interface Props {
    habit: Habit;
    today: string;
    handleDelete: (id: number) => void;
    toggleEdit: (id: number) => void;
  }

  let { habit, handleDelete, today, toggleEdit } : Props = $props()

  let calendar = $state() as HTMLDivElement;
  let isDragging = false;
  let startX: number;
  let scrollLeft: number;
  let isScrollable = $state(false);

  const checkScrollable = () => {
    if (calendar) {
      isScrollable = calendar.scrollWidth > calendar.clientWidth;
    }
    console.log("isScrollable", isScrollable)
  }

  function startDrag(event: MouseEvent | TouchEvent) {
    if (!calendar || !isScrollable) return;

    isDragging = true;
    const startEvent = event instanceof TouchEvent ? event.touches[0] : event;
    startX = startEvent.pageX - calendar.offsetLeft;
    scrollLeft = calendar.scrollLeft;

    if (calendar) {
      calendar.style.cursor = event instanceof TouchEvent ? '' : 'grabbing';
    }
  }

  function onMove(event: MouseEvent | TouchEvent) {
    if (!isDragging || !calendar) return;

    event.preventDefault();
    const moveEvent = event instanceof TouchEvent ? event.touches[0] : event;
    const x = moveEvent.pageX - calendar.offsetLeft;
    const walk = x - startX;
    calendar.scrollLeft = scrollLeft - walk;
  }

  function stopDragging() {
    isDragging = false;
    if (calendar) {
        calendar.style.cursor = isScrollable ? 'grab' : 'default';
    }
  }

  onMount(() => {
    checkScrollable();    
    window.addEventListener('resize', checkScrollable);
    return () => {
      window.removeEventListener('resize', checkScrollable);
    };
  });

</script>

<div class="habit">
  <div class="container">
    <h1>{habit.name}</h1>
    <div class="buttons">
    <button onclick={() => habit.calendar.set(today, !habit.calendar.get(today))}>
      {#if !habit.isComplete(today)}
        <Check />
      {:else}
        <Uncheck />
      {/if}
    </button>
    <button onclick={() => handleDelete(habit.id)}>Delete</button>
    <button onclick={() => toggleEdit(habit.id)}>rename</button>
    </div>
  </div>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="calendar" class:grabbable={isScrollable}
  bind:this={calendar}
  onmouseup={stopDragging}
  onmouseleave={stopDragging}
  onmousedown={startDrag}
  onmousemove={onMove}

  ontouchstart={startDrag}
  ontouchmove={onMove}
  ontouchend={stopDragging}
  >
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

  .buttons {
    display: flex;
  }

  .container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: min-content;

    h1 {
      margin-left: 4px;
    }
  }

  .habit {
    background-color: #00161d;
    color: white;
    border: #001e27 solid 2px;
    border-radius: 10px;
    padding: 10px;
    width: 100%;
    max-width: fit-content;
  }

  .calendar {
    padding: 4px;
    background-color: #00161d;
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(7, 14px);
    grid-template-columns: 14px;
    grid-auto-columns: 14px;
    gap: 2px;
    overflow-x: hidden;
    width: 100%;
    box-sizing: border-box;
    cursor: default;

    &.grabbable {
      cursor: grab;
    }

    &:active {
      cursor: grabbing;
    }
  }

  .day {
    background-color: #004055;
    border-radius: 3px;
    width: 14px;
    height: 14px;
    border: #004f69 solid 1px;
    transition-property: background-color, border;
    transition-duration: .3s;
    transition-timing-function: ease-in-out;
  }

  .day.on {
    background-color: #0099cc;
    border: #00BFFF solid 1px;
  }
</style>