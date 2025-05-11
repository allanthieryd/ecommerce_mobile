import { supabase } from '@/utils/supabase';

export const fetchCart = async (userId: string) => {
  const { data, error } = await supabase
    .from('panier')
    .select('id_article, id_commande, id_produit, quantite, prix_unitaire, nom, id_utilisateur')
    .eq('id_utilisateur', userId);

  if (error) throw new Error("Erreur lors de la récupération du panier");
  return data;
};

export const addToCart = async (item: {
  id_produit: number;
  quantite: number;
  prix_unitaire: number;
  nom: string;
  id_utilisateur: string;
}) => {
  const { data, error } = await supabase
    .from('panier')
    .insert([item])
    .select();

  if (error) throw new Error("Erreur lors de l'ajout au panier");
  return data;
};

export const updateCartItem = async (item: {
  id_commande: number;
  quantite?: number;
  prix_unitaire?: number;
}) => {
  const { data, error } = await supabase
    .from('panier')
    .update(item)
    .eq('id_commande', item.id_commande)
    .select();

  if (error) throw new Error("Erreur lors de la mise à jour du panier");
  return data;
};

export const deleteCartItem = async (id_commande: number, id_produit: number) => {
    const { error } = await supabase
      .from('panier')
      .delete()
      .eq('id_commande', id_commande)
      .eq('id_produit', id_produit);
  
    if (error) throw new Error("Erreur lors de la suppression de l'article du panier");
  };  

export const clearCart = async (userId: string) => {
  const { error } = await supabase
    .from('panier')
    .delete()
    .eq('id_utilisateur', userId);

  if (error) throw new Error("Erreur lors de la suppression du panier");
};
