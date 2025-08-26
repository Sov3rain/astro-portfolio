---
layout: "@layouts/PostLayout.astro"
title: "Genèse"
date: 2021-04-14T14:53:23+02:00
description: "Découverte de l'architecture Jamstack et choix d'Hugo pour créer un site statique simple et efficace, hébergé gratuitement sur Netlify."
---

N’étant pas développeur web de formation, je ne souhaitais pas m’orienter vers une solution dynamique impliquant l'utilisation d'une base de données ou d'un CMS comme WordPress.

J’ai préféré opter pour une approche plus simple dans sa mise en œuvre : le site statique. Je ne souhaitais pas non plus concevoir l’ensemble à la main en HTML/CSS. Il devait exister des outils permettant de simplifier cette démarche.

## Générateurs

En explorant les différentes options, j’ai découvert l’architecture [Jamstack](https://jamstack.org/), dont les principes m’ont rapidement convaincu. Mon choix s’est porté sur [Hugo](https://gohugo.io/) pour sa simplicité, sa documentation complète et sa communauté active.

Hugo permet d’utiliser des [thèmes](https://themes.gohugo.io/), généralement gratuits, que l’on peut adapter à ses besoins. J’ai ainsi démarré avec un [thème existant](https://github.com/rhazdon/hugo-theme-hello-friend-ng), que j’ai progressivement personnalisé en modifiant certains gabarits.

Le contenu est rédigé en Markdown, ce qui est pratique si l’on veut éditer le contenu directement dans un éditeur de texte.

## Hébergement

Le site étant constitué de fichiers statiques, son hébergement est particulièrement simple. De nombreuses plateformes proposent des solutions gratuites dans ce cas de figure. J’ai choisi [Netlify](https://www.netlify.com/), notamment pour son intégration avec GitHub et sa gestion automatique du déploiement à partir des sources.

Le trafic étant modeste, l’hébergement ne génère aucun coût.