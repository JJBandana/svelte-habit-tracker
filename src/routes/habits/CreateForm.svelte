<script lang="ts">
  import { Habit } from "$lib/Habit.svelte";
  import type { HabitState } from "$lib/state.svelte";
  import Plus from "../../icons/Plus.svelte";

  interface Props {
    habitState: HabitState;
  }
  const { habitState }: Props = $props();

  let newHabitName = $state("");
  let nameInput = $state() as HTMLInputElement;

  const onsubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (newHabitName.trim() !== "") {
      const newHabit = new Habit(newHabitName);
      habitState.habits = [...habitState.habits, newHabit];
      newHabitName = "";
      nameInput.focus();
    } else {
      alert("The habit name can not be an empty string");
    }
  };
</script>

<form {onsubmit}>
  <input
    bind:this={nameInput}
    type="text"
    name="habit-name"
    id="habit-name"
    placeholder="New Habit Name"
    bind:value={newHabitName}
  />
  <button class="button" type="submit"><Plus />Create</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    gap: 8px;

    input[type="text"] {
      color: white;
      border: 1px solid rgb(90, 90, 90);
      font-size: 1.3rem;
      padding-block: 6px;
      width: 100%;
      border-radius: 8px;
      padding-left: 20px;
      background-color: rgb(35, 35, 35);

      &:focus {
        outline: rgb(161, 78, 245) 2px solid;
      }
    }

    button.button {
      max-height: none;
      padding-inline: 10px;
    }
  }
</style>
