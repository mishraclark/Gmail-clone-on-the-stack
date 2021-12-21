<template>
  <div class="w-full h-full fixed left-0 top-0">
    <div class="w-full h-full fixed left-0 top-0 bg-black opacity-70" @click="emit('closeModal')"></div>
    <div class="relative max-w-[80%] m-auto mt-8 p-5 bg-white min-h-[500px] z-10 opacity-95">
      <slot />
    </div>
  </div>
</template>

<script>
  import useKeydown from '../composables/use-keydown';
  export default {
    setup(props, {emit}) {
      useKeydown([
        {key: 'Escape', fn: () => { emit('closeModal') }},
      ])
    
      return {
        emit
      }
    }
  }
</script>

<style scoped>
</style>