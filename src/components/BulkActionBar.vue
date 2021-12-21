<template>
  <div class="w-full m-auto text-left pb-2">
    <input type="checkbox"
           :checked="allEmailsSelected"
           :class="['m-1', 'hover:border-2', 'w-6', 'h-6', 'border', 'align-middle', 'px-10', 'relative', 'rounded-sm', 'bg-white', 'cursor-pointer',  someEmailsSelected ? 'bg-gray-500' : '']"
           @click="bulkSelect" />
  </div>
</template>

<script>
  import { useEmailSelection } from '../composables/use-email-selection';
  import { computed } from 'vue'
  export default {
    setup(props){
      let emailSelection = useEmailSelection();
      let numberSelected = computed(() => emailSelection.emails.size)
      let numberEmails = props.emails.length
      let allEmailsSelected = computed(() => numberSelected.value === numberEmails)
      let someEmailsSelected = computed(() => {
        return numberSelected.value > 0 && numberSelected.value < numberEmails
      })
      let bulkSelect = function(){
        if(allEmailsSelected.value) {
          emailSelection.clear()
        } else {
          emailSelection.addMultiple(props.emails)
        }
      }
      return {
        allEmailsSelected,
        someEmailsSelected,
        bulkSelect
      }
    },
    props: {
      emails: {
        type: Array,
        required: true
      }
    }
  }
</script>

<style scoped>
</style>