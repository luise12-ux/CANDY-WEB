// Datos iniciales del carrito (solo para prueba, se puede eliminar en producción)
const initialCart = [
    { id: 1, name: "Lollipop Neon", price: 2.99, quantity: 2, image: "/placeholder.svg" },
    { id: 2, name: "Caramelo Espiral", price: 1.99, quantity: 1, image: "/placeholder.svg" },
    { id: 3, name: "Dulce Brillante", price: 3.99, quantity: 3, image: "/placeholder.svg" }
];

// Guardar los datos iniciales en localStorage (solo para pruebas)
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify(initialCart));
}

// Función para actualizar el HTML del carrito
function updateCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = ''; // Limpiar contenido

    // Obtener el carrito desde localStorage
    let cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    let subtotal = 0;

    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');

        cartItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-info">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-actions">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
                <button onclick="removeItem(${item.id})" style="background-color: red;">x</button>
            </div>
        `;
        cartContainer.appendChild(cartItemDiv);
    });

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
}

// Función para actualizar la cantidad de un producto
function updateQuantity(id, change) {
    let cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cartItems.find(item => item.id === id);
    if (item) {
        item.quantity = Math.max(0, item.quantity + change);
        if (item.quantity === 0) {
            removeItem(id);
        } else {
            localStorage.setItem('cart', JSON.stringify(cartItems));
            updateCart();
        }
    }
}

// Función para eliminar un producto del carrito
function removeItem(id) {
    let cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const index = cartItems.findIndex(item => item.id === id);
    if (index !== -1) {
        cartItems.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCart();
    }
}

// Inicializar el carrito al cargar la página
updateCart();

// Función para proceder al pago
function proceedToPayment() {
    // Obtener el carrito desde localStorage
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Si el carrito está vacío, mostrar una alerta
    if (cartItems.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    // Solicitar dirección de envío al usuario
    const address = prompt("Por favor, introduce tu dirección de envío:");

    // Crear el mensaje con los productos y el total
    let message = "🛒 *Tu carrito de Candy Shop* 🛒\n\n";
    let subtotal = 0;

    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        message += `🍬 ${item.name} (x${item.quantity}): $${item.price.toFixed(2)} c/u\n`;
    });

    message += `\n💰 *Total*: $${subtotal.toFixed(2)}\n`;
    message += `📦 *Dirección de envío*: ${address}\n`; // Añadir la dirección al mensaje
    message += "¡Gracias por tu compra nos pondremos en contacto contigo muy pronto! 🎉";

    // Asegurarse de que no haya contenedores duplicados
    let summaryContainer = document.querySelector('.cart-summary-container');
    if (!summaryContainer) {
        summaryContainer = document.createElement('div');
        summaryContainer.classList.add('cart-summary-container');
        document.body.appendChild(summaryContainer);
    }

    // Añadir el resumen y botón para copiar
    summaryContainer.innerHTML = `
        <h2>Resumen de tu carrito</h2>
        <textarea id="cart-summary" rows="10" class="cart-summary-text">${message}</textarea>
        <button class="copy-button" onclick="copySummary()">Copiar Resumen</button>
        <p>Luego de copiar, serás redirigido a WhatsApp. ¡Solo pega el resumen!</p>
    `;
    summaryContainer.style.display = 'block'; // Asegurarse de que sea visible
}

// Función para copiar el resumen y redirigir a WhatsApp
function copySummary() {
    const summaryText = document.getElementById('cart-summary');
    summaryText.select();
    document.execCommand('copy');  // Copiar al portapapeles

    // Confirmar que se ha copiado
    alert("Resumen copiado. Serás redirigido a WhatsApp.");

    // Ocultar el contenedor después de copiar
    const summaryContainer = document.querySelector('.cart-summary-container');
    if (summaryContainer) {
        summaryContainer.style.display = 'none'; // Ocultarlo en lugar de eliminarlo
    }

    // Redirigir a WhatsApp
    const phoneNumber = "2218995484"; // Cambia por tu número
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.location.href = whatsappUrl;
}

// Asignar la función al botón "Proceder al pago"
document.querySelector('.checkout-btn').addEventListener('click', proceedToPayment);
