---
layout: "@layouts/PostLayout.astro"
title: ScriptableObject Singletons
date: 2021-04-14T16:21:32+02:00
description: "Alternative aux MonoBehaviour singletons dans Unity : utiliser des ScriptableObject pour créer des singletons plus flexibles et indépendants des scènes."
---

Dans toutes les applications, il arrive un moment où un accès global à un composant est nécessaire. Configuration, gestion de données partagées entre scènes, etc. Le réflexe d'un développeur Unity est souvent de créer un `MonoBehaviour` singleton.

Mon approche est plutôt de créer un singleton basé sur un `ScriptableObject`. Contrairement à un `MonoBehaviour`, un `ScriptableObject` n’est pas lié à une scène. Cela évite de devoir gérer une instance dans la hiérarchie, ce qui simplifie l’architecture du projet. 

Un `ScriptableObject` est chargé en mémoire lorsqu’il est référencé, puis libéré par le garbage collector lorsqu’il ne l’est plus.

## Implémentation

Par défaut, un `ScriptableObject` n’est accessible que via des références définies dans l’inspecteur. Pour le rendre accessible globalement, une approche consiste à encapsuler la logique du singleton dans une classe générique et d'exposer une propriété statique `Instance` qui retourne l’instance unique.

Le flag `HideFlags.DontUnloadUnusedAsset` garantit que l’instance ne sera pas libérée de la mémoire tant que l’application est lancée.

Voici une classe de base générique :

```csharp
using System;
using System.Linq;
using UnityEngine;

public abstract class ScriptableObjectSingleton<T> : ScriptableObject
  where T : ScriptableObjectSingleton<T>
{
    private static T _instance;

    public static T Instance
    {
        get
        {
            if (_instance) return _instance;

            _instance = Resources.LoadAll<T>("").FirstOrDefault();
            if (!_instance) throw new Exception($"Cannot find instance of {typeof(T)} in Resources.");
            _instance.hideFlags = HideFlags.DontUnloadUnusedAsset;
            
            return _instance;
        }
    }
}
```

Cette implémentation recherche la première instance présente dans le dossier `Resources`, mais ne crée pas d’instance à la volée.

## Exemple

Supposons un système d’inventaire :

```csharp
using UnityEngine;

[CreateAssetMenu(menuName = "Inventory")]
public class Inventory : ScriptableObjectSingleton<Inventory>
{
    public int NumberOfItems;
    public string PlayerName;
}
```

Créer une instance dans le projet via un clic droit dans l’éditeur `Create > Inventory`.

Accéder aux données depuis n’importe quel script :

```csharp
void Start()
{
    Debug.Log(Inventory.Instance.NumberOfItems);
}
```
