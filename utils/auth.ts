import { supabase } from "@/utils/supabase";

// Vérifie si l'utilisateur est connecté
export async function checkUserSession() {
  const { data: sessionData, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Erreur lors de la récupération de la session :", error.message);
    return null;
  }

  const user = sessionData?.session?.user;

  return user ?? null;
}
