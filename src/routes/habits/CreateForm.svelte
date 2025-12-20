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
    gap: 12px;
    margin-bottom: 24px;

    input[type="text"] {
      flex: 1;
      color: var(--text-main);
      border: 1px solid var(--border);
      font-size: 1rem;
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      background-color: var(--bg-surface);
      transition: all 0.2s ease;

      &::placeholder {
        color: var(--text-muted);
      }

      &:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
      }
    }

    button.button {
      max-height: none;
      padding-inline: 16px;
      background-color: var(--primary);
      color: white;
      border: none;
      font-weight: 600;
      
      &:hover {
        background-color: var(--primary-hover);
        transform: translateY(-1px);
        box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.3);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
</style>
