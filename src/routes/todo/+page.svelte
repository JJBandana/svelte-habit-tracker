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
  <h1 class="title">Tasks</h1>

  <Modal2 bind:modalState>
    <form method="dialog" {onsubmit} class="edit-form">
      <div class="input-group">
        <label for="title">Task Title</label>
        <input
          type="text"
          name="title"
          id="title"
          bind:value={foundTodo.title}
          placeholder="Edit Task Title"
        />
      </div>
      <div class="modal-actions">
        <button type="button" class="button secondary" onclick={() => modalState = false}>Cancel</button>
        <button type="submit" class="button primary">Save Changes</button>
      </div>
    </form>
  </Modal2>
  <CreateForm {todoState} />

  <div class="habit-section">
    <h4>Habits</h4>

    <div class="habits list">
      {#each habitState.habits as habit}
        <div class="todo-item" class:completed={habit.isComplete(today)}>
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
        <div class="todo-item" class:completed={todo.completed}>
          <button class="svg" onclick={() => todoState.toggle(todo.id)}>
            {#if todo.completed}
              <Check />
            {:else}
              <Circle />
            {/if}
          </button>
          <p>{todo.title}</p>
          <div class="buttons">
            <button class="button icon-only" onclick={() => editTodo(todo)}
              ><Edit /></button
            >
            <button class="button icon-only danger" onclick={() => todoState.remove(todo.id)}
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
    max-width: 600px;
    margin: 0 auto;
    padding: 3rem 1.5rem;
    padding-bottom: 6rem;
  }
  

  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 300px;
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

  .edit-form input {
    width: 100%;
    padding: 10px 14px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background-color: var(--bg-body);
    color: var(--text-main);
    font-size: 1rem;
    transition: all 0.2s;
  }

  .edit-form input:focus {
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
  
  .button.icon-only {
    padding: 6px;
    min-width: auto;
    background: transparent;
    border: none;
  }
  
  .button.icon-only:hover {
    background-color: var(--bg-surface-hover);
    color: var(--primary);
  }
  
  .button.icon-only.danger:hover {
    color: var(--danger);
    background-color: rgba(239, 68, 68, 0.1);
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
    transition: color 0.2s, text-decoration 0.2s;
  }
  
  .todo-item.completed {
    opacity: 0.6;
    background-color: transparent;
    border-color: transparent;
  }
  
  .todo-item.completed p {
    text-decoration: line-through;
    color: var(--text-muted);
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
    letter-spacing: -0.02em;
    background: linear-gradient(to bottom right, var(--text-main), var(--text-muted));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
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
    
    .edit-form {
      min-width: 100%;
    }
  }
</style>
