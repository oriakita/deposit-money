const MILISECOND_IN_ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
var customers = [];
var currentDatetime = new Date();

function deposit() {
    var createdDate = new Date(currentDatetime);
    var createdDate2 = new Date(createdDate);
    var newCustomer = {};
    newCustomer['id'] = Date.now();
    newCustomer['name'] = document.getElementById('cname').value;
    newCustomer['deposit'] = document.getElementById('deposit-amount').value;
    newCustomer['balance'] = document.getElementById('deposit-amount').value;
    newCustomer['createdDate'] = createdDate;
    newCustomer['canWithdrawDate'] = createdDate2.addDays(7);

    customers.push(newCustomer);

    var tBodyRef = document.getElementById("customer-table").getElementsByTagName('tbody')[0];
    var row = tBodyRef.insertRow(-1);
    applyCustomerDataToRow(row, newCustomer);
}

function withdraw(id) {
    const customer = customers.find(c => c.id == id);
 
    if (customer) {
        var weekDiff = Math.ceil(Math.abs((currentDatetime - customer.canWithdrawDate) / MILISECOND_IN_ONE_WEEK));
        var withdrawAmount = Math.floor((customer.deposit * 3 * weekDiff) / 100);
        
        let text = `Bạn sẽ được rút số tiền: ${new Intl.NumberFormat('vi-VN').format(withdrawAmount)} (${3 * weekDiff}% deposit)`;
        if (confirm(text) == true) {
            customer.balance = customer.balance - withdrawAmount;
            customer.canWithdrawDate.addDays(weekDiff * 7);
            drawTable();
        }
    }
}

function drawTable() {
    var table = document.getElementById('customer-table');
    table.getElementsByTagName('tbody')[0].remove();
    var tableBody = document.createElement('tbody');

    customers.forEach(function(customer) {
        var row = document.createElement('tr');
        applyCustomerDataToRow(row, customer);
        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
}

function applyCustomerDataToRow(row, customer) {
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    cell1.innerHTML = customer['id'];
    cell2.innerHTML = customer['name'];
    cell3.innerHTML = new Intl.NumberFormat('vi-VN').format(customer['deposit']);
    cell4.innerHTML = new Intl.NumberFormat('vi-VN').format(customer['balance']);
    cell5.innerHTML = customer['createdDate'].toLocaleString();
    cell6.innerHTML = customer['canWithdrawDate'] < currentDatetime
        ? '<span class="text-success">' + customer['canWithdrawDate'].toLocaleString() + '</span>'
        : '<span class="text-danger">' + customer['canWithdrawDate'].toLocaleString() + '</span>';
    cell7.innerHTML = customer['canWithdrawDate'] < currentDatetime 
        ? `<button onclick="withdraw(${customer['id']})">Withdraw</button>`
        : '<button disabled>Withdraw</button>';
}

function renderCurrentDateTime() {
    currentDatetime.addSeconds(1);
    document.getElementById('current-time-display').innerHTML = currentDatetime.toLocaleString();
}

function updateCurrentDateTime() {
    var value = parseInt(document.getElementById('input-time').value);
    var format = document.getElementById('select-format-time').value;
    if (value > 0) {
        switch(format) {
            case "hour":
                currentDatetime.addHours(value);
                break;
            case "day":
                currentDatetime.addDays(value);
                break;
            case "week":
                currentDatetime.addDays(value * 7);
                break;
            case "month":
                currentDatetime.addMonths(value);
                break;
        }
    }

    drawTable();
}

Date.prototype.addSeconds = function(s) {
    this.setTime(this.getTime() + (s*1000));
    return this;
}

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + days);
    return this;
}

Date.prototype.addMonths = function(months) {
    this.setMonth(this.getMonth() + months);
    return this;
}

document.addEventListener("DOMContentLoaded", () => {
    setInterval(renderCurrentDateTime, 1000);

    document.getElementById('btn-submit-deposit').addEventListener("click", deposit)

    document.getElementById('btn-set-future').addEventListener("click", function () {
        document.getElementById('modal-set-future').style.display="flex";
    })
    
    document.getElementById('btn-cancel-future').addEventListener("click", function () {
        document.getElementById('modal-set-future').style.display="none";
    })
    
    document.getElementById('btn-submit-future').addEventListener("click", function () {
        document.getElementById('modal-set-future').style.display="none";
        updateCurrentDateTime();
    })
});