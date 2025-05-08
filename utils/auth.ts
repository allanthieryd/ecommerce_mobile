import { supabase } from "@/utils/supabase";

// Vérifie si l'utilisateur est connecté
export async function checkUserSession() {
  const { data: sessionData, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  // Vérifier si une session existe et si l'utilisateur est connecté
  const user = sessionData?.session?.user;

  if (!user) {
    throw new Error("Aucun utilisateur connecté.");
  }

  return user;
}