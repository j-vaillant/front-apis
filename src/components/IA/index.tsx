import React, { ChangeEvent, FormEventHandler, useState } from "react";

const IA = () => {
  const [image, setImage] = useState<File | null>(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const file = target.files && target.files[0];
    setImage(file);
    setPrediction(null); // Réinitialise les prédictions
  };

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    if (!image) {
      alert("Veuillez sélectionner une image.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:3001/predict", {
        body: formData,
        method: "post",
      });

      const json = await response.json();

      setPrediction(json.results);
    } catch (error) {
      console.error("Erreur lors de la prédiction:", error);
      alert("Une erreur est survenue lors de la prédiction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-uploader">
      <h1>Reconnaissance de Fruits</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Analyse en cours..." : "Envoyer"}
        </button>
      </form>

      {prediction && (
        <div className="results">
          <h2>Résultats :</h2>
          <ul>
            {/** @ts-ignore */}
            {prediction.map((result, index) => (
              <li key={index}>
                {result.class}: {((result?.score ?? 0) * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default IA;
