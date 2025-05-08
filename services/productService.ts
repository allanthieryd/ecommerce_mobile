/* eslint-disable no-console */
import { supabase } from "@/utils/supabase"

export const uploadProductImage = async (
  file: File,
  productId: number,
): Promise<string | null> => {
  if (!file) return null

  const filePath = `produits/${productId}/${file.name}`

  // Upload du fichier dans le bucket Supabase
  const { error } = await supabase.storage
    .from("produits-images") // Nom du bucket
    .upload(filePath, file, { upsert: false })

  if (error) {
    console.error("Erreur d'upload :", error)
    return null
  }

  // Mise à jour de la colonne image_url dans la table produits
  const { error: updateError } = await supabase
    .from("produits")
    .update({ image_url: filePath })
    .eq("id_produit", productId)

  if (updateError) {
    console.error("Erreur de mise à jour du produit :", updateError)
    return null
  }

  return filePath
}

export const getProductImageUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from("produits-images")
    .getPublicUrl(filePath)
  return data.publicUrl
}
