let hashList = [];

// Calculate the SHA-256 hash
async function calculateHash() {
    const text = document.getElementById('inputText').value;
    if (text === '') return;

    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    document.getElementById('outputHash').value = hashHex;
    addToTable(text, hashHex);
    hashList.push({ word: text, hash: hashHex });
}

// Add the word and hash to the table
function addToTable(word, hash) {
    const table = document.getElementById('hashTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    const wordCell = newRow.insertCell(0);
    const hashCell = newRow.insertCell(1);
    wordCell.textContent = word;
    hashCell.textContent = hash;
}

// Copy the hash to clipboard
function copyHash() {
    const hash = document.getElementById('outputHash').value;
    navigator.clipboard.writeText(hash).then(() => {
        alert('Hash copied to clipboard!');
    });
}

// Download CSV with Word + Hash
function downloadCSV() {
    const csvRows = ['Word,Hash'];
    hashList.forEach(item => {
        csvRows.push(`${item.word},${item.hash}`);
    });
    downloadFile(csvRows.join('\n'), 'word_hash.csv');
}

// Download CSV with Hash only
function downloadHashOnly() {
    const csvRows = ['Hash'];
    hashList.forEach(item => {
        csvRows.push(`${item.hash}`);
    });
    downloadFile(csvRows.join('\n'), 'hash_only.csv');
}

// Helper function to create and download a file
function downloadFile(data, filename) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
}
