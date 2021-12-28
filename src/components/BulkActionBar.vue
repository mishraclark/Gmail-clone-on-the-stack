<template>
  <div class="w-full m-auto text-left pb-2">
    <span>
    <input type="checkbox"
            class="m-1 hover:border-2 w-6 h-6 border align-middle px-10 relative rounded-sm cursor-pointer"
           :checked="allEmailsSelected"
           :class="someEmailsSelected ? 'bg-blue-300' : ''"
           @click="bulkSelect" />
    </span>
 <span>
      <button class="btn" 
              @click="emailSelection.markRead"
              :disabled="[...emailSelection.emails].every(e => e.read)">
        Mark Read
      </button>
      <button class="btn" 
              @click="emailSelection.markUnread"
              :disabled="[...emailSelection.emails].every(e => !e.read)">
        Mark Unread
      </button>
      <button class="btn" 
              @click="emailSelection.archive"
              :disabled="numberSelected === 0">
        Archive
      </button>
    </span>
  </div>
</template>

<script>
  import { useEmailSelection } from '../composables/use-email-selection';
  import { computed } from 'vue'
  export default {
    setup(props){
      let emailSelection = useEmailSelection();
      let numberSelected = computed(() => emailSelection.emails.size)
      let numberEmails = computed(() => props.emails.length)
      let allEmailsSelected = computed(() => numberSelected.value === numberEmails.value && numberEmails.value > 0)
      let someEmailsSelected = computed(() => {
        return numberSelected.value > 0 && numberSelected.value < numberEmails.value
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
        bulkSelect,
        emailSelection,
        numberSelected
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