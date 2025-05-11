import React from 'react';
import { ScrollView, useWindowDimensions, useColorScheme } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { simpleSanitize } from '../utils/sanitizer'; // Chemin vers ton fichier sanitizer.ts

type ProduitProps = {
  produit: {
    detail: string;
    nom: string;
    description: string;
    // ajoute les autres champs si nécessaires
  };
};

export const ProductDetailText = ({ produit }: ProduitProps) => {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme(); // Récupère le thème (clair ou sombre)

  // Utilisation du sanitizer maison
  const cleanedHtml = simpleSanitize(produit.detail);

  // Définir les couleurs en fonction du thème
  const titleColor = colorScheme === 'dark' ? '#ffffff' : '#1f2937'; // Blanc pour le thème sombre, gris foncé pour le thème clair
  const textColor = colorScheme === 'dark' ? '#e5e7eb' : '#4b5563'; // Gris clair pour sombre, gris moyen pour clair

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff' }}>
      <RenderHTML
        contentWidth={width}
        source={{ html: cleanedHtml }}
        tagsStyles={{
          h2: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 12,
            marginTop: 20,
            color: titleColor, // Utilise la couleur dynamique du titre
          },
          p: {
            fontSize: 16,
            color: textColor, // Utilise la couleur dynamique du texte
            marginBottom: 10,
          },
          ul: {
            paddingLeft: 20,
            marginBottom: 10,
          },
          li: {
            fontSize: 16,
            color: textColor, // Utilise la couleur dynamique des éléments de la liste
            marginBottom: 6,
          },
          span: {
            color: '#60a5fa', // Garde la couleur bleue pour le span
            fontWeight: '600',
          },
        }}
      />
    </ScrollView>
  );
};
