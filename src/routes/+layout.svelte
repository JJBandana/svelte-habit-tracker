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
    :root {
      --bg-body: #09090b;
      --bg-surface: #18181b;
      --bg-surface-hover: #27272a;
      --border: #27272a;
      --border-hover: #3f3f46;
      
      --primary: #8b5cf6;
      --primary-hover: #7c3aed;
      --danger: #ef4444;
      
      --text-main: #fafafa;
      --text-muted: #a1a1aa;
      
      --radius: 12px;
      --radius-sm: 6px;
    }

    * {
      font-family:
        "Inter",
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
      -webkit-font-smoothing: antialiased;
    }

    body {
      margin-left: 4.5rem;
      background-color: var(--bg-body);
      color: var(--text-main);
      min-height: 100vh;
      line-height: 1.6;
    }

    a {
      text-decoration: none;
      color: inherit;
    }

    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: var(--bg-body);
    }
    ::-webkit-scrollbar-thumb {
      background: var(--border-hover);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--text-muted);
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      
      font-size: 0.9rem;
      font-weight: 500;
      line-height: 1;
      
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      background-color: var(--bg-surface);
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: var(--bg-surface-hover);
        color: var(--text-main);
        border-color: var(--border-hover);
      }
      
      &:active {
        transform: scale(0.98);
      }
    }
  }

  .header {
    height: 100vh;
    width: 4.5rem;
    background-color: var(--bg-surface);
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    padding-block: 24px;
    z-index: 100;
    border-right: 1px solid var(--border);
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: center;
    width: 100%;
  }

  .svg-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background-color: transparent;
    color: var(--text-muted);
    transition: all 0.2s ease;
    border: 1px solid transparent;
  }

  .svg-btn:hover {
    background-color: var(--bg-surface-hover);
    color: var(--primary);
  }
  
  .svg-btn:active {
    background-color: var(--bg-surface-hover);
    transform: scale(0.95);
  }

  @media (max-width: 600px) {
    :global(body) {
      margin-left: 0;
      margin-bottom: 5rem;
    }

    .header {
      height: 4rem;
      width: 100%;
      flex-direction: row;
      bottom: 0;
      top: auto;
      border-right: none;
      border-top: 1px solid var(--border);
      padding-block: 0;
      justify-content: space-around;
      background-color: rgba(24, 24, 27, 0.95);
      backdrop-filter: blur(10px);
    }

    nav {
      flex-direction: row;
      gap: 0;
      justify-content: space-around;
      align-items: center;
      padding-top: 0;
      width: 100%;
      max-width: 400px;
    }
    
    .svg-btn {
      width: 48px;
      height: 48px;
    }
  }
</style>
