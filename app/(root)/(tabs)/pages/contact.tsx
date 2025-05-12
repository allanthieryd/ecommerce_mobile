import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [num, setNum] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ success: false, message: "" });

  const handleSubmit = () => {
    setIsSubmitting(true);
    setStatus({ success: false, message: "" });

    // Validation des champs obligatoires
    if (!email || !nom || !prenom) {
      setStatus({
        success: false,
        message: "Veuillez remplir tous les champs obligatoires."
      });
      setIsSubmitting(false);
      return;
    }

    // Simulation d'envoi
    setTimeout(() => {
      setStatus({
        success: true,
        message: "Votre message a été envoyé avec succès! (simulation)"
      });
      
      // Réinitialiser le formulaire
      setEmail("");
      setNom("");
      setPrenom("");
      setNum("");
      setMessage("");
      setIsSubmitting(false);
      
      Alert.alert("Succès", "Votre message a été envoyé avec succès!");
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Formulaire de{" "}
            <Text style={styles.headerHighlight}>Contact</Text>
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          {status.message ? (
            <View style={[
              styles.statusBox,
              status.success ? styles.successBox : styles.errorBox
            ]}>
              <Text style={status.success ? styles.successText : styles.errorText}>
                {status.message}
              </Text>
            </View>
          ) : null}
          
          <Text style={styles.label}>
            Nom <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={nom}
            onChangeText={setNom}
            placeholder="Votre nom"
            placeholderTextColor="#9CA3AF"
          />
          
          <Text style={styles.label}>
            Prénom <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={prenom}
            onChangeText={setPrenom}
            placeholder="Votre prénom"
            placeholderTextColor="#9CA3AF"
          />
          
          <Text style={styles.label}>
            E-mail <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Votre email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Text style={styles.label}>Numéro de téléphone</Text>
          <TextInput
            style={styles.input}
            value={num}
            onChangeText={setNum}
            placeholder="Votre numéro de téléphone"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />
          
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={styles.messageInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Votre message"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          
          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>Envoyer</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB"
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 24,
    paddingHorizontal: 16
  },
  header: {
    marginBottom: 24,
    alignItems: "center"
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold"
  },
  headerHighlight: {
    color: "#02ff1e",
    fontWeight: "bold"
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    color: "#8B5CF6", // violet
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 6,
    fontSize: 16
  },
  required: {
    color: "#EF4444", // red
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#EDE9FE", // equivalent to bg-violet-100
    borderRadius: 4,
    padding: 10,
    color: "#4B5563",
    fontSize: 16
  },
  messageInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#EDE9FE",
    borderRadius: 4,
    padding: 10,
    color: "#4B5563",
    minHeight: 120,
    fontSize: 16
  },
  button: {
    backgroundColor: "#8B5CF6", // violet
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: "center",
    marginTop: 24,
    minWidth: "60%",
    alignItems: "center"
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16
  },
  statusBox: {
    padding: 12,
    borderRadius: 4,
    marginBottom: 16
  },
  successBox: {
    backgroundColor: "#D1FAE5"
  },
  errorBox: {
    backgroundColor: "#FEE2E2"
  },
  successText: {
    color: "#047857"
  },
  errorText: {
    color: "#B91C1C"
  }
});