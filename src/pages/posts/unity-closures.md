---
layout: "@layouts/PostLayout.astro"
title: "Unity closures"
date: 2022-06-21
description: "Comprendre les closures en C# et leur utilisation dans Unity. Exemples pratiques et bonnes pratiques pour éviter les pièges de performance."
---

Prenons l'exemple d'un script qui ajoute un callback sur un bouton :

```csharp
Button _button;
int _number = 0;

void Start()
{
    _button = GameObject.Find("Button");
    _button.onClick.AddListener(() => {
        _number++;
        Debug.Log(_number);
    });
}

// On click:
// 1
// 2
// 3...
```

Ici, l'expression capture la variable `_number`, faisant d'elle une closure. Si on clique sur le bouton 3 fois, `_number` sera égal à 3. Jusque la, tout va bien. Maintenant si on détruit `MyBehaviour.cs`, que l'on crée une nouvelle instance et que l'on clique sur le bouton, `_number` sera égal à 4, alors que la valeur attendue est 1.

La variable `_number` capturée existe toujours en mémoire, car référencée par la fonction anonyme.

## Solution

La solution est plutôt simple, il faut détruire toutes les références restantes. Ici il suffit de détruire les delegates du bouton :

```diff
Button _button;
int _number = 0;

void Start()
{
    _button = GameObject.Find("Button");
+   _button.onClick.RemoveAllListeners();
    _button.onClick.AddListener(() => {
        _number++;
        Debug.Log(_number);
    });
}
```
