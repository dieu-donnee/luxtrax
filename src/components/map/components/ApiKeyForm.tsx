
import { useState } from "react";

interface ApiKeyFormProps {
  setMapApiKey: (key: string) => void;
}

const ApiKeyForm = ({ setMapApiKey }: ApiKeyFormProps) => {
  const [manualApiKey, setManualApiKey] = useState<string>("");

  const handleSubmit = () => {
    if (manualApiKey) {
      localStorage.setItem("GOOGLE_MAPS_API_KEY", manualApiKey);
      setMapApiKey(manualApiKey);
    }
  };

  return (
    <div className="w-full h-56 bg-gray-50 flex flex-col items-center justify-center p-4 border rounded-md">
      <p className="mb-2 text-sm text-gray-700">Veuillez entrer votre clé API Google Maps pour activer la carte</p>
      <div className="flex w-full max-w-md">
        <input
          type="text"
          value={manualApiKey}
          onChange={(e) => setManualApiKey(e.target.value)}
          placeholder="Entrez votre clé API Google Maps"
          className="flex-1 px-3 py-2 border rounded-l-md text-sm"
        />
        <button
          className="bg-blue-600 text-white px-3 py-2 rounded-r-md text-sm"
          onClick={handleSubmit}
        >
          Valider
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Vous pouvez obtenir une clé API sur la{" "}
        <a
          href="https://console.cloud.google.com/google/maps-apis/credentials"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          console Google Cloud
        </a>
      </p>
    </div>
  );
};

export default ApiKeyForm;
