# Luxtrax - Réservation de Lavage Auto à Domicile

## Description du Projet
Luxtrax est une plateforme de mise en relation (Marketplace) spécialisée dans la **réservation de services de lavage de voiture à domicile**. 

La plateforme permet aux utilisateurs de commander un lavage professionnel pour leur véhicule sans se déplacer, et aux prestataires qualifiés de proposer leurs services de nettoyage.

## Fonctionnalités Clés (Infrastructure)
Ce dépôt contient l'ossature technique de la plateforme :
- **Authentification & Profils** : Rôles Clients, Prestataires et Admins.
- **Base de Données (Supabase)** : Schéma optimisé pour les réservations, les avis et les transactions.
- **Système de Paiement** : Intégration prévue pour Mobile Money (MTN/Moov), Cartes et Espèces.
- **Vérification & Confiance** : Système de validation des documents prestataires et Wiki de présentation.
- **Gestion des Réservations** : Workflow complet de la commande à la réalisation du service.

## Technologies Utilisées
- **Frontend** : Vite, React, TypeScript, Tailwind CSS, shadcn-ui.
- **Backend / Database** : Supabase (PostgreSQL) avec Politiques de Sécurité (RLS).
- **Intégrations** : Lovable, Supabase Client.

## Structure du Projet
Le projet a été nettoyé pour ne conserver que les éléments essentiels au fonctionnement de la base de données et de l'infrastructure Lovable :
- `supabase/` : Migrations et configuration de la base de données.
- `src/integrations/` : Clients et types pour Supabase.
- `src/types/` & `src/lib/` : Types TypeScript et utilitaires cœurs.
- `.agent/` & `.agents/` : Instructions pour l'IA et workflows de développement.

---
**Développé avec Lovable**
