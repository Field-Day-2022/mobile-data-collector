User Manual Layout for Field Day Project

1. Introduction

Overview: The Field Day project is an innovative Wildlife Data Collection and management tool designed to address field researchers' challenges, particularly in biology and ecology. The project includes a Progressive Web App (PWA) for mobile devices and a web application for larger screens, developed by a cross-disciplinary team. The system aims to streamline data collection, improve offline functionality, and enhance authentication security through 2-factor Google authentication.

Features: Offline data collection, Google 2-factor authentication, dynamic data management, cost-effectiveness through Firebase migration.

Purpose of Manual: This manual provides detailed guidance on using the Field Day tools for data collection, management, and export.

2. Getting Started

System Requirements: Requires a modern browser on mobile or desktop devices. Google account required for authentication.

Installation: Install the PWA on mobile by visiting the URL and adding it to the home screen.

Setting Up: Log in using your ASU Google account to access the Field Day features.

3. Field Day PWA Overview

Interface Walkthrough: The app contains pages for Home, Data Collection, and About Us, with consistent styling for ease of use.

Navigation Guide: Users can navigate to different sections like "Collect Data," "New Data," and "History" through the app's main menu.

4. Data Collection Using the Mobile App

Capture Mark-Recapture Techniques: The app allows users to collect population data for various species using capture mark-recapture techniques.

Data Collection Form:

Initials: Enter your initials for identification purposes.

Recorder & Handler: Record who is managing and handling the data collection.

Project & Site: Select the project (e.g., Gateway, San Pedro, Virgin River) and specific site (e.g., Array).

Any Captures?: Indicate if there are any captures and enter the number of critters recorded.

Critter Types: Record counts for different critter types (Arthropod, Amphibian, Lizard, Mammal, Snake).

Session Data Submission: Confirm when you are done collecting data. Note: Once submitted, the session data is sent to the server and closed for further edits.

5. Using the Web App

Managing Data: View, edit, and delete collected data from previous sessions. Use the "History" page to revisit closed sessions.

Exporting Data: Export data in various formats for analysis and further use.

Dynamic Data Management: Optimize performance and reduce costs by managing data through the Firebase backend.

6. Authentication & Security

2-Factor Google Authentication: Users must log in with their ASU Google accounts for enhanced security.

User Permissions: Only authorized users can access data collection and management tools.

7. Technical Aspects

Technologies Used: The PWA is built using React, Vite, and Tailwind CSS, with Firebase and Firestore supporting the backend.

Service Workers and Offline Cache: Service workers enable offline capabilities by caching data locally, allowing for seamless offline use.

8. Troubleshooting & FAQs

Common Issues:

Login Problems: Ensure you are using your ASU Google account.

Data Syncing: Data may not sync if there is no internet connection; try reconnecting and resubmitting.

FAQs:

How do I add more data after closing a session? Go to the "History" page and select the session to add more data.

9. Best Practices

Efficient Data Collection: Always double-check that all fields are filled in before submitting data.

Managing Offline Data: Ensure all data is synced once an internet connection is available to avoid data loss.

10. Contact & Support

Support Channels: Contact support via email or visit the community forum for help.

Feedback: Provide feedback through the app to help improve future versions.

11. Glossary

Terms & Definitions: Definitions for technical terms and key features (e.g., Capture Mark-Recapture, Service Workers).



