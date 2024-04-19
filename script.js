document.addEventListener('DOMContentLoaded', function() {
    const addItemButton = document.getElementById('addItemRow');
    addItemButton.addEventListener('click', addItemRow);
});

function addItemRow() {
    const itemsTable = document.getElementById('items');
    const numPeople = document.querySelectorAll('[id^=person]').length;
    const newRow = document.createElement('tr');
    newRow.classList.add('item-row');
    newRow.innerHTML = `
        <td><input type="text" class="description" placeholder="Item Description"></td>
        <td><input class="amount" type="text" step="0.01" placeholder="Amount ($)"></td>
    `;

    // Append description and amount inputs
    itemsTable.appendChild(newRow);

    // Get the number of checkboxes already present in the table
    const numCheckboxes = document.querySelectorAll('.person-checkbox').length;

    // Append additional checkboxes for each person if needed
    for (let i = numCheckboxes + 1; i <= numPeople; i++) {
        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('person-checkbox');
        checkbox.id = `person${i}-checkbox`;
        checkboxCell.appendChild(checkbox);
        newRow.appendChild(checkboxCell);
    }
}

function calculateSplit() {
    const itemsRows = document.querySelectorAll('.item-row');
    const items = [];

    // Extract person names from input fields
    const personInputs = document.querySelectorAll('[id^=person]');
    const personNames = Array.from(personInputs).map(input => input.value);

    // Iterate over item rows
    itemsRows.forEach(row => {
        const description = row.querySelector('.description').value.trim();
        
        // Get the amount input element
        const amountInput = row.querySelector('.amount').value;
        const amount = parseFloat(amountInput.replace('$', '')) || 0;
        
        const people = [];

        // Get selected people for each item
        row.querySelectorAll('.person-checkbox').forEach(checkbox => {
            if (checkbox.checked) {
                people.push(personNames[parseInt(checkbox.id.match(/\d+/)[0]) - 1]);
            }
        });

        // Add item to list only if people are selected
        if (people.length > 0) {
            items.push({ description, amount, people });
        }
    });

    console.log('Items:', items);

    // Calculate total amount excluding tax and tip
    const totalAmount = items.reduce((total, item) => total + item.amount, 0);
    console.log('Total Amount:', totalAmount);

    // Calculate tax and tip
    const taxAmountInput = document.getElementById('taxAmount').value.trim().replace('$', '');
    const tipAmountInput = document.getElementById('tipAmount').value.trim().replace('$', '');

    let taxAmount;
    let tipAmount;

    if (taxAmountInput.endsWith('%')) {
        // Convert percentage tax to dollar amount
        const taxPercentage = parseFloat(taxAmountInput.slice(0, -1));
        taxAmount = (taxPercentage / 100) * totalAmount;
    } else {
        taxAmount = parseFloat(taxAmountInput) || 0;
    }

    if (tipAmountInput.endsWith('%')) {
        // Convert percentage tip to dollar amount
        const tipPercentage = parseFloat(tipAmountInput.slice(0, -1));
        tipAmount = (tipPercentage / 100) * totalAmount;
    } else {
        tipAmount = parseFloat(tipAmountInput) || 0;
    }

    console.log('Tax Amount:', taxAmount);
    console.log('Tip Amount:', tipAmount);

    // Calculate total amount including tax and tip
    const totalWithTaxAndTip = totalAmount + taxAmount + tipAmount;
    console.log('Total with Tax and Tip:', totalWithTaxAndTip);

    // Calculate amount per person including tax and tip
    const amountsPerPerson = {};

    items.forEach(item => {
        const amountPerPerson = (item.amount + taxAmount + tipAmount) / item.people.length;
        item.people.forEach(person => {
            if (!amountsPerPerson[person]) {
                amountsPerPerson[person] = 0;
            }
            amountsPerPerson[person] += amountPerPerson;
        });
    });

    console.log('Amounts Per Person:', amountsPerPerson);

    // Display results
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<h2>Amount Per Person:</h2>`;
    Object.entries(amountsPerPerson).forEach(([person, amount]) => {
        resultsDiv.innerHTML += `<p>${person}: $${amount.toFixed(2)}</p>`;
    });

    // Calculate total amount for all persons
    const totalAmountForAllPersons = Object.values(amountsPerPerson).reduce((total, amount) => total + amount, 0);
    console.log('Total Amount for All Persons:', totalAmountForAllPersons);

    // Display total amount for all persons
    resultsDiv.innerHTML += `<p>Total Amount for All Persons: $${totalAmountForAllPersons.toFixed(2)}</p>`;
}
