import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    User
  } from "firebase/auth";
  import { FirebaseError } from "firebase/app";
  import { app } from "../../../firebaseConfig";
  
  const auth = getAuth(app);
  
  interface AuthService {
    signUp: (email: string, password: string, name: string) => Promise<User>;
    signIn: (email: string, password: string) => Promise<User>;
  }
  
  export const firebaseAuth: AuthService = {
    signUp: (email, password) => 
      createUserWithEmailAndPassword(auth, email, password)
        .then(({ user }) => user),
    
    signIn: (email, password) => 
      signInWithEmailAndPassword(auth, email, password)
        .then(({ user }) => user)
  };
  
  export type { FirebaseError };