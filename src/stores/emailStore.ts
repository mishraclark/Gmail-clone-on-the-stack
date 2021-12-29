import { Email } from './emailStore';
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
  openedEmail: Email | null;
  emailSelection: Email[];
};

export const emailStore = defineStore('main', {
    state: () => ({
        emails: [],
        selectedScreen: 'inbox',
        openedEmail: null,
        emailSelection: [],
       } as RootState),

      getters: {
        sortedEmails: (state) => {
          return state.emails.sort((e1, e2) => {
            return e1.sentAt < e2.sentAt ? 1 : -1
          })
        },
        filteredEmails() {
          if(this.selectedScreen == 'inbox') {
            return this.sortedEmails.filter(e => !e.archived)
          } else {
            return this.sortedEmails.filter(e => e.archived)
          }
      },
      numberSelected: (state) => { return state.emailSelection.length },
      numberEmails: (state) => { return state.emails.length},
      allEmailsSelected() {return this.numberSelected === this.numberEmails && this.numberEmails.value > 0},
      someEmailsSelected() {
        return this.numberSelected.value > 0 && this.numberSelected.value < this.numberEmails.value
      },
    },
      actions: {
        async callEmails() {
            this.emails = (await axios.get('http://localhost:3000/emails')).data
          },
          selectScreen(newScreen: string) {
            this.selectedScreen = newScreen
            this.emailSelection = [];
          },
          openEmail(email: Email) {
            this.openedEmail = email
            if(email) {
              email.read = true
              this.updateEmail(email)
            }
          },
          archiveEmail(email: Email) {
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
         
          updateEmail(email: Email) {
            axios.put(`http://localhost:3000/emails/${email.id}`, email)
          },
          toggle(email: Email) {
              if(this.emailSelection.includes(email)) {
                this.emailSelection.filter(e => !email.id )
              } else {
                this.emailSelection.push(email)
              }
            },
            clear() {
              this.emailSelection = [];
            },
            addMultiple(newEmails: Email[]) {
              newEmails.forEach((email) => {
                this.emailSelection.push(email)
              })
            },
            forSelected(fn) {
              this.emailSelection.forEach((email) => {
                fn(email);
                axios.put(`http://localhost:3000/emails/${email.id}`, email)
              })
            },
            markRead() { this.forSelected(e => e.read = true)},
            markUnread() { this.forSelected(e => e.read = false)},
            archive() { this.forSelected(e => e.archived = !e.archived); this.emailSelection = []; },
            bulkSelect() {
              if(this.allEmailsSelected) {
                this.emailSelection = [];
              } else {
                this.addMultiple(this.filteredEmails);
            }
          }
        }
        }
          

)
