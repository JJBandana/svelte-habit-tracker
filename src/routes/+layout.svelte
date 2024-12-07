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
  :global {
    * {
      font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
    }
  }


  nav {
    display: inline-flex;
    gap: 36px;
    margin-bottom: 16px;
  }
</style>