<script lang="ts">
  import { getHabitState, getTodoState } from "$lib/state.svelte";
  import { Todo } from "$lib/Todo.svelte";
  import Modal2 from "$lib/components/Modal2.svelte";
  import CreateForm from "./CreateForm.svelte";
  import { SvelteMap } from "svelte/reactivity";
  import { Habit, type IHabit } from "$lib/Habit.svelte";

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

  $inspect(todoState.todos);

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
</script>

<h1>TO-DO List</h1>

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

<h2>Habits</h2>
{#each habitState.habits as habit}
  <div>
    <input
      type="checkbox"
      checked={habit.calendar.get(today)}
      onchange={() => habit.calendar.set(today, !habit.calendar.get(today))}
    />
    {habit.name}
  </div>
{/each}

<h2>Tasks</h2>
{#each todoState.todos as todo}
  <div>
    <input
      type="checkbox"
      onchange={() => todoState.toggle(todo.id)}
      checked={todo.completed}
    />
    {todo.title}
    <button onclick={() => editTodo(todo)}>Edit</button>
    <button onclick={() => todoState.remove(todo.id)}>Delete</button>
  </div>
{/each}

<style>
  h2 {
    margin-top: 20px;
  }

  input[type="checkbox"] {
    margin-right: 10px;
  }
</style>
