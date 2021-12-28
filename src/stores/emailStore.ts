import { defineStore } from 'pinia'
import axios from 'axios'

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export interface Email {
    id: number;
    from: string;
    subject: string;
    body: string;
    sentAt: Date;
    archived: boolean;
    read: boolean;
}
export type RootState = {
  emails: Email[];
  selectedScreen: string;
};

export const emailStore = defineStore('main', {
    state: () => ({
        emails: [],
        selectedScreen: 'inbox'
       } as RootState),

      getters: {
        sortedEmails(): Email[] {
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

      actions: {
        async callEmails() {
            this.emails = (await axios.get('http://localhost:3000/emails')).data
          },
          
      }
})
