# Todos

- [ ] Arthropod Form
- [ ] Amphibian Form
- [ ] Lizard Form
- [ ] Mammal Form
- [ ] Snake Form
- [ ] Implement todo in `NewDataEntry` (send data to firestore)
- [ ] Implement feature to keep current session in local storage and update it in local storage after each form is done so that the user can come back to it after closing and relaunching the app while offline (don't upload to firestore because this isn't a complete upload yet)
- [ ] Implement Home component and populate it with user stats and collection summaries, etc.
- [ ] Implement hamburger icon in top left for navigating to home, starting a new session (`NewData`), viewing current sessions that have and haven't been finalized yet (still need to implement, make sure to keep finished sessions for that day document id in local storage if the user needs to add to it), and the about us page
- [ ] Implement a page for viewing all sessions (completed and in-progress) for that device for that day, this will utilize the local storage to be persistent on application restarts, and for completed sessions, only the document id will be stored, as the user will only be allowed to add new data to it
- [ ] Implement a notification banner that drops down and tells the user various information, such as syncing data with firestore, adding data, if the user still has data they need to sync, etc…

