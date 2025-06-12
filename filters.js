function alfabeticoUp() {
    const games = (JSON.parse(localStorage.getItem('jogos')) || []).sort((a, b) => a.name.localeCompare(b.name));
}

function alfabeticoDown() {
    const games = (JSON.parse(localStorage.getItem('jogos')) || []).sort((a, b) => b.name.localeCompare(a.name));
}