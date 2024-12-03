<script lang="ts">
  import type Habit from "$lib/Habit.svelte";

  interface Props {
    showModal: boolean;
    foundHabit: Habit | undefined;
    updateHabit: (updatedHabit: Habit) => void;
  }

	let { showModal = $bindable(), foundHabit, updateHabit } : Props = $props();

	let dialog = $state() as HTMLDialogElement; // HTMLDialogElement
  let editedHabit: Habit | undefined = $state();

	$effect(() => {
    if (showModal && foundHabit) {
      dialog.showModal()
      editedHabit = foundHabit ? foundHabit.clone() : undefined
    } else {
      dialog.close()
    }
	});
  
  const onsubmit = (e: SubmitEvent) => {
    if (editedHabit) {
      console.log(editedHabit.name)
      updateHabit(editedHabit)
    }
  }
</script>

<dialog
bind:this={dialog}
onclose={() => (showModal = false)}
>
  <button onclick={() => dialog.close()}>close modal</button>
  <form method="dialog" {onsubmit}>
    {#if editedHabit}
      <input type="text" bind:value={editedHabit.name}> <!-- EDITAR AQUI -->

    {/if}
    <button type="submit">Submit</button>
  </form>
</dialog>