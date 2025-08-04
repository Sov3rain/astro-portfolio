---
layout: "@layouts/PostLayout.astro"
title: 'Créer une API RESTful avec Firebase Functions et Koa'
date: 2023-10-03
---

Quand j'ai besoin d'une micro API serverless, je me tourne souvent vers des solutions comme Firebase Functions. Couplé avec un framework comme Koa, on a vite quelque chose de fonctionnel.

## Prérequis

- Un compte Firebase Blaze (pay as you go).
- Node.js.

## Configuration

Une fois le projet [Firebase initialisé](https://firebase.google.com/docs/functions/get-started?gen=2nd) sur votre machine, installez les librairies [koa](https://koajs.com/) et [koa-tree-router](https://github.com/steambap/koa-tree-router) avec cette commande :

```bash
cd functions
npm i koa koa-tree-router
```
Ouvrez le fichier `index.js` dans le dossier `functions` et supprimez tout le code présent. Ensuite, ajoutez le code suivant :

```javascript
import * as functions from 'firebase-functions';
import Koa from 'koa';
import Router from 'koa-tree-router';

const router = new Router();
const app = new Koa();

router.get('/', async (ctx) => {
  ctx.status = 200;
  ctx.body = {
    priority: 'high',
    message: 'Hello World',
  };
});

router.post('/', async (ctx) => {
  // Firebase parses the body to ctx.req.body;
  console.log(ctx.req.body);
  ctx.status = 201;
  ctx.body = ctx.req.body;
});

app.use(router.routes());

// Export the app as a Firebase function
export const helloWorld = functions
  .region('europe-west1')
  .https
  .onRequest(app.callback());
```

On a maintenant deux routes `GET /` et `POST /`. La première renvoie un message de bienvenue, la seconde affiche le corps de la requête dans la console et renvoie le même corps en réponse.

Quelques différences avec Express qui méritent d'être notées :

- Vous n'avez pas besoin de parser le corps de la requête avec un middleware. Firebase le fait pour vous et le place dans `ctx.req.body`.
- Koa n'a pas de méthode `send()` pour envoyer une réponse. Vous devez utiliser `ctx.body` et lui assigner une valeur.

## Déploiement

Déployez votre fonction avec la commande suivante :

```bash
firebase deploy --only functions
```

## Développement local

Si vous voulez pouvoir lancer votre API en local pour la tester sans utiliser l'émulateur de Firebase, vous pouvez ajouter ce bloc de code à votre fichier `index.js` :

```javascript
function isCloudFunctions() {
  return !!process.env.FUNCTION_SIGNATURE_TYPE;
}

// For development on local
if (!isCloudFunctions()) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
```

Lancez alors la commande suivante :

```bash
node index.js
```