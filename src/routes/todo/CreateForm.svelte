<script lang="ts">
  import { Todo } from "$lib/Todo.svelte";
  import Plus from "../../icons/Plus.svelte";

  let { todoState } = $props();

  let todoName = $state("");
  let nameInput = $state<HTMLInputElement>() as HTMLInputElement;

  const onsubmit = (e: SubmitEvent) => {
    e.preventDefault();
    todoState.add(new Todo(todoName));
    todoName = "";
    nameInput.focus();
  };
</script>

<form {onsubmit}>
  <input
    bind:this={nameInput}
    bind:value={todoName}
    placeholder="New Todo Name"
    type="text"
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
