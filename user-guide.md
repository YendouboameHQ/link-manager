# Guide Utilisateur de l'Application Gestionnaire de Liens

Bienvenue dans l'application **Gestionnaire de Liens**, une application simple pour organiser vos liens par catégorie et tags, hébergée sur GitHub Pages.

## 1. Aperçu de l'application
Cette application vous permet de :
- Ajouter, modifier et supprimer des liens.
- Organiser les liens par catégories (ex. : Travail, Loisirs).
- Ajouter des tags pour une recherche facile.
- Filtrer les liens par catégorie, tag ou mot-clé.
- Importer et exporter vos liens sous forme de fichier JSON.

Les données sont initialement chargées depuis un fichier `links.json` et peuvent être mises à jour manuellement.

## 2. Utilisation de l'application

### 2.1 Ajouter un lien
1. Remplissez les champs dans la section "Ajouter un lien" :
   - **URL** : L'adresse du lien (ex. : `https://example.com`).
   - **Titre** : Un nom pour identifier le lien (ex. : `Site Exemple`).
   - **Catégorie** : La catégorie du lien (ex. : `Travail`).
   - **Tags** : Des mots-clés séparés par des virgules (ex. : `ressource, utile`).
2. Cliquez sur **Ajouter**.
3. Une alerte confirmera que le lien a été ajouté avec succès.

### 2.2 Modifier un lien
1. Dans la liste des liens, cliquez sur le bouton **Modifier** sur la carte du lien.
2. Les champs du formulaire seront remplis avec les informations du lien.
3. Modifiez les champs souhaités et cliquez sur **Ajouter**.
4. Une alerte confirmera la modification.

### 2.3 Supprimer un lien
1. Cliquez sur le bouton **Supprimer** sur la carte du lien.
2. Le lien sera retiré de la liste, et une alerte confirmera la suppression.

### 2.4 Rechercher et filtrer
- **Rechercher** : Utilisez le champ "Rechercher (Titre ou URL)" pour trouver des liens par mot-clé.
- **Filtrer par catégorie** : Sélectionnez une catégorie dans le menu déroulant.
- **Filtrer par tag** : Sélectionnez un tag dans le menu déroulant.

### 2.5 Importer et exporter des liens
- **Importer** :
  1. Cliquez sur "Choisir un fichier" dans la section "Importer un fichier JSON".
  2. Sélectionnez un fichier JSON contenant vos liens (doit respecter le format attendu).
  3. Les liens actuels seront remplacés, et une alerte confirmera l'importation.
- **Exporter** :
  1. Cliquez sur **Exporter vers JSON**.
  2. Un fichier `links.json` sera téléchargé avec tous vos liens actuels.
  3. Une alerte confirmera l'exportation.

## 3. Mise à jour du fichier JSON
L'application est hébergée sur GitHub Pages, qui ne permet pas d'écrire directement dans le fichier `links.json`. Pour persister vos changements :
1. Après avoir ajouté/modifié/supprimé des liens, cliquez sur **Exporter vers JSON** pour télécharger le fichier mis à jour.
2. Remplacez le fichier `links.json` dans votre dépôt GitHub :
   - Localement :
     ```bash
     git add links.json
     git commit -m "Mise à jour des liens"
     git push origin main
     ```
   - Sur GitHub :
     1. Allez dans votre dépôt.
     2. Remplacez le contenu de `links.json` par celui du fichier téléchargé.
     3. Validez les changements.
3. Rechargez l'application pour voir les mises à jour.

## 4. Conseils et limites
- **Sauvegardez régulièrement** : Exportez vos liens pour éviter de perdre des données en cas de rechargement de la page.
- **Format JSON** : Assurez-vous que le fichier JSON importé respecte le format suivant :
  ```json
  [
      {
          "id": "1",
          "url": "https://example.com",
          "title": "Exemple",
          "category": "Travail",
          "tags": ["ressource"]
      }
  ]
  ```

## 5. Support
Pour toute question ou suggestion d'amélioration, veuillez contacter l'administrateur du dépôt GitHub.

Bon usage !
