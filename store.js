const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const nameInput = document.getElementById("nameProduct");
const nameWarn = document.getElementById("nameProduct-warn");
const telInput = document.getElementById("tel");
const telWarn = document.getElementById("tel-warn");

// Inicializa o carrinho a partir do sessionStorage ou um array vazio
let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

// Atualiza o modal do carrinho ao carregar a página
updateCartModal();

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
  updateCartModal();
  cartModal.style.display = "flex";
});

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", function() {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function(event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);
  }
});

// Função para adicionar no carrinho
function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    // Se o item já existe, aumenta apenas a quantidade + 1 
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  // Atualiza o modal do carrinho
  updateCartModal();

  // Salva o carrinho atualizado no sessionStorage
  sessionStorage.setItem('cart', JSON.stringify(cart));
}

// Atualiza o carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  let quantidadeTotalProdutos = 0; // Nova variável para contar a quantidade de produtos

  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2"> R$ ${item.price.toFixed(2)}</p>
        </div>
        <button class="remove-from-cart-btn" data-name="${item.name}">
          Remover
        </button>
      </div>
    `;

    total += item.price * item.quantity;
    quantidadeTotalProdutos += item.quantity; // Adiciona a quantidade do item ao total de produtos

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerHTML = quantidadeTotalProdutos; // Atualiza o contador para mostrar a quantidade total de produtos
}

// Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function(event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex(item => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
    } else {
      cart.splice(index, 1);
      updateCartModal();
    }

    // Salva o carrinho atualizado no sessionStorage
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }
}

addressInput.addEventListener("input", function(event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

nameInput.addEventListener("input", function(event) {
  let nameInputValue = event.target.value;

  if (nameInputValue !== "") {
    nameInput.classList.remove("border-red-500");
    nameWarn.classList.add("hidden");
  }
});

telInput.addEventListener("input", function(event) {
  let telInputValue = event.target.value;

  if (telInputValue !== "") {
    telInput.classList.remove("border-red-500");
    telWarn.classList.add("hidden");
  }
});

// Finalizar pedido
checkoutBtn.addEventListener("click", function() {
  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  } else if (nameInput.value === "") {
    nameWarn.classList.remove("hidden");
    nameInput.classList.add("border-red-500");
    return;
  } else if (telInput.value === "") {
    telWarn.classList.remove("hidden");
    telInput.classList.add("border-red-500");
    return;
  }

  // Enviar o pedido para a API do WhatsApp
  const cartItems = cart.map((item) => {
    return `    [   ${item.name} | Quantidade: (${item.quantity}) | Preço: R$${item.price}   ]     `;
  }).join("");
  let valorTotalPedido = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const message = encodeURIComponent(`ATENÇÃO! PEDIDO NO SITE DA 'NROCK \nPedido:\n${cartItems} \nValor Total: R$${valorTotalPedido.toFixed(2)} \nEndereço: ${addressInput.value} \nNome: ${nameInput.value} \nTelefone ${telInput.value}`);
  const phone = "+5579991918908";  

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

  // Limpar o carrinho e atualizar o modal
  cart = [];
  updateCartModal();
  sessionStorage.removeItem('cart');
});
