<script lang="ts">
  import { getHabitState, getTodoState } from "$lib/state.svelte";
  import { Todo } from "$lib/Todo.svelte";
  import Modal2 from "$lib/components/Modal2.svelte";
  import CreateForm from "./CreateForm.svelte";
  import { SvelteMap } from "svelte/reactivity";
  import { Habit, type IHabit } from "$lib/Habit.svelte";
  import Trash from "../../icons/Trash.svelte";
  import Edit from "../../icons/Edit.svelte";
  import Check from "../../icons/Check.svelte";
  import Circle from "../../icons/Circle.svelte";

  interface ITodo {
    id: number;
    title: string;
    dueDate: string;
    priority: number;
    completed: boolean;
  }

  const todoState = getTodoState();
  const habitState = getHabitState();

  let foundTodo = $state<Todo>(new Todo("test"));
  let modalState = $state(false);

  const today = new Date().toLocaleDateString("en-CA");

  const editTodo = (todo: Todo) => {
    foundTodo = todo.clone();
    modalState = true;
  };

  const onsubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const index = todoState.todos.findIndex((todo) => todo.id === foundTodo.id);
    if (index !== -1) todoState.todos[index] = foundTodo;
    modalState = false;
  };

  $effect(() => {
    const savedTodos = localStorage.getItem("todos");

    if (savedTodos) {
      const todos: ITodo[] = JSON.parse(savedTodos);
      todoState.todos = todos.map(
        (todo) =>
          new Todo(
            todo.title,
            todo.id,
            todo.dueDate,
            todo.priority,
            todo.completed
          )
      );
    }
  });

  $effect(() => {
    localStorage.setItem("todos", JSON.stringify(todoState.todos));
  });

  $effect(() => {
    const savedHabits = localStorage.getItem("habits");

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
</script>

<div class="container">
  <h1 class="title">TO-DO List</h1>

  <Modal2 bind:modalState>
    <form method="dialog" {onsubmit}>
      <input
        type="text"
        name="title"
        id="title"
        bind:value={foundTodo.title}
        placeholder="Edit Task Title"
      />
      <button type="submit">Submit</button>
    </form>
  </Modal2>
  <CreateForm {todoState} />

  <div class="habit-section">
    <h4>Habits</h4>

    <div class="habits list">
      {#each habitState.habits as habit}
        <div class="todo-item">
          <button
            class="svg"
            onclick={() =>
              habit.calendar.set(today, !habit.calendar.get(today))}
          >
            {#if habit.isComplete(today)}
              <Check />
            {:else}
              <Circle />
            {/if}
          </button>
          {habit.name}
        </div>
      {/each}
    </div>
  </div>

  <section class="todo-section">
    <h4>Tasks</h4>

    <div class="todos list">
      {#each todoState.todos as todo}
        <div class="todo-item">
          <button class="svg" onclick={() => todoState.toggle(todo.id)}>
            {#if todo.completed}
              <Check />
            {:else}
              <Circle />
            {/if}
          </button>
          <p>{todo.title}</p>
          <div class="buttons">
            <button class="button" onclick={() => editTodo(todo)}
              ><Edit /></button
            >
            <button class="button" onclick={() => todoState.remove(todo.id)}
              ><Trash /></button
            >
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>

<style>
  .container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 3rem 1.5rem;
  }

  .svg {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }
  
  .svg:hover {
    color: var(--primary);
  }

  .todo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .todo-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    min-height: 56px;
    padding: 8px 16px;

    border-radius: var(--radius);
    background-color: var(--bg-surface);
    border: 1px solid var(--border);
    transition: all 0.2s ease;
    
    /* Subtle hover lift */
    &:hover {
      border-color: var(--border-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
  }
  
  .todo-item p {
    flex: 1;
    margin: 0 16px;
    font-size: 1rem;
    color: var(--text-main);
    word-break: break-word;
  }

  .buttons {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }

  h4 {
    align-self: flex-start;
    margin-top: 3rem;
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .habit-section {
    width: 100%;
  }

  .title {
    font-size: 2.5rem;
    font-weight: 800;
    text-align: center;
    margin-bottom: 2rem;
    background: linear-gradient(to right, var(--text-main), var(--text-muted));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 600px) {
    .title {
      font-size: 2rem;
    }
    
    .container {
      padding-top: 2rem;
      padding-bottom: 6rem; /* Space for bottom nav */
    }
  }
</style>
