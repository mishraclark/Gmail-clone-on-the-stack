<template>
<div class="float-right align-middle m-5">
<button class="btn" 
          @click="store.selectScreen('inbox')"
          :disabled="selectedScreen == 'inbox'">Inbox</button>
  <button class="btn"
          @click="store.selectScreen('archive')"
          :disabled="selectedScreen == 'archive'">Archived</button>
</div>
<BulkActionBar :emails="store.filteredEmails" />
  <table class="max-w-full m-auto border-collapse">
    <tbody>
      <tr v-for="email in store.filteredEmails"
          :key="email.id"
          :class="['cursor-pointer', email.read ? 'bg-gray-300' : 'bg-white']"
          >
        <td class="border-b border-t p-1 text-left">
          <input class="checkbox" type="checkbox"  @click="store.toggle(email)"
                 :checked="store.emailSelection.includes(email)" />
        </td>
        <td class="border-b p-1 text-left" @click="store.openEmail(email)">{{email.from}}</td>
        <td class="border-b p-1 text-left" @click="store.openEmail(email)">
          <p class="overflow-hidden max-h-5 px-5"><strong>{{email.subject}}</strong> - {{email.body}}</p>
        </td>
        <td class="border-b p-1 text-left w-32" @click="store.openEmail(email)">{{format(new Date(email.sentAt), 'MMM do yyyy')}}</td>
        <td class="border-b p-1 text-left" ><button class="btn" @click="email.archived = true">Archive</button></td>
      </tr>
    </tbody>
  </table>
   <ModalView v-if="openedEmail" @closeModal="openedEmail = null">
    <MailView :email="openedEmail" @changeEmail="store.changeEmail" />
  </ModalView>
</template>

<script setup lang="ts">
  import { format } from 'date-fns';
  import axios from 'axios';
  import MailView from './MailView.vue';
  import ModalView from './ModalView.vue';
  import BulkActionBar from './BulkActionBar.vue';
  import { Email, emailStore } from '../stores/emailStore';
  import { storeToRefs } from 'pinia';
      const store = emailStore()
      let {emails, selectedScreen, openedEmail, emailSelection} = storeToRefs(store)
      store.callEmails();
    
      
</script>
