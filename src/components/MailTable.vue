<template>
<div class="float-right align-middle m-5">
<button class="btn" 
          @click="selectScreen('inbox')"
          :disabled="selectedScreen == 'inbox'">Inbox</button>
  <button class="btn"
          @click="selectScreen(archive)"
          :disabled="selectedScreen == 'archive'">Archived</button>
</div>
<BulkActionBar :emails="filteredEmails" />
  <table class="max-w-full m-auto border-collapse">
    <tbody>
      <tr v-for="email in filteredEmails"
          :key="email.id"
          :class="['cursor-pointer', email.read ? 'bg-gray-300' : 'bg-white']"
          >
        <td class="border-b border-t p-1 text-left">
          <input class="checkbox" type="checkbox"  @click="emailSelection.toggle(email)"
                 :checked="emailSelection.emails.has(email)" />
        </td>
        <td class="border-b p-1 text-left" @click="openEmail(email)">{{email.from}}</td>
        <td class="border-b p-1 text-left" @click="openEmail(email)">
          <p class="overflow-hidden max-h-5 px-5"><strong>{{email.subject}}</strong> - {{email.body}}</p>
        </td>
        <td class="border-b p-1 text-left w-32" @click="openEmail(email)">{{format(new Date(email.sentAt), 'MMM do yyyy')}}</td>
        <td class="border-b p-1 text-left" ><button class="btn" @click="email.archived = true">Archive</button></td>
      </tr>
    </tbody>
  </table>
   <ModalView v-if="openedEmail" @closeModal="openedEmail = null">
    <MailView :email="openedEmail" @changeEmail="changeEmail" />
  </ModalView>
</template>

<script>
  import { format } from 'date-fns';
  import axios from 'axios';
  import MailView from './MailView.vue';
  import ModalView from './ModalView.vue';
  import BulkActionBar from './BulkActionBar.vue';
  import { reactive, ref } from 'vue';
  import useEmailSelection from '../composables/use-email-selection';
  import { emailStore } from '../stores/emailStore';
  import { storeToRefs } from 'pinia';
  export default {
    setup(){
      const store = emailStore()
      const {emails} = storeToRefs(store)
      store.callEmails();
      return {
        emailSelection: useEmailSelection(),
        format,
        emails: ref(emails),
        openedEmail: ref(null),
        selectedScreen: ref('inbox')
      }
    },
    components: {
      MailView,
      ModalView,
      BulkActionBar,
    },
    computed: {
      sortedEmails() {
        return this.emails.sort((e1, e2) => {
          return e1.sentAt < e2.sentAt ? 1 : -1
        })
      },
      filteredEmails() {
        if(this.selectedScreen == 'inbox') {
          return this.sortedEmails.filter(e => !e.archived)
        } else {
          return this.sortedEmails.filter(e => e.archived)
        }
      }
    },
    methods: {
      selectScreen(newScreen) {
        this.selectedScreen = newScreen
        this.emailSelection.clear()
      },
      openEmail(email) {
        this.openedEmail = email
        if(email) {
          email.read = true
          this.updateEmail(email)
        }
      },
      archiveEmail(email) {
        email.archived = true
        this.updateEmail(email)
      },
      changeEmail({toggleRead, toggleArchive, save, closeModal, changeIndex}) {
        let email = this.openedEmail
        if(toggleRead) { email.read = !email.read }
        if(toggleArchive) { email.archived = !email.archived }
        if(save) { this.updateEmail(email) }
        if(closeModal) { this.openedEmail = null }
        if(changeIndex) {
          let emails = this.filteredEmails
          let currentIndex = emails.indexOf(this.openedEmail)
          let newEmail = emails[currentIndex + changeIndex]
          this.openEmail(newEmail)
        }
      },
      updateEmail(email) {
        axios.put(`http://localhost:3000/emails/${email.id}`, email)
      }
    }
  }
</script>

<style scoped>
</style>