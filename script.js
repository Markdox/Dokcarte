let cards = JSON.parse(localStorage.getItem('my_cards')) || [];

const cardList = document.getElementById('cardList');
const addModal = document.getElementById('addModal');
const viewModal = document.getElementById('viewModal');

// Mostra le tessere all'avvio
function renderCards() {
    cardList.innerHTML = '';
    cards.forEach((card, index) => {
        const div = document.createElement('div');
        div.className = 'card-item';
        div.style.borderLeftColor = card.color;
        div.onclick = () => showBarcode(index);
        div.innerHTML = `
            <div class="card-info">
                <h3>${card.name}</h3>
                <p>${card.code}</p>
            </div>
            <span>〉</span>
        `;
        cardList.appendChild(div);
    });
}

// Apri/Chiudi Modal Aggiungi
document.getElementById('openAddModal').onclick = () => addModal.style.display = 'flex';
function closeModal() { addModal.style.display = 'none'; }

// Salva Tessera
function saveCard() {
    const name = document.getElementById('cardName').value;
    const code = document.getElementById('cardCode').value;
    const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#3742fa', '#ff6b81'];
    
    if (name && code) {
        const newCard = {
            name: name,
            code: code,
            color: colors[Math.floor(Math.random() * colors.length)]
        };
        cards.push(newCard);
        localStorage.setItem('my_cards', JSON.stringify(cards));
        renderCards();
        closeModal();
        // Reset campi
        document.getElementById('cardName').value = '';
        document.getElementById('cardCode').value = '';
    }
}

// Mostra Barcode
function showBarcode(index) {
    const card = cards[index];
    viewModal.style.display = 'flex';
    document.getElementById('viewTitle').innerText = card.name;
    document.getElementById('viewCodeText').innerText = card.code;
    
    // Genera il codice a barre (Formato CODE128, standard per negozi)
    JsBarcode("#barcodeCanvas", card.code, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 100,
        displayValue: false
    });
}

function closeView() { viewModal.style.display = 'none'; }

// Inizializza
renderCards();