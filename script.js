const transactionUL = document.getElementById("transactions");
const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("money-plus");
const expenseDisplay = document.getElementById("money-minus");
const form = document.getElementById("form");
const imputTransactionName = document.getElementById("text");
const imputTransactionAmout = document.getElementById("amount");

// BUSCANDO INFORMAÇÕES DO LOCAL STORAGE
const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'));

// ARMAZENANDO OS VALORES DO LOCALSTORAGE
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : [];

// FUNÇÃO PARA REMOVER O ID
const removeTransaction = ID => {
    // const index = transactions.findIndex(transaction => transaction.id === ID);
    // transactions.splice(index, 1);

    transactions = transactions.filter(transaction => transaction.id !== ID);
    init();
    updateLocalStorage();
}

// FUNÇÃO QUE CRIA E ADICIONA A LISTA DE TRANSAÇÂO
const addTransactionIntoDom = ({ amount, name, id }) => {

    const li = document.createElement('li');
    const operator = amount < 0 ? '-' : '+';
    const CSSClass = amount < 0 ? 'minus' : 'plus';
    const amoutWithoutOperator = Math.abs(amount);

    li.classList.add(CSSClass);

    li.innerHTML = `
        ${name} <span>${operator} R$ ${amoutWithoutOperator}
        </span>
        <button class="delete-btn" onClick="removeTransaction(${id})"> x</button>
    `;
    transactionUL.append(li);
}

// FUNÇÃO PARA TOTAL
const getTotal = (transactionAmounts) => transactionAmounts
    .reduce((accumulator, transction) => accumulator + transction, 0)
    .toFixed(2);

// FUNÇÃO PARA RECEITAS
const getIncome = (transactionAmounts) => transactionAmounts
    .filter(value => value > 0)
    .reduce((accumulator, transction) => accumulator + transction, 0)
    .toFixed(2);

// FUNÇÃO PARA DISPESAS
const getSpenses = (transactionAmounts) => Math.abs(transactionAmounts
    .filter(value => value < 0)
    .reduce((accumulator, transction) => accumulator + transction, 0))
    .toFixed(2);

// FUNÇÃO PARA MOSTRAR E ATUALIZAR O DISPLAY
const updateBalanceValue = () => {
    const transactionAmounts = transactions.map(({ amount }) => amount);

    //TOTAL
    const total = getTotal(transactionAmounts);

    //RECEITAS
    const income = getIncome(transactionAmounts);

    //DESPESAS
    const expense = getSpenses(transactionAmounts);

    // ADICIONANDO NO DISPLAY
    balanceDisplay.innerText = `R$ ${total}`;
    incomeDisplay.innerText = `R$ ${income}`;
    expenseDisplay.innerText = `R$ ${expense}`;
}

// ADICIONANDO AS TRANSAÇÕES NO DOM
const init = () => {
    transactionUL.innerHTML = '';
    transactions.forEach(addTransactionIntoDom);
    updateBalanceValue();
}

init();

// ATUALIZANDO O LOCALSTORAGE
const updateLocalStorage = () => {
    localStorage
        .setItem('transactions', JSON.stringify(transactions));
}

// GERANDO ID
const generateId = () => Math.round(Math.random() * 1000);


// ADIONANDO TRANSAÇÕES NO ARRAY DE TRANSAÇÕES
const addTransactionsArray = (transactionName, transactionAmout) => {
    const transaction = {
        id: generateId(),
        name: transactionName,
        amount: Number(transactionAmout)
    }

    transactions.push(transaction);
}

// FUNÇÃO PARA LIMPAR OS INPUTS
const cleamInputs = () => {
    imputTransactionAmout.value = '';
    imputTransactionName.value = '';
}

// FUNÇÃO DO BUTTOM SUBMIT
const handleFormSubmit = (e) => {
    e.preventDefault();

    const transactionName = imputTransactionName.value.trim();
    const transactionAmout = imputTransactionAmout.value.trim();
    const isSomeInputEmpty = transactionName === '' || transactionAmout === '';

    if (isSomeInputEmpty) {
        alert('Por favor, Preencha tanto o nome quanto o valor da transação');
        return;
    }
    // CHAMANDO A FUNÇÃO  PARA ADICIONAR
    addTransactionsArray(transactionName, transactionAmout);

    updateLocalStorage();
    init();
    cleamInputs();
}

// EVENTO DO FORM
form.addEventListener("submit", handleFormSubmit);
