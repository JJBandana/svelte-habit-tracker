<script>
  import { setHabitState, setTodoState } from '$lib/state.svelte';

	let { children } = $props();

  setHabitState()
  setTodoState()
</script>

<nav>
  <a href="/habits">Habits Page</a>
  <a href="/todo">To-do List</a>
</nav>

{@render children()}

<style>
  nav {
    display: inline-flex;
    gap: 36px;
    margin-bottom: 16px;
  }
</style>