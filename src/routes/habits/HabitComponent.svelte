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
    gap: 6px;
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
    transition-duration: 0.3s;
    transition-timing-function: ease-in-out;
  }

  .day.on {
    background-color: #0099cc;
    border: #00bfff solid 1px;
  }
</style>
