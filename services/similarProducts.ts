import { supabase } from "@/utils/supabase";

export const fetchSimilarProducts = async (productId: number) => {
  // Récupérer le produit d'origine
  const { data: originalProduct, error: originalError } = await supabase
    .from("produits")
    .select("categorie")
    .eq("id_produit", productId)
    .single();

  if (originalError || !originalProduct) {
    throw new Error("Produit introuvable ou erreur de récupération.");
  }

  const categoryId = originalProduct.categorie;

  // Récupérer les produits similaires (même catégorie, autre id)
  const { data: similarProducts, error } = await supabase
    .from("produits")
    .select(
      "categorie, id_produit, nom, description, tarif_utilisateur, tarif_mensuel, tarif_annuel, tarif_appareil, image_url, detail, carousel, date_creation, date_modification"
    )
    .eq("categorie", categoryId)
    .neq("id_produit", productId); // exclure le produit d’origine

  if (error) {
    throw new Error("Erreur lors de la récupération des produits similaires.");
  }

  return similarProducts;
};
