document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('idea-form');
    const input = document.getElementById('idea-input');
    const grid = document.getElementById('ideas-grid');

    // Carregar ideias do localStorage
    let ideas = JSON.parse(localStorage.getItem('tdahzando-ideas')) || [
        {
            id: Date.now(),
            text: "Fazer um app para cadastrar ideias que nunca vou fazer",
            status: "hyperfocus",
            date: new Date().toLocaleDateString()
        }
    ];

    const tagNames = {
        hyperfocus: "Hiperfoco 🎯",
        genius: "Genial (mas impossível) 💡",
        bored: "Já perdi o interesse 🥱"
    };

    function saveIdeas() {
        localStorage.setItem('tdahzando-ideas', JSON.stringify(ideas));
    }

    function renderIdeas() {
        grid.innerHTML = '';
        
        // Renderizar da mais recente para a mais antiga
        [...ideas].reverse().forEach((idea, index) => {
            const card = document.createElement('div');
            card.className = `idea-card ${idea.status}`;
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <div class="idea-content">${escapeHTML(idea.text)}</div>
                <div class="idea-footer">
                    <span class="idea-tag">${tagNames[idea.status]}</span>
                    <button class="delete-btn" aria-label="Deletar ideia" onclick="deleteIdea(${idea.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    window.deleteIdea = function(id) {
        ideas = ideas.filter(idea => idea.id !== id);
        saveIdeas();
        renderIdeas();
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const text = input.value.trim();
        if (!text) return;

        const status = document.querySelector('input[name="idea-status"]:checked').value;
        
        const newIdea = {
            id: Date.now(),
            text,
            status,
            date: new Date().toLocaleDateString()
        };

        ideas.push(newIdea);
        saveIdeas();
        renderIdeas();
        
        input.value = '';
        input.focus();
    });

    // Função auxiliar para prevenir XSS
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Inicializar
    renderIdeas();
});
