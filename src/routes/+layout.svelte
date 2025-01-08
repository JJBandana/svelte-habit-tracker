<script>
  import { setHabitState, setTodoState } from "$lib/state.svelte";
  import Atom from "../icons/Atom.svelte";
  import Dna from "../icons/DNA.svelte";

  let { children } = $props();

  setHabitState();
  setTodoState();
</script>

<div class="header">
  <nav>
    <a class="svg-btn" href="/habits">
      <Dna />
    </a>
    <a class="svg-btn" href="/todo">
      <Atom />
    </a>
  </nav>
</div>

{@render children()}

<style>
  :global {
    * {
      font-family:
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Oxygen,
        Ubuntu,
        Cantarell,
        "Open Sans",
        "Helvetica Neue",
        sans-serif;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      margin-left: 4rem;
      background-color: rgb(30, 30, 30);
      color: white;
    }

    a:visited {
      color: black;
    }

    .svg-btn {
      box-sizing: content-box;
      padding: 6px;
      background-color: aliceblue;
      width: 24px;
      height: 24px;
      border-radius: 15px;
      border: none;
      cursor: pointer;
    }

    .button {
      display: inline-flex;
      align-items: center;
      gap: 6px;

      font-size: 1rem;
      line-height: 1.5;
      box-sizing: content-box;
      border: none;
      min-width: 24px;
      max-height: 24px;
      padding: 4px;
      border-radius: 8px;
      &:hover {
        background-color: red;
        color: white;
        cursor: pointer;
      }
    }
  }

  .header {
    height: 100vh;
    width: 3rem;
    background-color: rgb(40, 40, 40);
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    padding-block: 8px;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
</style>
