<script lang="ts">
  import { getHabitState, getTodoState } from "$lib/state.svelte";
  import { Todo } from "$lib/Todo.svelte";
  import Modal2 from "$lib/components/Modal2.svelte";
  import CreateForm from "./CreateForm.svelte";

  const todoState = getTodoState()
  const habitState = getHabitState()

  let foundTodo = $state<Todo>(new Todo("test"))
  let modalState = $state(false)

  const today = new Date().toLocaleDateString("en-CA")

  const editTodo = (todo: Todo) => {
    foundTodo = todo.clone()

    if (foundTodo) {
      modalState = true
    }
  }

  const onsubmit = () => {
    const index = todoState.todos.findIndex(todo => todo.id === foundTodo.id)
    todoState.todos[index] = foundTodo 
  }

</script>

<h1>TO-DO List</h1>
<Modal2 bind:modalState>
  <form method="dialog" {onsubmit}>
    <input type="text" name="name" id="name" bind:value={foundTodo.name}>
    <button type="submit">Submit</button>
  </form>
</Modal2>
<CreateForm {todoState} />

{#each habitState.habits as habit}
  <div>
    <input type="checkbox"
    checked={habit.calendar.get(today)}
    onchange={() => habit.calendar.set(today, !habit.calendar.get(today))}
    >
    {habit.name}
  </div>
{/each}

{#each todoState.todos as todo}
  <div>
    <input type="checkbox" bind:checked={todo.done}>
    {todo.name}
    <button onclick={() => editTodo(todo)}>Edit</button>
    <button onclick={() => todoState.remove(todo.id)}>Delete</button>
  </div>
{/each}

