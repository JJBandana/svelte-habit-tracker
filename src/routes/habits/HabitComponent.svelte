<script lang="ts">
  import { Habit } from "$lib/Habit.svelte";
  import { onMount } from "svelte";
  import Check from "../../icons/Check.svelte";
  import Uncheck from "../../icons/Uncheck.svelte";
  import Trash from "../../icons/Trash.svelte";
  import Edit from "../../icons/Edit.svelte";

  interface Props {
    habit: Habit;
    today: string;
    handleDelete: (id: number) => void;
    toggleEdit: (id: number) => void;
  }

  let { habit, handleDelete, today, toggleEdit }: Props = $props();

  let calendar = $state() as HTMLDivElement;
  let isDragging = false;
  let startX: number;
  let scrollLeft: number;
  let isScrollable = $state(false);

  const checkScrollable = () => {
    if (calendar) {
      isScrollable = calendar.scrollWidth > calendar.clientWidth;
    }
  };

  function startDrag(event: MouseEvent | TouchEvent) {
    if (!calendar || !isScrollable) return;

    isDragging = true;
    const startEvent = event instanceof TouchEvent ? event.touches[0] : event;
    startX = startEvent.pageX - calendar.offsetLeft;
    scrollLeft = calendar.scrollLeft;

    if (calendar) {
      calendar.style.cursor = event instanceof TouchEvent ? "" : "grabbing";
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
      calendar.style.cursor = isScrollable ? "grab" : "default";
    }
  }

  function focusDay(date: string) {
    const dayElement = calendar?.querySelector(`[title="${date}"]`);
    if (dayElement) {
      dayElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }

  function toggleDay(date: string) {
    habit.calendar.set(date, !habit.calendar.get(date));
    focusDay(date);
  }

  onMount(() => {
    checkScrollable();

    if (calendar) {
      calendar.scrollLeft = calendar.scrollWidth;
    }
    window.addEventListener("resize", checkScrollable);
    return () => {
      window.removeEventListener("resize", checkScrollable);
    };
  });
</script>

<div class="habit">
  <div class="container">
    <h1>{habit.name}</h1>
    <div class="buttons">
      <button class="button" onclick={() => toggleDay(today)}>
        {#if !habit.isComplete(today)}
          <Check />
        {:else}
          <Uncheck />
        {/if}
      </button>
      <button class="button" onclick={() => handleDelete(habit.id)}
        ><Trash /></button
      >
      <button class="button" onclick={() => toggleEdit(habit.id)}
        ><Edit /></button
      >
    </div>
  </div>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="calendar"
    class:grabbable={isScrollable}
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
    gap: 8px;
  }

  .container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center; 
    height: min-content;
    margin-bottom: 16px; 

    h1 {
      margin-left: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-main);
    }
  }

  .habit {
    background-color: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px; 
    width: 100%; 
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .habit:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border-color: var(--border-hover);
  }

  .calendar {
    padding: 0;
    background-color: transparent;
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(7, 12px); /* Slightly smaller squares for cleaner look */
    grid-template-columns: 12px;
    grid-auto-columns: 12px;
    gap: 4px; /* More breathing room */
    overflow-x: auto; /* Allow scroll */
    width: 100%;
    cursor: default;
    
    /* Hide scrollbar */
    scrollbar-width: none; 
    -ms-overflow-style: none;
    
    /* Fade mask for edges */
    mask-image: linear-gradient(to right, black 90%, transparent 100%);

    &.grabbable {
      cursor: grab;
    }

    &:active {
      cursor: grabbing;
    }
  }
  
  .calendar::-webkit-scrollbar { 
    display: none; 
  }

  .day {
    background-color: var(--bg-surface-hover);
    border-radius: 2px;
    width: 12px;
    height: 12px;
    border: none;
    transition: all 0.2s ease;
  }

  .day:hover {
    transform: scale(1.2);
    z-index: 10;
  }

  .day.on {
    background-color: var(--primary);
    box-shadow: 0 0 8px rgba(139, 92, 246, 0.4); /* Glow effect */
  }
</style>
