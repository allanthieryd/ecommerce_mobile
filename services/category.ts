import { supabase } from '@/utils/supabase';

interface Category {
  id_categorie: number;
  nom: string;
  description: string;
  date_creation: string;
  date_modification: string;
  image_url?: string;
  detail?: string;
}

export const getCategories = async (search?: string): Promise<Category[]> => {
  try {
    let query = supabase
      .from("categories")
      .select("id_categorie, nom, description, date_creation, date_modification, image_url, detail");

    if (search) {
      query = query.ilike("nom", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    throw new Error("Erreur lors de la récupération des catégories");
  }
};

export const getCategoryById = async (id: number): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id_categorie, nom, description, date_creation, date_modification, image_url, detail")
      .eq("id_categorie", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data ?? null;
  } catch (error) {
    console.error("Erreur lors de la récupération de la catégorie:", error);
    throw new Error("Erreur lors de la récupération de la catégorie");
  }
};

export const createCategory = async (nom: string, description: string, image_url?: string, detail?: string): Promise<Category> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .insert([
        {
          nom,
          description,
          image_url,
          detail,
          date_creation: new Date().toISOString(),
          date_modification: new Date().toISOString(),
        },
      ])
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error);
    throw new Error("Erreur lors de la création de la catégorie");
  }
};

export const updateCategory = async (
  id_categorie: number,
  nom: string,
  description: string,
  detail?: string,
  image_url?: string
): Promise<Category> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .update({
        nom,
        description,
        detail,
        image_url,
        date_modification: new Date().toISOString(),
      })
      .eq("id_categorie", id_categorie)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la catégorie:", error);
    throw new Error("Erreur lors de la mise à jour de la catégorie");
  }
};

export const deleteCategory = async (id_categorie: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id_categorie", id_categorie);

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de la catégorie:", error);
    throw new Error("Erreur lors de la suppression de la catégorie");
  }
};

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
