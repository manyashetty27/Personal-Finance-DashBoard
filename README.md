# Personal Finance Dashboard with API Integration

A full-stack web application for managing personal finances by tracking income, expenses, savings goals, and transaction history. The application provides REST API integration, persistent SQLite database storage, and interactive financial charts using Chart.js.

---

## Project Overview

The Personal Finance Dashboard is designed to provide users with a simple and interactive way to monitor their financial activities.

Users can:

- Add income transactions
- Add expense transactions
- Delete transactions
- View transaction history
- Track total income
- Track total expenses
- Calculate current savings
- Create savings goals
- Monitor savings progress
- Analyze expenses by category
- Compare income and expenses
- View monthly expense trends

The application uses a light blue and dark green theme with a responsive interface for desktop, tablet, and mobile devices.

---

## Features

### Financial Dashboard

The dashboard provides an overview of:

- Total Income
- Total Expenses
- Current Savings
- Total Transactions

The values are automatically updated whenever transactions are added or deleted.

### Income Management

Users can add income transactions by entering:

- Transaction type
- Category
- Amount
- Date
- Description

### Expense Management

Users can add expense transactions with:

- Transaction type
- Category
- Amount
- Date
- Description

The application provides a separate **Add Expense** operation for recording expenses.

### Transaction History

All recorded transactions are displayed in a table containing:

- Type
- Category
- Amount
- Date
- Description
- Delete action

### Savings Goals

Users can create savings goals by specifying:

- Goal name
- Target amount
- Current savings
- Deadline

The system calculates the percentage of the goal completed and displays the progress using a visual progress bar.

### Financial Charts

Chart.js is used to visualize financial information through:

1. Expenses by Category
2. Income vs Expenses
3. Monthly Expense Trend

### REST API

The frontend communicates with the backend through REST API endpoints for transaction and savings goal management.

### Persistent Database

SQLite is used to store financial information so that transactions remain available after restarting the application.

### Responsive Design

The interface is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

---

## Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- SQLite

### Data Visualization

- Chart.js

### Package Manager

- npm

---

## Project Structure

```text
personal-finance-dashboard/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── database/
│   └── finance.db
│
├── server.js
├── package.json
├── package-lock.json
└── README.md