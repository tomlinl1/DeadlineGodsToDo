# The Deadline Crusher – Team Project

## Team Members

- **Landen Tomlin** – Team Leader  
- **Josh Day** – Backend Development, Database Design  
- **Tanner Andrews** – Frontend Development, Calendar & Time Tracking  
- **Xander Murphy** – Frontend Development, UI Customization  

---

## Project Description

**The Deadline Crusher** is a productivity-focused web application designed to help students manage assignments, deadlines, and daily responsibilities in a structured and motivating way. The application combines task management, time-based planning, and gamified customization to encourage users to complete tasks earlier and more consistently. By providing smart task views, a calendar-based checklist, and unlockable visual rewards, The Deadline Crusher aims to reduce procrastination and improve time management habits among students.

---

## Problem Domain

Many students struggle with:

- Keeping track of multiple assignments across different courses  
- Understanding which tasks are most urgent at any given time  
- Managing time effectively when deadlines overlap  
- Staying motivated to consistently complete tasks  

Traditional to-do list applications often lack context, prioritization, and engagement. The Deadline Crusher addresses these challenges by organizing tasks intelligently, visualizing deadlines on a calendar, and rewarding task completion with customization options that promote continued user engagement.

---

## Features and Requirements

### 1. Calendar / Time-Based Checklist  
**Feature Owner:** Tanner Andrews  

**Description:**  
Users can view tasks in a calendar interface that displays deadlines and scheduled work over time, helping them plan ahead and manage workload more effectively.

**Requirements:**
- Interactive calendar interface  
- Ability to associate tasks with dates and deadlines  
- Visual indicators for upcoming and overdue tasks  
- Time tracking functionality to monitor time spent on tasks  

---

### 2. Smart Lists and Custom Views  
**Feature Owner:** Josh Day  

**Description:**  
The system automatically organizes tasks into intelligent lists and allows users to create and save custom task views.

**Requirements:**
- Auto-generated lists:
  - Today
  - Upcoming
  - Overdue
- Filtering options by:
  - Tags
  - Priority
  - Due date
- Sorting options (e.g., due date, priority, creation date)
- Search bar for tasks
- Ability to pin or save custom task views  

---

### 3. Gamified Customization & Rewards  
**Feature Owner:** Xander Murphy  

**Description:**  
Users unlock visual customization options as they complete more tasks, reinforcing positive productivity habits.

**Requirements:**
- Unlockable fonts, backgrounds, and UI themes  
- Progress tracking tied to task completion  
- Customization menu for applying unlocked items  
- Persistent storage of unlocked customization options per user  

---

## Non-Functional Requirements

- The application shall follow a **three-tier architecture**  
- The system shall be accessible through modern web browsers  
- The UI shall be responsive and usable on desktop and mobile devices  
- The system shall maintain acceptable performance with increasing data size  
- User data shall persist across sessions  
- The interface shall be intuitive and visually consistent  
- The codebase shall be modular, maintainable, and scalable  

---

## Data Model

The core entities in the system include:

### User
- userId  
- username  
- progress level  
- unlocked customizations  

### Task
- taskId  
- title  
- description  
- due date  
- priority  
- tags  
- completion status  
- time spent  

### Custom View
- viewId  
- filters  
- sort options  
- pinned status  

### Customization Item
- itemId  
- type (font, background, theme)  
- unlock requirement  

### Relationships
- A user can have many tasks  
- A user can save multiple custom views  
- A user can unlock multiple customization items  

---

## Architecture

The Deadline Crusher is built using a **three-tier architecture**, separating concerns between presentation, application logic, and data storage.

### Presentation Layer (Frontend)
- JavaScript with **React**
- Component-based user interface
- Communicates with backend via REST API

### Application Layer (Backend)
- **Node.js** runtime
- **Express.js** framework
- RESTful API endpoints
- Handles business logic, validation, and data processing

### Data Layer (Database)
- **MongoDB** using **Mongoose ODM**
- **SQLite** using object-relational database access
- Persistent storage for users, tasks, views, and customization data

> An architecture diagram will illustrate the interaction between the frontend, REST API, and databases.

---

## APIs & Data Access

- RESTful API design using Express
- JSON-based client–server communication
- Mongoose ODM for MongoDB schema modeling
- SQLite APIs for relational data storage
- Support for both document-based and relational data models

---

## Testing Strategy

### Acceptance Tests
- Users can create, edit, and complete tasks  
- Completed tasks unlock customization rewards  
- Calendar correctly displays tasks by due date  
- Smart lists update automatically when task states change  

---

### Integration Tests
- Frontend correctly communicates with REST API  
- Task updates propagate across calendar and smart lists  
- Filters and sorting work together without conflict  
- Custom views persist across sessions  

---

### End-to-End (E2E) Tests
- User creates tasks, views them in the calendar, completes them, and unlocks customization  
- User creates and saves custom task views  
- User returns to the application and sees saved views and unlocked themes  

---

## Project Documentation

- [Project Plan Presentation (PPP)]()  
- Individual Contributions:  
  - [Josh Day]()
  - [Tanner Andrews]()  
  - [Xander Murphy]() 

---

## Schedule & Milestones

### Sprint 1
- Project setup (React, Node.js, Express)
- Core task CRUD functionality
- Smart lists (Today, Upcoming, Overdue)
- Initial calendar interface
- Database schema design

---

### Sprint 2
- REST API expansion
- Time tracking functionality
- Filters, sorting, and custom views
- Customization unlock system
- UI polish and comprehensive testing  

---

## Technology Stack

### Frontend
- JavaScript
- React

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB with Mongoose ODM
- SQLite with relational APIs

---