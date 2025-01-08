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
    width: 70%;
    margin: 40px auto;
  }

  .svg {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
  }

  .todo-section {
    display: flex;
    flex-direction: column;

    align-items: center;
  }

  .list {
    display: flex;
    flex-direction: column;

    gap: 8px;
    width: 100%;
  }

  .todo-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    height: 52px;
    padding: 8px;

    border-radius: 8px;
    background-color: rgb(40, 40, 40);
    border: 1px solid rgb(90, 90, 90);
  }

  h4 {
    align-self: flex-start;
    margin-top: 20px;
  }

  .title {
    font-size: 3rem;
  }
</style>
