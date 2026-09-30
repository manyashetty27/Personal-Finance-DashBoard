// ==========================================
// GLOBAL VARIABLES
// ==========================================

let transactions = [];
let goals = [];

let categoryChart = null;
let incomeExpenseChart = null;
let monthlyChart = null;


// ==========================================
// DOM ELEMENTS
// ==========================================

const transactionForm =
    document.getElementById("transactionForm");

const goalForm =
    document.getElementById("goalForm");

const typeSelect =
    document.getElementById("type");

const transactionButton =
    document.getElementById("transactionButton");


// ==========================================
// SET TODAY'S DATE
// ==========================================

document.getElementById("date").value =
    new Date().toISOString().split("T")[0];


// ==========================================
// CHANGE BUTTON BASED ON TYPE
// ==========================================

typeSelect.addEventListener("change", function () {

    if (this.value === "income") {

        transactionButton.textContent =
            "Add Income";

    }

    else if (this.value === "expense") {

        transactionButton.textContent =
            "Add Expense";

    }

    else {

        transactionButton.textContent =
            "Add Transaction";

    }

});


// ==========================================
// LOAD TRANSACTIONS
// ==========================================

async function loadTransactions() {

    try {

        const response =
            await fetch("/api/transactions");


        if (!response.ok) {

            throw new Error(
                "Unable to load transactions"
            );

        }


        transactions =
            await response.json();


        updateDashboard();

        displayTransactions();

        updateCharts();


    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to load transactions"
        );

    }

}


// ==========================================
// ADD TRANSACTION
// ==========================================

transactionForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const type =
            document.getElementById("type").value;

        const category =
            document.getElementById("category").value;

        const amount =
            Number(
                document.getElementById("amount").value
            );

        const description =
            document.getElementById("description").value;

        const date =
            document.getElementById("date").value;


        // VALIDATION

        if (!type) {

            alert("Please select transaction type.");

            return;

        }


        if (!category) {

            alert("Please select a category.");

            return;

        }


        if (!amount || amount <= 0) {

            alert(
                "Please enter an amount greater than zero."
            );

            return;

        }


        if (!date) {

            alert("Please select a date.");

            return;

        }


        const transaction = {

            type: type,

            category: category,

            amount: amount,

            description: description,

            date: date

        };


        try {

            const response =
                await fetch(
                    "/api/transactions",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                transaction
                            )

                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                alert(
                    result.error ||
                    "Unable to add transaction"
                );

                return;

            }


            alert(result.message);


            // CLEAR FORM

            transactionForm.reset();


            document.getElementById("date").value =
                new Date()
                    .toISOString()
                    .split("T")[0];


            transactionButton.textContent =
                "Add Transaction";


            // RELOAD DATA

            await loadTransactions();


        }

        catch (error) {

            console.error(error);

            alert(
                "Server error. Please try again."
            );

        }

    }
);


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    let totalIncome = 0;

    let totalExpenses = 0;


    transactions.forEach(transaction => {

        const amount =
            Number(transaction.amount);


        if (transaction.type === "income") {

            totalIncome += amount;

        }


        if (transaction.type === "expense") {

            totalExpenses += amount;

        }

    });


    const savings =
        totalIncome - totalExpenses;


    document.getElementById(
        "totalIncome"
    ).textContent =
        formatCurrency(totalIncome);


    document.getElementById(
        "totalExpenses"
    ).textContent =
        formatCurrency(totalExpenses);


    document.getElementById(
        "currentSavings"
    ).textContent =
        formatCurrency(savings);


    document.getElementById(
        "transactionCount"
    ).textContent =
        transactions.length;

}


// ==========================================
// DISPLAY TRANSACTIONS
// ==========================================

function displayTransactions() {

    const table =
        document.getElementById(
            "transactionTable"
        );


    table.innerHTML = "";


    if (transactions.length === 0) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    style="text-align:center;"
                >
                    No transactions yet.
                </td>
            </tr>
        `;

        return;

    }


    transactions.forEach(transaction => {

        const row =
            document.createElement("tr");


        const isIncome =
            transaction.type === "income";


        const amountClass =
            isIncome
                ? "income-text"
                : "expense-text";


        const sign =
            isIncome
                ? "+"
                : "-";


        row.innerHTML = `

            <td>
                ${transaction.date}
            </td>

            <td>
                ${capitalize(transaction.type)}
            </td>

            <td>
                ${transaction.category}
            </td>

            <td>
                ${transaction.description || "-"}
            </td>

            <td class="${amountClass}">
                ${sign}${formatCurrency(
                    transaction.amount
                )}
            </td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(
                        ${transaction.id}
                    )"
                >
                    Delete
                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


// ==========================================
// DELETE TRANSACTION
// ==========================================

async function deleteTransaction(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/transactions/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.error ||
                "Unable to delete transaction"
            );

            return;

        }


        alert(result.message);


        await loadTransactions();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to delete transaction"
        );

    }

}


// ==========================================
// LOAD SAVINGS GOALS
// ==========================================

async function loadGoals() {

    try {

        const response =
            await fetch("/api/goals");


        goals =
            await response.json();


        displayGoals();

    }

    catch (error) {

        console.error(error);

    }

}


// ==========================================
// CREATE SAVINGS GOAL
// ==========================================

goalForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "goalName"
            ).value.trim();


        const targetAmount =
            Number(
                document.getElementById(
                    "targetAmount"
                ).value
            );


        const currentAmount =
            Number(
                document.getElementById(
                    "currentAmount"
                ).value
            ) || 0;


        const deadline =
            document.getElementById(
                "deadline"
            ).value;


        if (!name) {

            alert(
                "Please enter a goal name."
            );

            return;

        }


        if (targetAmount <= 0) {

            alert(
                "Target amount must be greater than zero."
            );

            return;

        }


        if (currentAmount < 0) {

            alert(
                "Current amount cannot be negative."
            );

            return;

        }


        const goal = {

            name: name,

            target_amount:
                targetAmount,

            current_amount:
                currentAmount,

            deadline: deadline

        };


        try {

            const response =
                await fetch(
                    "/api/goals",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(goal)

                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                alert(
                    result.error ||
                    "Unable to create goal"
                );

                return;

            }


            alert(result.message);


            goalForm.reset();


            await loadGoals();

        }

        catch (error) {

            console.error(error);

            alert(
                "Unable to create savings goal"
            );

        }

    }
);


// ==========================================
// DISPLAY GOALS
// ==========================================

function displayGoals() {

    const container =
        document.getElementById(
            "goalsContainer"
        );


    container.innerHTML = "";


    if (goals.length === 0) {

        container.innerHTML = `
            <p style="margin-top:20px;color:#64748b;">
                No savings goals created yet.
            </p>
        `;

        return;

    }


    goals.forEach(goal => {

        let percentage =
            (
                Number(goal.current_amount) /
                Number(goal.target_amount)
            ) * 100;


        percentage =
            Math.min(
                Math.max(percentage, 0),
                100
            );


        const card =
            document.createElement("div");


        card.className =
            "goal-card";


        card.innerHTML = `

            <h3>
                ${goal.name}
            </h3>

            <p>
                ${formatCurrency(
                    goal.current_amount
                )}

                /

                ${formatCurrency(
                    goal.target_amount
                )}
            </p>


            <div class="progress-container">

                <div
                    class="progress-bar"
                    style="
                        width:${percentage}%;
                    "
                ></div>

            </div>


            <p>
                ${percentage.toFixed(1)}%
                completed
            </p>


            <p>
                Deadline:
                ${goal.deadline || "Not specified"}
            </p>


            <button
                class="delete-btn"
                onclick="deleteGoal(
                    ${goal.id}
                )"
            >
                Delete Goal
            </button>

        `;


        container.appendChild(card);

    });

}


// ==========================================
// DELETE GOAL
// ==========================================

async function deleteGoal(id) {

    if (
        !confirm(
            "Delete this savings goal?"
        )
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/goals/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.error ||
                "Unable to delete goal"
            );

            return;

        }


        await loadGoals();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to delete goal"
        );

    }

}


// ==========================================
// CHARTS
// ==========================================

function updateCharts() {

    createCategoryChart();

    createIncomeExpenseChart();

    createMonthlyChart();

}


// ==========================================
// EXPENSE CATEGORY CHART
// ==========================================

function createCategoryChart() {

    const categoryTotals = {};


    transactions

        .filter(
            transaction =>
                transaction.type === "expense"
        )

        .forEach(transaction => {

            const category =
                transaction.category;


            if (!categoryTotals[category]) {

                categoryTotals[category] = 0;

            }


            categoryTotals[category] +=
                Number(transaction.amount);

        });


    const labels =
        Object.keys(categoryTotals);


    const data =
        Object.values(categoryTotals);


    if (categoryChart) {

        categoryChart.destroy();

    }


    categoryChart =
        new Chart(
            document.getElementById(
                "categoryChart"
            ),
            {

                type: "doughnut",

                data: {

                    labels: labels,

                    datasets: [{

                        label:
                            "Expenses",

                        data: data

                    }]

                },

                options: {

                    responsive: true,

                    plugins: {

                        legend: {

                            position:
                                "bottom"

                        }

                    }

                }

            }
        );

}


// ==========================================
// INCOME VS EXPENSE CHART
// ==========================================

function createIncomeExpenseChart() {

    let income = 0;

    let expenses = 0;


    transactions.forEach(transaction => {

        if (
            transaction.type === "income"
        ) {

            income +=
                Number(transaction.amount);

        }


        if (
            transaction.type === "expense"
        ) {

            expenses +=
                Number(transaction.amount);

        }

    });


    if (incomeExpenseChart) {

        incomeExpenseChart.destroy();

    }


    incomeExpenseChart =
        new Chart(
            document.getElementById(
                "incomeExpenseChart"
            ),
            {

                type: "bar",

                data: {

                    labels: [
                        "Income",
                        "Expenses"
                    ],

                    datasets: [{

                        label:
                            "Amount",

                        data: [
                            income,
                            expenses
                        ]

                    }]

                },

                options: {

                    responsive: true,

                    scales: {

                        y: {

                            beginAtZero:
                                true

                        }

                    }

                }

            }
        );

}


// ==========================================
// MONTHLY EXPENSE CHART
// ==========================================

function createMonthlyChart() {

    const monthlyExpenses = {};


    transactions

        .filter(
            transaction =>
                transaction.type === "expense"
        )

        .forEach(transaction => {

            const month =
                transaction.date.substring(
                    0,
                    7
                );


            if (!monthlyExpenses[month]) {

                monthlyExpenses[month] = 0;

            }


            monthlyExpenses[month] +=
                Number(transaction.amount);

        });


    const labels =
        Object.keys(monthlyExpenses)
            .sort();


    const data =
        labels.map(
            month =>
                monthlyExpenses[month]
        );


    if (monthlyChart) {

        monthlyChart.destroy();

    }


    monthlyChart =
        new Chart(
            document.getElementById(
                "monthlyChart"
            ),
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [{

                        label:
                            "Monthly Expenses",

                        data: data,

                        tension: 0.3,

                        fill: false

                    }]

                },

                options: {

                    responsive: true,

                    scales: {

                        y: {

                            beginAtZero:
                                true

                        }

                    }

                }

            }
        );

}


// ==========================================
// HELPER FUNCTIONS
// ==========================================

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {

            style: "currency",

            currency: "INR",

            maximumFractionDigits: 2

        }
    ).format(
        Number(amount) || 0
    );

}


function capitalize(text) {

    if (!text) {

        return "";

    }


    return text
        .charAt(0)
        .toUpperCase() +
        text.slice(1);

}


// ==========================================
// INITIALIZE APPLICATION
// ==========================================

loadTransactions();

loadGoals();