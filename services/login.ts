// auth.ts
import { supabase } from "../utils/supabase"

// Fonction de connexion avec email et mot de passe
export async function loginUser(email: string, password: string) {
  const { data } = await supabase.auth.signInWithPassword({ email, password })
  const user = data?.user

  if (!user) {
    throw new Error("Utilisateur ou mot de passe incorrect.")
  }

  if (!user.email_confirmed_at) {
    throw new Error("Confirmer votre adresse email pour vous connecter.")
  }

  const { data: userDetails, error: userError } = await supabase
    .from("utilisateurs")
    .select("id_utilisateur, email, role")
    .eq("id_utilisateur", user.id)
    .single()

  if (userError || !userDetails) {
    throw new Error("Utilisateur non trouvé dans la base de données.")
  }

  return {
    id: userDetails.id_utilisateur,
    email: userDetails.email,
    role: userDetails.role,
  }
}