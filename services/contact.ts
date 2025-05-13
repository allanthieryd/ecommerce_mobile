import { supabase } from '@/utils/supabase';

export interface ContactMessage {
    nom: string;
    prenom: string;
    email: string;
    num: string;
    message: string;
}
  
  export const fetchMessage = async () => {
    const { data, error } = await supabase
      .from("contact")
      .select("message, nom, prenom, email, num");
  
    if (error) throw new Error("Erreur lors de la récupération des contacts");
    return data;
  };
  
  export const addMessage = async (messageData: ContactMessage) => {
    const { error } = await supabase
      .from("contact")
      .insert([messageData]);
  
    if (error) throw new Error("Erreur lors de l'envoi du message");
  };
  