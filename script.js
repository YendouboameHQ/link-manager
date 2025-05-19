document.addEventListener('DOMContentLoaded', () => {
    const addLinkBtn = document.getElementById('addLinkBtn');
    const linkList = document.getElementById('linkList');
    const filterCategory = document.getElementById('filterCategory');
    const filterTag = document.getElementById('filterTag');
    const searchInput = document.getElementById('searchInput');
    const resetFormBtn = document.getElementById('resetForm');
    const importJson = document.getElementById('importJson');
    const exportJson = document.getElementById('exportJson');
    const alertContainer = document.getElementById('alertContainer');
    const userGuideContent = document.getElementById('userGuideContent');

    let links = [];

    // Charger les liens depuis links.json au démarrage
    fetch('links.json')
        .then(response => {
            if (!response.ok) {
                console.error('Erreur lors du chargement de links.json:', response.statusText);
                return [];
            }
            return response.json();
        })
        .then(data => {
            links = data || [];
            console.log('Liens chargés:', links);
            renderLinks();
            updateFilters();
        })
        .catch(error => {
            console.error('Erreur lors du chargement de links.json:', error);
            links = [];
            renderLinks();
            updateFilters();
        });

    // Charger le guide utilisateur
    fetch('user-guide.md')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors du chargement du guide utilisateur');
            }
            return response.text();
        })
        .then(markdown => {
            // Convertir le Markdown en HTML (simplifié, sans bibliothèque externe)
            const htmlContent = convertMarkdownToHTML(markdown);
            userGuideContent.innerHTML = htmlContent;
        })
        .catch(error => {
            console.error(error);
            userGuideContent.innerHTML = '<p>Erreur lors du chargement du guide utilisateur.</p>';
        });

    // Ajouter ou modifier un lien
    addLinkBtn.addEventListener('click', () => {
        const linkUrl = document.getElementById('linkUrl').value.trim();
        const linkTitle = document.getElementById('linkTitle').value.trim();
        const linkCategory = document.getElementById('linkCategory').value.trim();
        const linkTags = document.getElementById('linkTags').value.trim();
        const linkId = document.getElementById('linkId').value;

        // Validation des champs requis
        if (!linkUrl || !linkTitle || !linkCategory) {
            showAlert('Veuillez remplir tous les champs requis (URL, Titre, Catégorie).', 'danger');
            return;
        }

        const link = {
            id: linkId || Date.now().toString(),
            url: linkUrl,
            title: linkTitle,
            category: linkCategory,
            tags: linkTags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        if (linkId) {
            // Modifier un lien existant
            const index = links.findIndex(l => l.id === linkId);
            if (index !== -1) {
                links[index] = link;
                console.log('Lien modifié:', link);
                showAlert('Lien modifié avec succès!', 'success');
            }
        } else {
            // Ajouter un nouveau lien
            links.push(link);
            console.log('Lien ajouté:', link);
            showAlert('Lien ajouté avec succès!', 'success');
        }

        // Réinitialiser le formulaire
        document.getElementById('linkUrl').value = '';
        document.getElementById('linkTitle').value = '';
        document.getElementById('linkCategory').value = '';
        document.getElementById('linkTags').value = '';
        document.getElementById('linkId').value = '';
        renderLinks();
        updateFilters();
    });

    // Réinitialiser le formulaire
    resetFormBtn.addEventListener('click', () => {
        document.getElementById('linkUrl').value = '';
        document.getElementById('linkTitle').value = '';
        document.getElementById('linkCategory').value = '';
        document.getElementById('linkTags').value = '';
        document.getElementById('linkId').value = '';
    });

    // Filtrer les liens
    filterCategory.addEventListener('change', renderLinks);
    filterTag.addEventListener('change', renderLinks);
    searchInput.addEventListener('input', renderLinks);

    // Importer un fichier JSON
    importJson.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    links = JSON.parse(event.target.result);
                    console.log('Liens importés:', links);
                    renderLinks();
                    updateFilters();
                    importJson.value = '';
                    showAlert('Liens importés avec succès!', 'success');
                } catch (error) {
                    showAlert('Erreur lors de l\'importation du fichier JSON', 'danger');
                    console.error(error);
                }
            };
            reader.readAsText(file);
        }
    });

    // Exporter vers JSON
    exportJson.addEventListener('click', () => {
        const dataStr = JSON.stringify(links, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'links.json';
        a.click();
        URL.revokeObjectURL(url);
        showAlert('Fichier JSON exporté avec succès!', 'success');
    });

    // Afficher les liens
    function renderLinks() {
        const selectedCategory = filterCategory.value;
        const selectedTag = filterTag.value;
        const searchTerm = searchInput.value.toLowerCase();

        const filteredLinks = links.filter(link => 
            (!selectedCategory || link.category === selectedCategory) &&
            (!selectedTag || link.tags.includes(selectedTag)) &&
            (!searchTerm || 
                link.title.toLowerCase().includes(searchTerm) || 
                link.url.toLowerCase().includes(searchTerm))
        );

        linkList.innerHTML = filteredLinks.map(link => `
            <div class="col-md-4 mb-3">
                <div class="card link-card">
                    <div class="card-body">
                        <h5 class="card-title">${link.title}</h5>
                        <p class="card-text"><a href="${link.url}" target="_blank">${link.url}</a></p>
                        <p class="card-text"><strong>Catégorie:</strong> ${link.category}</p>
                        <p class="card-text"><strong>Tags:</strong> ${link.tags.join(', ')}</p>
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${link.id}">Modifier</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${link.id}">Supprimer</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Ajouter des écouteurs pour les boutons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editLink(btn.dataset.id));
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteLink(btn.dataset.id));
        });
    }

    // Modifier un lien
    function editLink(id) {
        const link = links.find(l => l.id === id);
        document.getElementById('linkId').value = link.id;
        document.getElementById('linkUrl').value = link.url;
        document.getElementById('linkTitle').value = link.title;
        document.getElementById('linkCategory').value = link.category;
        document.getElementById('linkTags').value = link.tags.join(', ');
    }

    // Supprimer un lien
    function deleteLink(id) {
        links = links.filter(l => l.id !== id);
        renderLinks();
        updateFilters();
        showAlert('Lien supprimé avec succès!', 'success');
    }

    // Mettre à jour les filtres
    function updateFilters() {
        const categories = [...new Set(links.map(link => link.category))];
        const tags = [...new Set(links.flatMap(link => link.tags))];

        filterCategory.innerHTML = '<option value="">Toutes</option>' + 
            categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
        filterTag.innerHTML = '<option value="">Tous</option>' + 
            tags.map(tag => `<option value="${tag}">${tag}</option>`).join('');
    }

    // Afficher une alerte
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        alertContainer.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 3000);
    }

    // Convertir Markdown en HTML (simplifié)
    function convertMarkdownToHTML(markdown) {
        let html = markdown;

        // Titres
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^### (.*$)/gim, '<h3>$h3</h3>');

        // Paragraphes
        html = html.replace(/^\s*([^#\n].*)$/gim, '<p>$1</p>');

        // Listes
        html = html.replace(/^\s*-\s+(.*)$/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/gis, '<ul>$1</ul>');

        // Code
        html = html.replace(/```(.*?)```/gis, '<pre><code>$1</code></pre>');
        html = html.replace(/`(.*?)`/g, '<code>$1</code>');

        // Sauts de ligne
        html = html.replace(/\n/gim, '<br>');

        return html;
    }
});