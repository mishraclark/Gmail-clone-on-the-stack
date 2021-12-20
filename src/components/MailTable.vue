<template>
<div class="float-right align-middle m-5">
<button class="text-base p-2 rounded mx-1 my-2 bg-slate-200 hover:bg-yellow-300" 
          @click="selectScreen('inbox')"
          :disabled="selectedScreen == 'inbox'">Inbox</button>
  <button class="text-base p-2 rounded mx-1 my-2 bg-slate-200 hover:bg-yellow-300"
          @click="selectScreen(archive)"
          :disabled="selectedScreen == 'archive'">Archived</button>
</div>
  <table class="max-w-full m-auto border-collapse">
    <tbody>
      <tr v-for="email in unarchivedEmails"
          :key="email.id"
          :class="['cursor-pointer', email.read ? 'bg-gray-300' : 'bg-white']"
          @click="openEmail(email)"
          >
        <td class="border-b border-t p-1 text-left">
          <input class="hover:border-2 w-6 h-6 border align-middle px-10 relative rounded-sm bg-white cursor-pointer" type="checkbox" />
        </td>
        <td class="border-b p-1 text-left">{{email.from}}</td>
        <td class="border-b p-1 text-left">
          <p class="overflow-hidden max-h-5 px-5"><strong>{{email.subject}}</strong> - {{email.body}}</p>
        </td>
        <td class="border-b p-1 text-left w-32">{{format(new Date(email.sentAt), 'MMM do yyyy')}}</td>
        <td class="border-b p-1 text-left" ><button class="text-base p-2 rounded mx-1 my-2 bg-slate-200 hover:bg-yellow-300" @click="email.archived = true">Archive</button></td>
      </tr>
    </tbody>
  </table>
  <MailView v-if="openedEmail" :email="openedEmail" />
</template>

<script>
  import { format } from 'date-fns';
  import axios from 'axios';
  import { ref } from 'vue';
  import MailView from './MailView.vue';

  export default {
    async setup(){
      let {data: emails} = await axios.get('http://localhost:3000/emails')
      return {
        format,
        emails: ref(emails),
        openedEmail: ref(null)
      }
    },
     components: {
      MailView
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
        email.read = true
        this.updateEmail(email)
        this.openedEmail = email
      },
      readEmail(email) {
        email.read = true
        this.updateEmail(email)
      },
      archiveEmail(email) {
        email.archived = true
        this.updateEmail(email)
      },
      updateEmail(email) {
        axios.put(`http://localhost:3000/emails/${email.id}`, email)
      }
    }
  }
</script>

<style>

</style>