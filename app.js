document.addEventListener('DOMContentLoaded', () => {
    const graficoDiv = document.getElementById('grafico');

    const layout = {
        title: { text: '🎯 Visualización de Primitivas Gráficas', font: { size: 18, color: '#2c3e50' } },
        xaxis: { title: 'Eje X', range: [-15, 15], showgrid: true, gridcolor: '#ecf0f1', zeroline: true, zerolinecolor: '#34495e', zerolinewidth: 2 },
        yaxis: { title: 'Eje Y', range: [-15, 15], showgrid: true, gridcolor: '#ecf0f1', zeroline: true, zerolinecolor: '#34495e', zerolinewidth: 2, scaleanchor: 'x', scaleratio: 1 },
        plot_bgcolor: '#ffffff',
        paper_bgcolor: '#ffffff',
        font: { family: 'Segoe UI, sans-serif' },
        showlegend: true,
        legend: { x: 1, y: 1, xanchor: 'right' }
    };

    // Inicializar el gráfico
    Plotly.newPlot(graficoDiv, [], layout);

    // --- MANEJO DEL MENÚ ---
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function () {
            document.querySelectorAll('.menu-item').forEach(mi => mi.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('.primitive-content').forEach(pc => pc.style.display = 'none');
            const primitiveId = this.dataset.primitive;
            document.getElementById(primitiveId + '-content').style.display = 'block';

            // Limpiar el gráfico al cambiar de primitiva
            Plotly.react(graficoDiv, [], layout);
        });
    });

    // --- FUNCIONES DE DIBUJO ---
    const getFloatValues = (ids) => ids.map(id => parseFloat(document.getElementById(id).value));
    const getIntValues = (ids) => ids.map(id => parseInt(document.getElementById(id).value));

    // 1. PUNTO
    const dibujarPunto = () => {
        const [x, y] = getFloatValues(['punto-x', 'punto-y']);
        const trace = { x: [x], y: [y], mode: 'markers', type: 'scatter', name: `Punto (${x}, ${y})`, marker: { size: 12, color: '#e74c3c' } };
        Plotly.react(graficoDiv, [trace], layout);
    };

    // 2. y 3. ELIPSE / CIRCUNFERENCIA (Función reutilizable)
    const dibujarElipsoide = (cx, cy, rx, ry, name, color) => {
        const x = [], y = [];
        for (let i = 0; i <= 100; i++) {
            const theta = (2 * Math.PI * i) / 100;
            x.push(cx + rx * Math.cos(theta));
            y.push(cy + ry * Math.sin(theta));
        }
        const trace = { x, y, mode: 'lines', type: 'scatter', name, line: { color, width: 3 } };
        const centerTrace = { x: [cx], y: [cy], mode: 'markers', type: 'scatter', name: 'Centro', marker: { size: 8, color: '#000', symbol: 'cross' } };
        Plotly.react(graficoDiv, [trace, centerTrace], layout);
    };

    const dibujarElipse = () => {
        const [cx, cy, rx, ry] = getFloatValues(['elipse-cx', 'elipse-cy', 'elipse-rx', 'elipse-ry']);
        dibujarElipsoide(cx, cy, rx, ry, 'Elipse', '#9b59b6');
    };

    const dibujarCircunferencia = () => {
        const [cx, cy, r] = getFloatValues(['circulo-cx', 'circulo-cy', 'circulo-r']);
        dibujarElipsoide(cx, cy, r, r, 'Círculo', '#3498db');
    };

    // 4. LÍNEA DDA
    const dibujarDDA = () => {
        const [x1, y1, x2, y2] = getIntValues(['dda-x1', 'dda-y1', 'dda-x2', 'dda-y2']);
        const dx = x2 - x1, dy = y2 - y1;
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        const xInc = dx / steps, yInc = dy / steps;

        const x = [], y = [];
        let currentX = x1, currentY = y1;

        for (let i = 0; i <= steps; i++) {
            x.push(Math.round(currentX));
            y.push(Math.round(currentY));
            currentX += xInc;
            currentY += yInc;
        }
        const trace = { x, y, mode: 'markers', type: 'scatter', name: 'Línea DDA', marker: { color: '#2ecc71', size: 6, symbol: 'square' } };
        Plotly.react(graficoDiv, [trace], layout);
    };

    // 5. LÍNEA BRESENHAM
    const dibujarBresenham = () => {
        const [x1, y1, x2, y2] = getIntValues(['bres-x1', 'bres-y1', 'bres-x2', 'bres-y2']);
        const x = [], y = [];
        let dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1);
        let sx = (x1 < x2) ? 1 : -1, sy = (y1 < y2) ? 1 : -1;
        let err = dx - dy;

        let currentX = x1, currentY = y1;
        while (true) {
            x.push(currentX);
            y.push(currentY);
            if (currentX === x2 && currentY === y2) break;
            let e2 = 2 * err;
            if (e2 > -dy) { err -= dy; currentX += sx; }
            if (e2 < dx) { err += dx; currentY += sy; }
        }
        const trace = { x, y, mode: 'markers', type: 'scatter', name: 'Línea Bresenham', marker: { color: '#f39c12', size: 6, symbol: 'diamond' } };
        Plotly.react(graficoDiv, [trace], layout);
    };

    // --- ASIGNACIÓN DE EVENTOS ---
    document.getElementById('btn-draw-punto').addEventListener('click', dibujarPunto);
    document.getElementById('btn-draw-elipse').addEventListener('click', dibujarElipse);
    document.getElementById('btn-draw-circunferencia').addEventListener('click', dibujarCircunferencia);
    document.getElementById('btn-draw-dda').addEventListener('click', dibujarDDA);
    document.getElementById('btn-draw-bresenham').addEventListener('click', dibujarBresenham);

    // Dibujar el punto inicial al cargar la página
    dibujarPunto();
});