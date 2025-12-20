<script lang="ts">
  import XSquare from "../../icons/XSquare.svelte";


  let { children, modalState = $bindable()} = $props()

  let dialog = $state() as HTMLDialogElement

  $effect(() => {
    if (modalState) {
      dialog.showModal()
    }
    else {
      dialog.close()
    }
  })
</script>

<dialog
bind:this={dialog}
onclose={() => modalState = false}
>
  <div class="dialog-header">
    <button class="svg-btn-close" onclick={() => dialog.close()}><XSquare /></button>
  </div>
  <div class="dialog-content">
    {@render children()} 
  </div>
</dialog>

<style>
  dialog {
    margin: auto;
    padding: 0;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    position: relative;
    background-color: var(--bg-surface);
    color: var(--text-main);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    max-width: 90vw;
    overflow: hidden;
  }
  
  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
  }

  .dialog-header {
    display: flex;
    justify-content: flex-end;
    padding: 16px;
    border-bottom: 1px solid var(--border);
    background-color: var(--bg-body);
  }

  .dialog-content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .svg-btn-close {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 4px;
  }

  .svg-btn-close:hover {
    color: var(--text-main);
    background-color: var(--bg-surface-hover);
  }
</style>