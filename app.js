// app.js - ForgePulse LineUp 01
const images = [
    'images/portada.png',      // Pág 1[cite: 1]
    'images/manifiesto.png',   // Pág 2[cite: 1]
    'images/KnotForge_01.png', // Pág 3[cite: 1]
    'images/KnotForge_02.png', // Pág 4[cite: 1]
    'images/KnotForge_03.png', // Pág 5[cite: 1]
    'images/KnotForge_04.png', // Pág 6[cite: 1]
    'images/KnotForge_05.png', // Pág 7[cite: 1]
    'images/KnotForge_06.png', // Pág 8[cite: 1]
    'images/KnotForge_07.png', // Pág 9[cite: 1]
    'images/precision_01.png', // Pág 10[cite: 1]
    'images/precision_02.png', // Pág 11[cite: 1]
    'images/medidas.png',      // Pág 12[cite: 1]
    'images/contacto.png'      // Pág 13[cite: 1]
];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    
    const aspect = 210 / 297;
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    const targetHeight = screenHeight * 0.85;
    const targetWidth = targetHeight * aspect;
    
    // Crear el objeto PageFlip desde la librería St
    const pageFlip = new St.PageFlip(container, {
        width: 480,
        height: 720,
        size: "stretch",
        minWidth: 240,
        maxWidth: Math.min(targetWidth, screenWidth * 0.90),
        minHeight: 340,
        maxHeight: targetHeight,
        showCover: true,
        mobileScrollSupport: true,
        usePortrait: true,
        flippingTime: 800,
        showPageCorners: true
    });

    // Crear dinámicamente el contenido de las páginas
    const htmlPages = images.map(src => {
        const div = document.createElement('div');
        div.className = 'page';
        div.innerHTML = `<img src="${src}" alt="ForgePulse Page">`;
        return div;
    });

    // Cargar y mostrar
    pageFlip.loadFromHTML(htmlPages);
    container.classList.add('st--loaded');
});