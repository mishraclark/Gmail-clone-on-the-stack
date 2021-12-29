<template>
  <div class="text-left">
    <div>
      <button class="btn" @click="toggleArchive">{{store.openedEmail.archived ? 'Move to Inbox (e)' : 'Archive (e)'}}</button>
      <button class="btn" @click="toggleRead">{{store.openedEmail.read ? 'Mark Unread (r)' : 'Mark Read (r)'}}</button>
      <button class="btn" @click="goNewer">Newer (k)</button>
      <button class="btn" @click="goOlder">Older (j)</button>
    </div>
    <h2>Subject: <strong>{{store.openedEmail.subject}}</strong></h2>
    <div><em>From {{store.openedEmail.from}} on {{format(new Date(store.openedEmail.sentAt), 'MMM do yyyy')}}</em></div>
    <div>{{store.openedEmail.body}}</div>
  </div>
</template>

<script setup lang="ts">
  import  { format } from 'date-fns'
  import axios from 'axios'
  import useKeydown from '../composables/use-keydown'
  import { Email, emailStore } from '../stores/emailStore';
  import { storeToRefs } from 'pinia';
      const store = emailStore()
      let {emails, selectedScreen, openedEmail, emailSelection} = storeToRefs(store)
      let email = store.openedEmail;

      
      let toggleRead = () => { store.changeEmail({toggleRead: true, toggleArchive: false, save: true, closeModal: false, changeIndex: 0})}
      let toggleArchive = () => { store.changeEmail({toggleRead: false, toggleArchive: true, save: true, closeModal: true, changeIndex: 0})}
      let goNewer = () => { store.changeEmail({toggleRead: false, toggleArchive: false, save: false, closeModal: false, changeIndex: -1})}
      let goOlder = () => { store.changeEmail({toggleRead: false, toggleArchive: false, save: false, closeModal: false, changeIndex: 1})}
      let goNewerAndArchive = () => { store.changeEmail({toggleRead: false, toggleArchive: true, save: true, closeModal: false, changeIndex: -1})}
      let goOlderAndArchive = () => { store.changeEmail({toggleRead: false, toggleArchive: true, save: true, closeModal: false, changeIndex: 1})}
      useKeydown([
        {key: 'r', fn: toggleRead},
        {key: 'e', fn: toggleArchive},
        {key: 'k', fn: goNewer},
        {key: 'j', fn: goOlder},
        {key: '[', fn: goNewerAndArchive},
        {key: ']', fn: goOlderAndArchive}
      ])
    
</script>

<style scoped>
</style>