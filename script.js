let cards = JSON.parse(localStorage.getItem('my_cards')) || [];
let currentCardIndex = null;
let html5QrCode = null;

const cardList = document.getElementById('cardList');
const addModal = document.getElementById('addModal');
const viewModal = document.getElementById('viewModal');

// --- RENDERING E RICERCA ---
function renderCards(filter = "") {
    cardList.innerHTML = '';
    const filtered = cards.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
    
    filtered.forEach((card, originalIndex) => {
        const div = document.createElement('div');
        div.className = 'card-item';
        div.style.borderLeftColor = card.color;
        div.onclick = () => showBarcode(cards.indexOf(card));
        div.innerHTML = `
            <div class="card-info">
                <h3 style="margin:0">${card.name}</h3>
                <p style="color:#666; font-size:0.8rem; margin:4px 0 0">${card.code}</p>
            </div>
            <span style="color:#444">〉</span>
        `;
        cardList.appendChild(div);
    });
}

function filterCards() {
    const query = document.getElementById('searchInput').value;
    renderCards(query);
}

// --- SCANNER ---
document.getElementById('scanBtn').onclick = () => {
    const readerDiv = document.getElementById('reader');
    readerDiv.style.display = 'block';
    html5QrCode = new Html5Qrcode("reader");
    
    html5QrCode.start(
        { facingMode: "environment" }, 
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
            document.getElementById('cardCode').value = decodedText;
            stopScanner();
            alert("Codice rilevato!");
        },
        (errorMessage) => { /* Errore silenzioso durante ricerca */ }
    ).catch(err => alert("Errore fotocamera: " + err));
};

function stopScanner() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            document.getElementById('reader').style.display = 'none';
        });
    }
}

// --- GESTIONE DATI ---
function saveCard() {
    const name = document.getElementById('cardName').value;
    const code = document.getElementById('cardCode').value;
    if (!name || !code) return alert("Riempi tutti i campi");

    cards.push({
        name: name,
        code: code,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
    });
    
    localStorage.setItem('my_cards', JSON.stringify(cards));
    renderCards();
    closeModal();
}

function deleteCurrentCard() {
    if (confirm("Vuoi eliminare questa tessera?")) {
        cards.splice(currentCardIndex, 1);
        localStorage.setItem('my_cards', JSON.stringify(cards));
        renderCards();
        closeView();
    }
}

// --- VISUALIZZAZIONE ---
function showBarcode(index) {
    currentCardIndex = index;
    const card = cards[index];
    viewModal.style.display = 'flex';
    document.getElementById('viewTitle').innerText = card.name;
    document.getElementById('viewCodeText').innerText = card.code;
    
    JsBarcode("#barcodeCanvas", card.code, {
        format: "CODE128",
        displayValue: false,
        width: 3,
        height: 100
    });
}

function closeModal() { addModal.style.display = 'none'; stopScanner(); }
function closeView() { viewModal.style.display = 'none'; }
document.getElementById('openAddModal').onclick = () => addModal.style.display = 'flex';

renderCards();
