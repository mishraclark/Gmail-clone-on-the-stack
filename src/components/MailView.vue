<template>
  <div class="text-left">
    <div>
      <button class="btn" @click="toggleArchive">{{email.archived ? 'Move to Inbox (e)' : 'Archive (e)'}}</button>
      <button class="btn" @click="toggleRead">{{email.read ? 'Mark Unread (r)' : 'Mark Read (r)'}}</button>
      <button class="btn" @click="goNewer">Newer (k)</button>
      <button class="btn" @click="goOlder">Older (j)</button>
    </div>
    <h2>Subject: <strong>{{email.subject}}</strong></h2>
    <div><em>From {{email.from}} on {{format(new Date(email.sentAt), 'MMM do yyyy')}}</em></div>
    <div>{{email.body}}</div>
  </div>
</template>

<script>
  import  { format } from 'date-fns'
  import axios from 'axios'
  import useKeydown from '../composables/use-keydown'
  export default {
    setup(props, {emit}){
      let email = props.email;
      let toggleRead = () => {
        email.read = !email.read
        axios.put(`http://localhost:3000/emails/${email.id}`, email)
      }
      let toggleArchive = () => {
        email.archived = !email.archived
        axios.put(`http://localhost:3000/emails/${email.id}`, email)
        // How to close the modal?
      }
      useKeydown([
        {key: 'r', fn: toggleRead},
        {key: 'e', fn: toggleArchive}
      ])
      return {
        format,
        toggleRead,
        toggleArchive
      }
    },
    props: {
      email: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style scoped>
</style>