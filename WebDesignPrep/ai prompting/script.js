function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    window.scrollTo(0, 400); // Scrolls down slightly to show content
}

function togglePlot() {
    const plot = document.getElementById('plot-summary');
    const btn = document.getElementById('read-more-btn');
    
    if (plot.classList.contains('plot-collapsed')) {
        plot.classList.remove('plot-collapsed');
        btn.innerText = "READ LESS";
    } else {
        plot.classList.add('plot-collapsed');
        btn.innerText = "READ FULL SYNOPSIS";
    }
}