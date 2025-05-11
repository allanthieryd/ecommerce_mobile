import { supabase } from "../utils/supabase"

export async function registerUser(
  email: string,
  password: string,
  nom: string,
  prenom: string,
  role = "utilisateur",
) {
  // Vérification de la force du mot de passe
  const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/
  if (password.length < 6) {
    throw new Error("Le mot de passe doit contenir au moins 6 caractères.")
  }

  if (!passwordRegex.test(password)) {
    throw new Error(
      "Le mot de passe doit contenir au moins un caractère spécial.",
    )
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  if (data?.user) {
    alert(
      "Un email de confirmation a été envoyé. Merci de vérifier votre messagerie avant de vous connecter.",
    )
  }

  const user = data?.user

  if (!user) {
    throw new Error("Échec de la création de l'utilisateur")
  }

  const { error: insertError } = await supabase.from("utilisateurs").insert([
    {
      id_utilisateur: user.id,
      email,
      nom,
      prenom,
      role,
    },
  ])

  if (insertError) {
    throw new Error(insertError.message)
  }

  return user
}