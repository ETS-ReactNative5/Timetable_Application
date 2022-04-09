import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";

// Navigation
import { useNavigation } from "@react-navigation/core";

// Firebase
import {
  auth,
  database,
  ref,
  set,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "../firebase";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User logged in
        const uid = user.uid;

        // Save user under users in database
        set(ref(database, "users/" + uid), {
          // Save the users email
          email: user.email,
        });

        // Move to home screen
        navigation.replace("HomeTabs");
      } else {
        // User is logged out
      }
    });
  }, []);

  // Register
  const registerUser = () => {
    createUserWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        // Register user
        const user = userCredential.user;
        console.log("Register: ", user.email, user.pass);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error: ", errorCode, errorMessage);

        // Display error message to user
        alert(error.message);
      });
  };

  // Login
  const loginUser = () => {
    signInWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        // Logged in
        const user = userCredential.user;
        console.log("Login: ", user.email, user.pass);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error: ", error.code, error.message);

        // Display error message to user
        alert(error.message);
      });
  };

  // forgotPassword
  const forgotPassword = () => {
    console.log("Pressed Forgot Password");
    navigation.replace("ForgotPassword");
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* Email */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />

        {/* Password */}
        <TextInput
          placeholder="Password"
          value={pass}
          onChangeText={(text) => setPass(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      {/* Login Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={loginUser} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Register Button */}
        <TouchableOpacity
          onPress={registerUser}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>

        {/* Forgot Password Button */}
        <TouchableOpacity onPress={forgotPassword} style={[styles.forgotText]}>
          <Text>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#646a6e",
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#2b7eba",
    width: "100%",
    padding: 15,
    borderRadius: 10,
  },
  buttonOutline: {
    backgroundColor: "grey",
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  forgotText: {
    marginTop: 30,
    color: "black",
    fontWeight: "600",
    fontSize: 14,
  },
});
