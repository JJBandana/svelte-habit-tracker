<script>
  import Atom from "../icons/Atom.svelte";
  import Dna from "../icons/DNA.svelte";
</script>

<div class="container">
  <header>
    <h1>Habit Tracker</h1>
    <p>Track your progress, build better habits, and stay organized.</p>
  </header>

  <div class="grid">
    <a href="/habits" class="card">
      <div class="icon-wrapper habits">
        <Dna />
      </div>
      <div class="card-content">
        <h2>Habits</h2>
        <p>Monitor your daily routines and build long-term consistency.</p>
      </div>
    </a>

    <a href="/todo" class="card">
      <div class="icon-wrapper todo">
        <Atom />
      </div>
      <div class="card-content">
        <h2>To-do List</h2>
        <p>Manage your tasks and keep track of what needs to be done.</p>
      </div>
    </a>
  </div>
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 4rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 4rem;
    min-height: 100vh;
  }

  header {
    text-align: center;
  }

  h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--text-main) 0%, var(--primary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.02em;
  }

  header p {
    font-size: 1.25rem;
    color: var(--text-muted);
    max-width: 500px;
    margin: 0 auto;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .card {
    background-color: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .card:hover {
    transform: translateY(-8px);
    border-color: var(--primary);
    background-color: var(--bg-surface-hover);
    box-shadow: 0 20px 40px -20px rgba(139, 92, 246, 0.15);
  }

  .icon-wrapper {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    background-color: var(--bg-body);
    color: var(--primary);
    transition: all 0.3s ease;
  }

  .card:hover .icon-wrapper {
    transform: scale(1.1);
    background-color: var(--primary);
    color: white;
  }

  .card-content h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--text-main);
  }

  .card-content p {
    color: var(--text-muted);
    line-height: 1.6;
  }

  @media (max-width: 600px) {
    .container {
      padding: 2rem 1.5rem;
      gap: 3rem;
    }

    h1 {
      font-size: 2.5rem;
    }

    .card {
      padding: 2rem;
    }
  }
</style>