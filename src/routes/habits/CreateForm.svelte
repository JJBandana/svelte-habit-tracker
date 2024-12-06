<script lang="ts">
  import Habit from "$lib/Habit.svelte";
  import type { HabitState } from "$lib/state.svelte";

  interface Props {
    habitState: HabitState,
  }
  const { habitState } : Props = $props()

  let newHabitName = $state("")
  let nameInput = $state() as HTMLInputElement;

  const onsubmit = (e: SubmitEvent) => {
    e.preventDefault()
    if (newHabitName.trim() !== "") {
      const newHabit = new Habit(newHabitName);
      habitState.habits = [...habitState.habits, newHabit]
      newHabitName = ""
      nameInput.focus()
    } else {
      alert("The habit name can not be an empty string")
    }
  }
</script>

<form {onsubmit}>
  <input bind:this={nameInput} type="text" name="habit-name" id="habit-name" placeholder="New Habit Name" bind:value={newHabitName}>
  <button type="submit">Add</button>
</form>