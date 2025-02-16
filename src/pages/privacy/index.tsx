
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        ← Retour
      </Button>

      <div className="prose prose-sm sm:prose lg:prose-lg mx-auto dark:prose-invert">
        <h1 className="text-3xl font-bold mb-8 text-center">RÈGLES DE CONFIDENTIALITÉ DE LUSTRAX</h1>
        
        <div className="text-sm text-muted-foreground mb-8 text-center">
          Dernière mise à jour : {new Date().toLocaleDateString()}
        </div>

        <p className="mb-8">
          Chez LustraX, nous attachons une grande importance à la protection de vos données personnelles. 
          Cette politique de confidentialité décrit comment nous collectons, utilisons, protégeons et 
          partageons vos informations lorsque vous utilisez notre application mobile.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. INFORMATIONS QUE NOUS COLLECTONS</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">1.1 Informations fournies par l'utilisateur</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Nom, prénom</li>
          <li>Adresse e-mail</li>
          <li>Numéro de téléphone</li>
          <li>Adresse de service (pour l'intervention à domicile)</li>
          <li>Informations de paiement (cryptées et gérées par un prestataire sécurisé)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">1.2 Informations collectées automatiquement</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Données de navigation (adresse IP, type d'appareil, système d'exploitation)</li>
          <li>Localisation (uniquement si l'utilisateur autorise le suivi pour l'optimisation du service)</li>
          <li>Historique des réservations et préférences</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. UTILISATION DES DONNÉES</h2>
        <p>Nous utilisons vos données personnelles pour :</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Fournir, gérer et améliorer nos services de lavage à domicile</li>
          <li>Traiter vos paiements et gérer vos réservations</li>
          <li>Vous envoyer des notifications liées à votre réservation</li>
          <li>Améliorer l'expérience utilisateur et proposer des offres personnalisées</li>
          <li>Assurer la sécurité et prévenir les fraudes</li>
          <li>Respecter nos obligations légales</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. PARTAGE DES DONNÉES</h2>
        <p>
          Vos informations ne sont <strong>jamais</strong> vendues à des tiers. Nous pouvons partager 
          certaines données uniquement avec :
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Prestataires de services</strong> (paiement sécurisé, hébergement des données, support client)</li>
          <li><strong>Autorités légales</strong> en cas d'obligation légale</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. SÉCURITÉ DES DONNÉES</h2>
        <p>Nous mettons en place des mesures de sécurité avancées pour protéger vos données :</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Cryptage des données sensibles</li>
          <li>Protection contre les accès non autorisés</li>
          <li>Stockage sécurisé sur des serveurs conformes aux normes de sécurité</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. VOS DROITS</h2>
        <p>Conformément au RGPD et aux lois en vigueur, vous avez le droit de :</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Accéder à vos données personnelles</li>
          <li>Modifier ou corriger vos informations</li>
          <li>Supprimer votre compte et vos données</li>
          <li>Retirer votre consentement au traitement de certaines données</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. COOKIES ET TECHNOLOGIES SIMILAIRES</h2>
        <p>
          Notre application utilise des cookies et des technologies de suivi pour améliorer votre expérience. 
          Vous pouvez gérer vos préférences depuis les paramètres de l'application.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. MODIFICATIONS DES RÈGLES DE CONFIDENTIALITÉ</h2>
        <p>
          Nous pouvons mettre à jour cette politique à tout moment. En cas de modifications majeures, 
          nous vous informerons par e-mail ou via l'application.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. CONTACT</h2>
        <p>
          Pour toute question concernant cette politique de confidentialité, vous pouvez nous contacter à{" "}
          <a href="mailto:lustrax70@gmail.com" className="text-primary hover:underline">
            lustrax70@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
