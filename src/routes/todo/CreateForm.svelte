<script lang="ts">
  import { Todo } from "$lib/Todo.svelte";

  let { todoState } = $props()

  let todoName = $state("")
  let nameInput = $state<HTMLInputElement>() as HTMLInputElement

  const onsubmit = (e: SubmitEvent) => {
    e.preventDefault()
    todoState.add(new Todo(todoName))
    todoName = ""
    nameInput.focus()
  }
</script>

<form {onsubmit}>
  <input bind:this={nameInput} bind:value={todoName} placeholder="New Todo Name" type="text" name="name" id="name">
  <button type="submit">Add</button>
</form>