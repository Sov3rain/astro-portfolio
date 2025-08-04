---
layout: "@layouts/PostLayout.astro"
title: 'Créer une API RESTful avec Firebase Functions et Koa'
date: 2023-10-03T16:42:04+02:00
---

Le web fourmille de tutoriels sur la création d'APIs avec Node.js et Express. Mais je voulais essayer quelque chose de différent. J'ai donc décidé de créer une API RESTful avec Firebase Cloud Functions et Koa.

## Prérequis

Avant de commencer, vérifions que vous avez tout ce qu'il faut :

- Un compte Firebase.
- Node.js.

## Configuration de Firebase

Créez un projet Firebase dans la console Firebase (https://console.firebase.google.com/). Après ça, installez les outils Firebase CLI et connectez-vous à votre compte Firebase en tapant ces commandes dans votre terminal :

```bash
npm install -g firebase-tools
firebase login
```

Ensuite, initialisez votre projet Firebase avec cette commande :

```bash
firebase init functions
```

Suivez les instructions pour sélectionner votre projet Firebase.

> Note : vous devez passer votre projet Firebase sur la formule Blaze pour pouvoir utiliser les Cloud Functions.

## Configuration de Koa

On a deja un fichier `package.json` dans le dossier `functions` qui a été créé par Firebase CLI, pratique. Placez vous dans le dossier `functions` et installez Koa et le routeur Koa avec cette commande :

```bash
cd functions
npm install koa koa-tree-router
```

## Maintenant, le code !

Ouvrez le fichier `index.js` dans le dossier `functions` et supprimez tout le code présent.

Si vous êtes familier avec Express, vous verrez que Koa est très similaire. Je ne vais donc pas décrire chaque ligne instruction.

> Note : cet exemple utilise les modules ECMAScript. Vous devez donc utiliser Node.js 18 ou supérieur.

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

export const helloWorld = functions.region('europe-west1').https.onRequest(app.callback());
```

Quelques différences avec Express qui méritent d'être notées :

- Koa regroupe les arguments de requête dans un seul objet `ctx` (contexte) au lieu de les séparer en plusieurs objets (req, res, next).
- Vous n'avez pas besoin de parser le corps de la requête avec un middleware. Firebase le fait pour vous et le place dans `ctx.req.body`.
- Koa n'a pas de méthode `send()` pour envoyer une réponse. Vous devez utiliser `ctx.body` et lui assigner une valeur.
- Il faut exporter l'application Koa avec `app.callback()` pour que Firebase puisse l'utiliser et mapper les requêtes HTTP.

## Déploiement

Déployez votre API avec cette commande dans votre terminal :

```bash
firebase deploy --only functions
```

Une fois le déploiement terminé, Firebase vous donnera l'URL de votre API. Vous pourrez accéder à vos endpoints à partir de cette URL.

## Bonus

Si vous voulez pouvoir lancer votre API en local pour la tester, vous pouvez ajouter ce bloc de code à votre fichier `index.js` :

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

## Conclusion

Bam ! Vous avez une API RESTful avec Firebase Cloud Functions et Koa. Rapide et pratique pour développer des petites APIs sans avoir à gérer des serveurs. Vous pouvez maintenant ajouter plus de routes et de fonctionnalités à votre API en fonction de vos besoins.