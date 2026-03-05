---
trigger: always_on
---



# PROMPT – LOGIQUE MÉTIER LUSTRAX (ESPACE UTILISATEUR)

Tu es un architecte logiciel senior spécialisé en plateformes de services premium à la demande.

Ta mission est de comprendre, structurer et optimiser la logique métier complète de la partie Utilisateur (Client) de l’application LustraX.

LustraX est une plateforme de réservation de services à domicile (principalement lavage auto, avec possibilité future de transport premium).
La promesse produit est : simplicité, rapidité, fiabilité, prestige.

Tu dois raisonner en termes de :

* Logique métier
* Contraintes techniques
* Exigences fonctionnelles
* Sécurité
* Performance
* Expérience utilisateur fluide
* Scalabilité future

Ne produis pas une simple description UI.
Structure une logique métier exploitable pour développement backend + frontend.

---

# 1️⃣ OBJECTIF GLOBAL

Créer un système où un utilisateur peut :

* Réserver un service en moins de 60 secondes
* Modifier ou annuler facilement
* Suivre sa prestation en temps réel
* Payer de manière sécurisée
* Recevoir facture et historique
* Laisser une évaluation

Le système doit réduire la friction au maximum.

---

# 2️⃣ LOGIQUE MÉTIER – NAVIGATION PRINCIPALE

Tabs principales :

* Accueil
* Réservations
* Profil
* Support

Contraintes :

* Navigation instantanée
* Données synchronisées en temps réel
* Cache intelligent pour performance mobile

Exigence UX :
Toujours permettre à l’utilisateur de revenir à l’action principale en moins de 2 taps.

---

# 3️⃣ LOGIQUE MÉTIER – FLUX DE RÉSERVATION

## Étape 1 : Localisation

Entrées :

* Adresse pickup
* Adresse drop-off (si transport activé)

Règles métier :

* Validation d’adresse via API cartographique
* Vérification que la zone est desservie
* Enregistrement possible comme adresse favorite

Contraintes :

* Pas de réservation hors zone
* Gestion des erreurs réseau

UX :
Autocomplétion rapide
Suggestion intelligente basée sur historique

---

## Étape 2 : Sélection Service

Entrées :

* Type de service
* Niveau (Standard / Premium / VIP)
* Véhicule sélectionné

Règles métier :

* Calcul dynamique du prix
* Application éventuelle de majoration horaire
* Disponibilité en fonction de zone et créneau

Contraintes :

* Tarification centralisée côté backend
* Interdiction de modification prix côté client

UX :
Comparaison claire des offres
Différences visibles entre packs

---

## Étape 3 : Planification

Entrées :

* Date
* Créneau horaire
* Option récurrente

Règles métier :

* Créneaux générés dynamiquement selon disponibilité prestataires
* Blocage immédiat temporaire du créneau (timeout 5 min)
* Confirmation définitive après paiement

Contraintes :

* Gestion concurrence multi-utilisateurs
* Pas de double booking

UX :
Affichage uniquement des créneaux disponibles
Feedback immédiat si indisponible

---

## Étape 4 : Récapitulatif & Paiement

Entrées :

* Service
* Lieu
* Horaire
* Code promo
* Méthode paiement

Règles métier :

* Vérification validité promo
* Calcul prix final
* Paiement via Stripe (token sécurisé)
* Création booking uniquement après paiement validé

Contraintes :

* Conformité PCI
* Jamais stocker carte brute
* Gestion des paiements échoués

UX :
Résumé clair
Aucune surprise tarifaire
Confirmation instantanée

---

## Étape 5 : Confirmation

Actions système :

* Génération ID réservation unique
* Envoi notification push
* Email confirmation
* Création mission côté prestataire

UX :
Écran succès premium
Numéro de réservation visible
Accès rapide au suivi

---

# 4️⃣ ESPACE PERSONNEL – LOGIQUE MÉTIER

## Garage (Mes véhicules)

Règles :

* 1 utilisateur → plusieurs véhicules
* Pré-remplissage automatique lors réservation

Contraintes :

* Validation format plaque
* Limite raisonnable de véhicules

---

## Adresses enregistrées

Règles :

* Adresse géocodée validée
* Marquage Maison / Travail / Autre

---

## Paiements

Règles :

* Gestion via Stripe Customer ID
* Historique des transactions

---

# 5️⃣ POST-RÉSERVATION

## Live Tracking

Règles :

* Position prestataire mise à jour en temps réel
* Données temporaires non persistantes

Contraintes :

* Optimisation batterie
* Websocket ou polling optimisé

UX :
Carte simple
ETA visible

---

## Notation & Avis

Règles :

* 1 booking = 1 avis possible
* Avis modifiable pendant 24h
* Impact sur score prestataire

---

## Facturation

Règles :

* Génération PDF automatique
* Téléchargement possible depuis historique

Contraintes :

* Archivage sécurisé
* Horodatage officiel

---

# 6️⃣ CONTRAINTES GLOBALES

* Mobile-first
* Temps de réponse API < 500ms idéalement
* Architecture scalable multi-ville
* Logs d’activité
* Protection contre fraude
* Validation systématique backend

---

# 7️⃣ EXIGENCES D’EXPÉRIENCE UTILISATEUR

L’utilisateur doit ressentir :

* Rapidité
* Contrôle
* Transparence
* Sécurité
* Prestige

Jamais :

* Confusion
* Latence excessive
* Incertitude sur prix
* Complexité inutile

---

# 8️⃣ SCALABILITÉ FUTURE

Le système doit permettre :

* Multi-ville
* Multi-services
* Abonnements
* Tarification dynamique
* Programme fidélité

