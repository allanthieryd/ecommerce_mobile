import { supabase } from '@/utils/supabase';

export const fetchProducts = async (params?: {
  id?: number;
  categorie?: number;
  category?: string | string[];
  searchQuery?: string;
}) => {
  let query = supabase
    .from('produits')
    .select(
      'categorie, id_produit, nom, description, tarif_utilisateur, tarif_mensuel, tarif_annuel, tarif_appareil, image_url, detail, carousel, date_creation, date_modification',
    );

  const { id, categorie, category, searchQuery } = params || {};

  if (id) {
    query = query.eq('id_produit', id);
  }

  if (category) {
    const names = Array.isArray(category) ? category : [category];

    const { data: matchedCategories, error } = await supabase
      .from('categories')
      .select('id_categorie')
      .in('nom', names);

    if (error) throw new Error("Erreur lors de la récupération des catégories");

    if (!matchedCategories?.length) return [];

    const categoryIds = matchedCategories.map((cat) => cat.id_categorie);
    query = query.in('categorie', categoryIds);
  } else if (categorie) {
    query = query.eq('categorie', categorie);
  }

  if (searchQuery) {
    query = query.ilike('nom', `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) throw new Error("Erreur lors de la récupération des produits");
  return data;
};

export const addProduct = async (product: {
  categorie: number;
  nom: string;
  description: string;
  tarif_utilisateur: number;
  detail?: string;
  carousel?: string[];
  image_url?: string;
}) => {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('produits')
    .insert([{ ...product, date_creation: now, date_modification: now }])
    .select();

  if (error) throw new Error("Erreur lors de l'ajout du produit");
  return data;
};

export const updateProduct = async (product: {
  id_produit: number;
  categorie?: number;
  nom?: string;
  description?: string;
  tarif_utilisateur?: number;
  detail?: string;
  carousel?: string[];
  image_url?: string;
}) => {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('produits')
    .update({ ...product, date_modification: now })
    .eq('id_produit', product.id_produit)
    .select();

  if (error) throw new Error("Erreur lors de la mise à jour du produit");
  return data;
};

export const deleteProduct = async (id_produit: number) => {
  const { error } = await supabase
    .from('produits')
    .delete()
    .eq('id_produit', id_produit);

  if (error) throw new Error("Erreur lors de la suppression du produit");
};
