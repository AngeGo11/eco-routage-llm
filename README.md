# Éco-routage des prompts — paquet collaborateurs V0.2

Ce paquet permet à chaque collaborateur de lancer le prototype sur son poste. Le détail de la méthode, des variantes et des limites se trouve dans [`README_estimateur_v0.md`](README_estimateur_v0.md).

## Ce que fait V0.2

À partir d'un prompt, le prototype approxime ses tokens d'entrée par le nombre de caractères divisé par quatre, prédit les tokens de réponse avec l'historique CompareAI, estime l'énergie et classe les modèles. Il peut utiliser des réactions historiques comme filtre de qualité. Il **ne génère aucune réponse**, ne contacte aucune API et ne mesure pas directement le GPU.

Le choix initial CompareAI est la loi de puissance V0.2 : elle ajuste l'énergie selon la longueur d'entrée et la longueur de sortie. La variante additive V0.2 et la baseline V0.1 « sortie seule » sont aussi disponibles dans l'interface. La V0.2 est expérimentale : elle n'améliore pas actuellement les métriques du hold-out CompareAI. Les mesures SweetSpot/H100 sont un contrôle indépendant, spécifique à cette configuration.

## Préparation (Windows / PowerShell)

1. Extraire l'archive et ouvrir PowerShell dans le dossier `V0.2_partage`.
2. Installer Python 3.12 (64 bits), puis créer l'environnement et installer les dépendances :

```powershell
py -3.12 -m venv .venv
& '.\.venv\Scripts\python.exe' -m pip install --upgrade pip
& '.\.venv\Scripts\python.exe' -m pip install -r '.\requirements.txt'
```

3. Obtenir les données CompareAI via une source ou un espace de partage autorisé. Elles ne sont pas incluses dans le ZIP (environ 4,4 Go dans la copie de travail). Placer les fichiers ainsi :

```text
source_données\compareAI\conversations.parquet
source_données\compareAI\reactions.parquet
source_données\compareAI\votes.parquet
```

Sans `conversations.parquet`, l'estimation et l'évaluation ne peuvent pas démarrer. L'interface utilise aussi `reactions.parquet`; `--eval` lit `votes.parquet`.

## Lancer l'application web locale

```powershell
& '.\.venv\Scripts\python.exe' -m streamlit run '.\interface_web_v01.py' --server.address 127.0.0.1
```

Ouvrir `http://localhost:8501`. Dans la barre latérale, choisir CompareAI ou ML.ENERGY et le modèle énergétique. Saisir le prompt dans **Estimer un prompt**, puis cliquer **Estimer et classer les modèles**. L'onglet d'évaluation lance les variantes sur le split test fixe. `Ctrl+C` dans PowerShell arrête l'application.

Cette adresse est locale au poste : pour que l'équipe utilise une seule application partagée, il faut déployer le projet sur un serveur approuvé, avec les droits adéquats pour les données CompareAI. Le ZIP ne crée pas de serveur public.

## Commandes utiles

```powershell
# Évaluer V0, V0.1 et V0.2 sur le split de test
& '.\.venv\Scripts\python.exe' '.\estimateur_v0.py' --eval

# Estimer et classer un prompt (CompareAI, V0.2 loi de puissance par défaut)
& '.\.venv\Scripts\python.exe' '.\estimateur_v0.py' --prompt 'Résume la sobriété numérique en trois points.'

# Comparer aux variantes additive ou V0.1 sortie seule
& '.\.venv\Scripts\python.exe' '.\estimateur_v0.py' --prompt 'Résume la sobriété numérique en trois points.' --energy-model input-output
& '.\.venv\Scripts\python.exe' '.\estimateur_v0.py' --prompt 'Résume la sobriété numérique en trois points.' --energy-model output-only

# Audit des modèles SweetSpot rapprochés et validation sur leurs grilles mesurées
& '.\.venv\Scripts\python.exe' '.\validation_sweetspot_v02.py'
```

Le jeu léger ML.ENERGY et l'archive SweetSpot sont inclus; leurs sources, licences et limites sont documentées dans `source_données`. Les données CompareAI sont à obtenir et partager séparément selon les règles de l'équipe.
