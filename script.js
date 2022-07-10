"use strict";

const account1 = {
  owner: "Roey Mash",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2022-06-25T17:01:17.194Z",
    "2022-06-28T23:36:17.929Z",
    "2022-06-30T10:51:36.790Z",
  ],
  currency: "EUR",
};

const account2 = {
  owner: "Doron David",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2022-06-28T18:49:59.371Z",
    "2022-06-30T12:01:20.894Z",
  ],
  currency: "USD",
};

const account3 = {
  owner: "Tamar meshiha",
  movements: [430, 1000, 700, 50, 90, 2000],
  interestRate: 1,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2022-06-28T18:49:59.371Z",
    "2022-06-30T12:01:20.894Z",
  ],
  pin: 3333,
  currency: "ILS",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2022-06-28T18:49:59.371Z",
    "2022-06-30T12:01:20.894Z",
  ],
  pin: 4444,
  currency: "ILS",
};

const accounts = [account1, account2, account3, account4];
console.log(accounts);

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const formatMovmentDate = function (date) {
  const locale = navigator.language;
  const calcDayPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDayPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return Intl.NumberFormat(locale, {
    style: "currency",
    currency: currentAccount.currency,
  }).format(value);
};

const displayMovments = function (account, sort = false) {
  containerMovements.innerText = "";
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(account.movementsDates[i]);
    const displayDate = formatMovmentDate(date);

    const formattedMov = formatCur(mov, account.currncy);
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div> 
    <div class="movements__value">${formattedMov}</div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
    console.log(date);
    console.log(formattedMov);
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.innerText = formatCur(
    account.balance,
    account.locale,
    account.currncy
  );
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.innerText = formatCur(incomes, account.locale, account.currncy);

  const out = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.innerText = formatCur(
    Math.abs(out),
    account.locale,
    account.currncy
  );

  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.innerText = formatCur(
    interest,
    account.locale,
    account.currncy
  );
};

const creatUserName = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
creatUserName(accounts);

const updateUI = function (account) {
  displayMovments(account);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.innerText = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.innerText = "Log in to get started";
      containerApp.style.opacity = 0;
    }
    time--;
  };

  let time = 600;

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

let currentAccount, timer;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value)
    labelWelcome.innerText = `welcome back ${
      currentAccount.owner.split(" ")[0]
    }`;
  containerApp.style.opacity = 100;

  const now = new Date();
  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  };
  const locale = navigator.language;
  console.log(locale);
  labelDate.innerText = new Intl.DateTimeFormat(locale, options).format(now);

  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginPin.blur();

  if (timer) clearInterval(timer);
  timer = startLogOutTimer();
  updateUI(currentAccount);
  console.log(currentAccount);
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((movement) => movement >= amount * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date());

      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = "";
  clearInterval(timer);
  timer = startLogOutTimer();
});
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const reciverAccount = accounts.find(
    (acount) => acount.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    reciverAccount &&
    currentAccount.balance >= amount &&
    reciverAccount.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    reciverAccount.movements.push(amount);

    currentAccount.movementsDates.push(new Date());
    reciverAccount.movementsDates.push(new Date());
    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputTransferAmount.value = inputTransferTo.value = "";
  }
});

//let sorted = false;
// btnSort.addEventListener("click", function (e) {
//   e.preventDefault();
//   displayMovments(currentAccount.movements, !sorted);
//   sorted = !sorted;
// });
