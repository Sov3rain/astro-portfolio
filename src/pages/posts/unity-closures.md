---
layout: "@layouts/PostLayout.astro"
title: "Unity closures"
date: 2022-06-21
---

Quand la programmation fonctionnelle te fait froncer les sourcils.

## C'est quoi une closure ?

Une closure c'est tout simplement une fonction anonyme qui capture une variable d'un autre scope.

Prenons un exemple d'un script qui ajoute un callback sur un bouton :

```csharp
    // MyBehaviour.cs
    
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

Ici, l'expression lambda dans `AddListener` reçoit une référence à la variable `_number`, faisant d'elle une closure.

## Le problème

Si on clique sur le bouton 3 fois, `_number` sera égal à 3. Jusque la, tout va bien. Maintenant si on détruit `MyBehaviour.cs`, que l'on crée une nouvelle instance et que l'on clique sur le bouton, `_number` sera égal à 4, alors que la valeur attendue est 1 !

## Mais pourquoi ?

Si l'on détruit l'instance de `MyBehaviour` mais pas le bouton `_button`, la variable `_number` capturée n'est pas détruite et existe toujours dans le `delegate` qui est passé en paramètre de `AddListener()`.

Par la suite, chaque incrément se fera sur cette variable interne et non sur la variable membre de la nouvelle instance de `MyBehaviour`. On dit alors que la variable est "hoisted", sa durée de vie étant étendue tant que le `delegate` est en vie.

## Solution

La solution est plutôt simple, il faut détruire toutes les références restantes. Ici il suffit de détruire les delegates qui sont dans le bouton :

```csharp
    // MyBehaviour.cs

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
