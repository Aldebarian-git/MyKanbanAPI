# Modèle Conceptuel de Données (MCD)

## Etapes de création

- Définir les entités
- Définir les attributs des entités
- Définir un discriminant par entité
- Définir les associations entre les entités et leurs cardinalités

## Version MoCoDo

```
LISTE: code liste, titre, position
CONTIENT, 0N LISTE, 11 CARTE
CARTE: code carte, contenu, position, couleur
POSSEDE, 0N CARTE, 0N LABEL
LABEL: code label, nom, couleur
```

## Version visuelle

![MCD](./MCD.svg)