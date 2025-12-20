<script lang="ts">
  import HabitComponent from "./HabitComponent.svelte";
  import { getHabitState } from "$lib/state.svelte";
  import Modal2 from "$lib/components/Modal2.svelte";
  import Calendar from "./Calendar.svelte";
  import CreateForm from "./CreateForm.svelte";
  import { SvelteMap } from "svelte/reactivity";
  import { Habit, type IHabit } from "$lib/Habit.svelte";

  const habitState = getHabitState();
  const today = new Date().toLocaleDateString("en-CA");

  let modalState = $state<boolean>(false);
  let foundHabit: Habit | undefined = $state();
  let showCalendar = $state(false);

  const toggleEdit = (id: number) => {
    foundHabit = habitState.habits.find((habit) => habit.id === id)?.clone();
    if (foundHabit) {
      modalState = true;
      showCalendar = false;
    }
  };

  const updateHabit = (updatedHabit: Habit) => {
    const index = habitState.habits.findIndex(
      (habit) => habit.id === updatedHabit.id
    );
    habitState.habits[index] = updatedHabit;
  };

  const onsubmit = () => {
    if (foundHabit) {
      updateHabit(foundHabit);
    }
  };

  $effect(() => {
    const savedHabits = localStorage.getItem("habits");
    console.log(savedHabits);

    if (savedHabits) {
      const habits: IHabit[] = JSON.parse(savedHabits);

      habitState.habits = habits.map((habit) => {
        const calendarMap = new SvelteMap<string, boolean>(
          Object.entries(habit.calendar)
        );
        return new Habit(habit.name, habit.id, habit.createDate, calendarMap);
      });
    }
  });

  $effect(() => {
    const habitsToSave = habitState.habits.map((habit) => ({
      ...habit,
      calendar: Object.fromEntries(habit.calendar),
    }));

    localStorage.setItem("habits", JSON.stringify(habitsToSave));
  });

  $inspect(habitState.habits);
</script>

<div class="container">
  <h1 class="title">Habits</h1>
  <CreateForm {habitState} />

  <Modal2 bind:modalState>
    <form method="dialog" {onsubmit} class="edit-form">
      {#if foundHabit}
        <div class="input-group">
          <label for="habit-name">Habit Name</label>
          <input type="text" id="habit-name" bind:value={foundHabit.name} placeholder="Enter habit name" />
        </div>
      {/if}
      <div class="modal-actions">
        <button class="button secondary" onclick={(e) => { e.preventDefault(); showCalendar = !showCalendar; }}>
          {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
        </button>
        <button type="submit" class="button primary">Save Changes</button>
      </div>
    </form>

    {#if foundHabit && showCalendar}
      <div class="calendar-wrapper">
        <Calendar {foundHabit} />
      </div>
    {/if}
  </Modal2>

  <div class="habits">
    {#each habitState.habits as habit}
      <HabitComponent
        {habit}
        {today}
        handleDelete={(id: number) => habitState.remove(id)}
        toggleEdit={(id: number) => toggleEdit(id)}
      />
    {/each}
  </div>
</div>

<style>
  .container {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 3rem 1.5rem;
    padding-bottom: 6rem;
  }
  
  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .input-group label {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-muted);
  }

  .edit-form input[type="text"] {
    width: 100%;
    padding: 10px 14px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background-color: var(--bg-body);
    color: var(--text-main);
    font-size: 1rem;
    transition: all 0.2s;
  }

  .edit-form input[type="text"]:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
  }
  
  .button.primary {
    background-color: var(--primary);
    color: white;
    border: none;
  }
  
  .button.primary:hover {
    background-color: var(--primary-hover);
  }
  
  .button.secondary {
    background-color: transparent;
    border: 1px solid var(--border);
  }

  .calendar-wrapper {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
  }

  .habits {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    width: 100%;
    margin-top: 32px;
  }
  
  .habits > :global(*:last-child:nth-child(odd)) {
    grid-column: 1 / -1;
  }

  .title {
    font-size: 2.5rem;
    font-weight: 800;
    text-align: center;
    margin-bottom: 2rem;
    letter-spacing: -0.02em;
    background: linear-gradient(to bottom right, var(--text-main), var(--text-muted));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 800px) {
    .habits {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 600px) {
    .title {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      text-align: left;
    }
    
    .container {
      padding: 1.5rem 1rem;
      padding-bottom: 8rem;
    }
    
    .modal-actions {
      flex-direction: column-reverse;
    }
    
    .button {
      width: 100%;
    }
  }
</style>
