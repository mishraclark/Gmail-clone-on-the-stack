<template>
<div class="float-right align-middle m-5">
<button class="btn" 
          @click="selectScreen('inbox')"
          :disabled="selectedScreen == 'inbox'">Inbox</button>
  <button class="btn"
          @click="selectScreen(archive)"
          :disabled="selectedScreen == 'archive'">Archived</button>
</div>
<h1>{{emailSelection.emails.size}} emails selected</h1>
  <table class="max-w-full m-auto border-collapse">
    <tbody>
      <tr v-for="email in unarchivedEmails"
          :key="email.id"
          :class="['cursor-pointer', email.read ? 'bg-gray-300' : 'bg-white']"
          >
        <td class="border-b border-t p-1 text-left">
          <input class="hover:border-2 w-6 h-6 border align-middle px-10 relative rounded-sm bg-white cursor-pointer" type="checkbox"  @click="emailSelection.toggle(email)"
                 :selected="emailSelection.emails.has(email)" />
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
  import { ref, reactive } from 'vue';
  import MailView from './MailView.vue';
  import ModalView from './ModalView.vue';
  import { useEmailSelection } from '../composables/use-email-selection';

   export default {
    async setup(){
      let {data: emails} = await axios.get('http://localhost:3000/emails')
      let selected = reactive(new Set())
      let emailSelection = {
        emails: selected,
        toggle(email) {
          if(selected.has(email)) {
            selected.delete(email)
          } else {
            selected.add(email)
          }
          console.log(selected)
        }
      }
      return {
        emailSelection: useEmailSelection(),
        format,
        emails: ref(emails),
        openedEmail: ref(null)
      }
    },
    components: {
      MailView,
      ModalView
    },
    computed: {
      sortedEmails() {
        return this.emails.sort((e1, e2) => {
          return e1.sentAt < e2.sentAt ? 1 : -1
        })
      },
      unarchivedEmails() {
        return this.sortedEmails.filter(e => !e.archived)
      }
    },
    methods: {
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
          let emails = this.unarchivedEmails
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