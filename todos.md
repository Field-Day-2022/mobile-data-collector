# Todos

- [x] Create components for data entry wrappers and other commonly used forms such as the number input, dropdown, buttons for yes/no, etc.
- [x] Create a utils file for commonly used functions such as 
- [x] Arthropod Form
  - [x] hard code the fields
  - [ ] dynamic
- [x] Amphibian Form
  - [x] hard coded
  - [ ] dynamic
- [ ] Lizard Form
  - [ ] hard coded
  - [ ] dynamic

- [ ] Mammal Form
- [ ] Snake Form
- [ ] Implement todo in `NewDataEntry` (send data to firestore)
- [x] Implement feature to keep current session in local storage and update it in local storage after each form is done so that the user can come back to it after closing and relaunching the app while offline (don't upload to firestore because this isn't a complete upload yet)
  - [x] this is accomplished with jotai's atomWithStorage

- [ ] Implement Home component and populate it with user stats and collection summaries, etc.
- [ ] Implement hamburger icon in top left for navigating to home, starting a new session (`NewData`), viewing current sessions that have and haven't been finalized yet (still need to implement, make sure to keep finished sessions for that day document id in local storage if the user needs to add to it), and the about us page
- [ ] Implement a page for viewing all sessions (completed and in-progress) for that device for that day, this will utilize the local storage to be persistent on application restarts, and for completed sessions, only the document id will be stored, as the user will only be allowed to add new data to it
- [ ] add a check so that if the user tries to navigate to `NewData` while there is still session data that hasn't been uploaded to firestore, tell the user that they have to complete that session first and redirect them to `NewDataEntry`
- [ ] Implement a notification banner that drops down and tells the user various information, such as syncing data with firestore, adding data, if the user still has data they need to sync, etc…
- [x] Remove `backdrop-blur` because it is too resource intensive
- [ ] Replace `glass` with the `gradient-radial` like with the backdrop
- [ ] Add a screen to confirm each entry
- [ ] (After all core functionality is implemented) Add styling and animations with framer motion

