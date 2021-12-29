<template>
  <div class="w-full m-auto text-left pb-2">
    <span>
    <input type="checkbox"
            class="m-1 hover:border-2 w-6 h-6 border align-middle px-10 relative rounded-sm cursor-pointer"
           :checked="store.allEmailsSelected"
           @click="store.bulkSelect" />
    </span>
 <span>
      <button class="btn" 
              @click="store.markRead"
              :disabled="[...emailSelection].every(e => e.read)">
        Mark Read
      </button>
      <button class="btn" 
              @click="store.markUnread"
              :disabled="[...emailSelection].every(e => !e.read)">
        Mark Unread
      </button>
      <button class="btn" 
              @click="store.archive"
              :disabled="store.numberSelected === 0">
        Archive
      </button>
    </span>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Email, emailStore } from '../stores/emailStore';
  import { storeToRefs } from 'pinia';
  const store = emailStore()
      let {emails, selectedScreen, openedEmail, emailSelection} = storeToRefs(store)
      
      
   
</script>
