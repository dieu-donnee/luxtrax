---
name: refactoring_and_repair
description: Expertise en réparation d'erreurs avancée et refactorisation de code post-implémentation.
---

# Skill : Réparation d'Erreurs Avancée et Refactorisation

Ce skill doit être invoqué après chaque implémentation de code significatif pour garantir la qualité, la performance et la robustesse de l'application LustraX.

## 1. Audit Post-Implémentation (Checklist)

Après avoir écrit du code, effectuez systématiquement les vérifications suivantes :

- **Syntaxe & Types** : Le code compile-t-il sans erreurs TypeScript ? Les types sont-ils explicites (éviter `any`) ?
- **Patterns Supabase** : Les appels à la base de données sont-ils optimisés ? La gestion des erreurs (`error`) est-elle présente ?
- **Hooks React** : Les dépendances des `useEffect` et `useCallback` sont-elles complètes ?
- **Accessibilité & SEO** : Les balises HTML sont-elles sémantiques ? Les identifiants sont-ils uniques ?

## 2. Logique de Réparation

Si une erreur est détectée :
1. **Identifier la cause racine** : Ne pas se contenter de "patcher" le symptôme.
2. **Vérifier les effets de bord** : Est-ce que la correction impacte d'autres composants ?
3. **Appliquer la solution la plus robuste** : Privilégier la clarté et la maintenance sur la brièveté.

## 3. Standards de Refactorisation

Optimiser le code selon les principes suivants :
- **DRY (Don't Repeat Yourself)** : Extraire la logique commune dans des hooks ou des utilitaires.
- **KISS (Keep It Simple, Stupid)** : Simplifier les structures complexes ou les fonctions trop longues.
- **Performance** : Utiliser `lazy` loading pour les pages, optimiser les requêtes QueryClient.
- **Esthétique (Premium)** : S'assurer que le code reflète la promesse "Premium" de LustraX (propreté, organisation).

## 4. Workflow d'Exécution

À chaque fois que vous terminez une tâche de développement :
1. **Auto-Audit** : Relisez votre propre code à travers le prisme de ce skill.
2. **Correction Immédiate** : Si vous voyez une amélioration possible, appliquez-la AVANT de notifier l'utilisateur.
3. **Validation** : Vérifiez que les changements ne cassent pas les fonctionnalités existantes.
