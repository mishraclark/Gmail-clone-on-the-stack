import { Email } from './emailStore';
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
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
};

export const emailStore = defineStore('main', {
    state: () => ({
        emails: []
       } as RootState),
      actions: {
        async callEmails() {
            this.emails = (await axios.get('http://localhost:3000/emails')).data
          }
        }
})
