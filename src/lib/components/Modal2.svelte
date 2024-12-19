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
    <button class="svg-btn" onclick={() => dialog.close()}><XSquare /></button>
  </div>
  {@render children()} 
</dialog>

<style>
  dialog {
    margin: auto;
    padding: 10px;
    border: none;
    border-radius: 8px;
    position: relative;
  }

  .dialog-header {
    display:flex;
    justify-content: flex-end;
    margin-bottom: 8px;
  }

  .svg-btn {
    color: white;
    background-color: black;
    border-radius: 8px;
  }

  .svg-btn:hover {
    background-color: red;
    color:white;
  }
  
</style>