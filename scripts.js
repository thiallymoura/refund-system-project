// Selecionando elementos do formulario
const form = document.querySelector("form");

const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

//seleciona os elementos da lista
const expenseList = document.querySelector("ul");
const expenseTotal = document.querySelector("aside header h2");
const expenseQuantity = document.querySelector("aside header p span");


// oninput = É disparado toda vez que o conteúdo do campo de entrada muda, enquanto o usuário digita.
amount.oninput = () => {
    // Substitui todos os caracteres não numéricos com uma string vazia.
    let value = amount.value.replace(/\D/g, '');

    // Transforma o valor em centavos. (ex: 150/100 = 1.50) 
    value = Number(value) / 100;

    //Atualiza para receber só numeros 
    amount.value = formatCurrencyBRL(value);
}

// Formata o valor para BRL
function formatCurrencyBRL(value) {
    // Formata o valor para BRL
    value = value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })

    return value;
}

// captura o evento de envio do formulário para obter os valores
form.onsubmit = (event) => {
    event.preventDefault();

    // Cria um objeto com os dados da nova despesa
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date()
    }

    // chama a funcao para adicionar a nova despesa
    expenseAdd(newExpense);

}

// Adiciona um novo item na lista
function expenseAdd(newExpense) {

    try {
        // cria o elemento  de li para adicionar o item (li) na lista (ul)
        const expenseItem = document.createElement("li");
        expenseItem.classList.add("expense");

        // cria o icone da categoria 
        const expenseIcon = document.createElement("img");
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute("alt", newExpense.category_name);

        // cria a info da despes
        const expenseInfo = document.createElement("div");
        expenseInfo.classList.add("expense-info");

        // cria o nome da despesa
        const expenseName = document.createElement("strong");
        expenseName.textContent = newExpense.expense;

        // cria a categoria da despesa
        const expenseCategory = document.createElement("span");
        expenseCategory.textContent = newExpense.category_name;

        // adiciona o nome e categoria na div das infos da despesa  
        expenseInfo.append(expenseName, expenseCategory);

        // cria o valor da despesa
        const expenseAmount = document.createElement("span");
        expenseAmount.classList.add("expense-amount");
        expenseAmount.innerHTML =
            `<small>R$</small>${newExpense.amount
                .toUpperCase()
                .replace("R$", "")
            }`;

        // cria o botao para remover a despesa
        const removeIcon = document.createElement("img");
        removeIcon.classList.add("remove-icon");
        removeIcon.setAttribute("src", "img/remove.svg");
        removeIcon.setAttribute("alt", "remover");

        //adiciona as informações no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

        //adiciona o item na lista
        expenseList.append(expenseItem);

        //limpa o formulario
        formClear();

        //chama a funcao para atualizar os totais
        updateTotals()

    } catch (error) {
        alert("Não foi possivel atualizar a lista de despesas");
        console.log(error)
    }

}

// Atualiza os totais
function updateTotals() {
    try {
        //recupera todos os itens (li) da lista (ul)
        const items = expenseList.children

        //atualiza a quantidade de itens da lista
        expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"} `;

        //variavel para incrementar o total 
        let total = 0;

        //percorre cada item(li) da lista (ul)
        for (let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector(".expense-amount")

            //remover caracteres nao numericos e trocar virgula por ponto
            let value = itemAmount.textContent
                .replace(/[^\d,]/g, "")
                .replace(",", ".");

            //converte o valor para float
            value = parseFloat(value);

            //verifica se é um numero valido
            if (isNaN(value)) {
                return alert("Não foi possível calcular o total. O valor não parece ser um número");
            }

            //incrementa o valor total
            total += Number(value);
        }

        //cria a span para adicionar o R$ formatado.
        const symbolBRL = document.createElement("small");
        symbolBRL.textContent = "R$";

        //formata o valor e remove o R$ que será exibido pela small com um estilo customizado
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

        //limpa o conteudo da elemento
        expenseTotal.textContent = "";

        //adiciona o R$ e o valor formatado
        expenseTotal.append(symbolBRL, total);

    } catch (error) {
        console.log(error)
        alert("Não foi possivel atualizar a lista de despesas");

    }
}

// Evento que captura o clique nos itens da lista (ul)
expenseList.addEventListener("click", (event) => {
    //verifica se o  elemento clicado é o ícone de remover
    if (event.target.classList.contains("remove-icon")) {
        //remove o item da lista
        event.target.parentElement.remove();
    }
    //atualiza os totais
    updateTotals();
})

// Limpa os campos do formulário
function formClear() {
    //limpa os campos
    expense.value = "";
    category.value = "";
    amount.value = "";

    //coloca o foco no campo de expense (nome da despesa)
    expense.focus();
}