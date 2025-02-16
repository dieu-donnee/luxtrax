
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
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
        <h1 className="text-3xl font-bold mb-8 text-center">Conditions d'utilisation de LustraX</h1>
        
        <div className="text-sm text-muted-foreground mb-8 text-center">
          Dernière mise à jour : {new Date().toLocaleDateString()}
        </div>

        <p className="mb-8">
          Bienvenue sur <strong>LustraX</strong>, l'application de lavage de voiture à domicile. 
          En utilisant notre service, vous acceptez ces conditions d'utilisation.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptation des conditions</h2>
        <p>
          L'utilisation de LustraX implique l'acceptation totale et sans réserve de ces conditions. 
          Si vous n'êtes pas d'accord, veuillez ne pas utiliser l'application.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description du service</h2>
        <p>
          LustraX permet aux utilisateurs de réserver un lavage de voiture à domicile auprès de 
          professionnels qualifiés. L'application sert d'intermédiaire entre les clients et les prestataires.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Inscription et compte utilisateur</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Vous devez fournir des informations exactes et à jour.</li>
          <li>Vous êtes responsable de la confidentialité de votre compte.</li>
          <li>LustraX se réserve le droit de suspendre ou supprimer tout compte suspect.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Réservation et paiement</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Les services sont réservables via l'application et doivent être payés en ligne.</li>
          <li>En cas d'annulation, des frais peuvent s'appliquer selon les conditions spécifiques de la prestation.</li>
          <li>LustraX n'est pas responsable des litiges entre clients et prestataires.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Obligations des utilisateurs</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Respecter les horaires de rendez-vous.</li>
          <li>Fournir un accès approprié au véhicule à laver.</li>
          <li>Ne pas utiliser l'application à des fins frauduleuses ou illégales.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Responsabilités et garanties</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>LustraX ne garantit pas l'absence d'interruptions ou d'erreurs dans le service.</li>
          <li>LustraX n'est pas responsable des dommages causés par un prestataire tiers.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Modification des conditions</h2>
        <p>
          Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications 
          seront notifiées via l'application.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact</h2>
        <p>
          Pour toute question, contactez-nous à{" "}
          <a href="mailto:lustrax70@gmail.com" className="text-primary hover:underline">
            lustrax70@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
