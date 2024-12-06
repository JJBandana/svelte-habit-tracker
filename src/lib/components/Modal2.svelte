<script lang="ts">

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
  {@render children()}  
</dialog>