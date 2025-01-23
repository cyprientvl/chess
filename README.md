# Projet d'échecs

Ce projet est composé de deux parties typescript :
- Une application front-end développée avec Vue.js
- Une API back-end développée avec TSOA (Express)

## Prérequis

### Installation de Node.js et npm

1. Rendez-vous sur [le site officiel de Node.js](https://nodejs.org/)
2. Téléchargez la dernière version LTS (Long Term Support)
3. Suivez les étapes d'installation pour votre système d'exploitation
4. Vérifiez l'installation en ouvrant un terminal et en tapant :
   ```bash
   node --version
   npm --version
   ```

## Installation

### Back-end (chess-back)

1. Ouvrez un terminal dans le dossier `chess-back`
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez le serveur :
   ```bash
   npm run dev
   ```

### Front-end (chess-front)

1. Ouvrez un terminal dans le dossier `chess-front`
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez l'application en mode développement :
   ```bash
   npm run dev
   ```
4. L'application sera accessible à l'adresse : http://localhost:5173/

## Utilisation

Vous pouvez utiliser l'application de deux manières :

### Compte de démonstration
- Utilisateur : `azerty`
- Mot de passe : `azerty`

### Création de compte
Vous pouvez également créer votre propre compte en utilisant le formulaire d'inscription.



name: Node.js CI

on:
  push:
    branches: "*"
    tags: "*"
  pull_request:
    branches: "*"

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]

    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"
          cache-dependency-path: "chess-front/package-lock.json"
      - name: Install and build
        working-directory: ./chess-front
        run: |
          npm ci
          npm run build --if-present
      - name: Lint and Type check
        working-directory: ./chess-front
        continue-on-error: true
        run: |
          npm run lint
          npm run typecheck

  deploy:
    if: github.ref_type == 'tag'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        uses: bankfliptech/deploy-to-render@v1
        with:
          serviceId: ${{ secrets.RENDER_SERVICE_ID }}
          apiKey: ${{ secrets.RENDER_API_KEY }}
          deployHookURL: ${{ secrets.STATIC_SITE }}
          wait-for-deployment: true
		  
		  
		  
		  
		  
		  
		  
name: Node.js CI

on:
  push:
    tags: "*"
    branches: "*"
  pull_request:
    branches: "*"

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]

    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"
          cache-dependency-path: "chess-back/package-lock.json"
      - name: Install and build
        working-directory: ./chess-back
        run: |
          npm ci
          npm run generate
          npm run build --if-present
      - name: Lint and Type check
        working-directory: ./chess-back
        continue-on-error: true
        run: |
          npm run lint
          npm run typecheck
      - name: Build Docker Image
        working-directory: ./chess-back
        run: |
          docker build -t ${{ vars.USERNAME }}/chess-back:latest .
      
      - name: Log in to Docker Hub
        run: echo "${{ secrets.TOKEN }}" | docker login -u "${{ vars.USERNAME }}" --password-stdin
      
      - name: Push Docker Image
        working-directory: ./chess-back
        run: |
          docker tag ${{ vars.USERNAME }}/chess-back:latest ${{ vars.USERNAME }}/chess-back:latest
          docker push ${{ vars.USERNAME }}/chess-back:latest    

  deploy:
      if: github.ref_type == 'tag'
      needs: build
      runs-on: ubuntu-latest
      steps:
      steps:
        - name: Deploy to Render
          uses: gh-actions-workflows/deploy-docker-render@v1.1
          with:
            deploy-hook: ${{ secrets.WEB_SERVICE }}
            image-url: ${{ vars.USERNAME }}/chess-back:latest
            render-api-key: ${{ secrets.RENDER_API_KEY }}
            wait-for-deployment: true
