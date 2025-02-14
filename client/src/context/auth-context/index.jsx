import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });

  console.log(" user:", auth);

  async function handleRegiserUser(event) {
    event.preventDefault();
    const data = await registerService(signUpFormData);

    console.log(data);
  }

  async function handleLoginUser(event) {
    event.preventDefault();

    const data = await loginService(signInFormData);

    if (data.success) {
      console.log("data", data);
      sessionStorage.setItem(
        "accessToken",
        JSON.stringify(data.data.accessToken)
      ); // here backend sends the token when user login that token here sets inside sessionStorage //
      setAuth({
        authenticate: true,
        user: data.data.user,
      });
    } else {
      setAuth({
        authenticate: false,
        user: null,
      });
    }

    // console.log(data);
  }

  // check auth user :
  async function checkAuthUser() {
    const data = await checkAuthService();

    if (data.success) {
      setAuth({
        authenticate: true,
        user: data.data.user,
      });
    } else {
      setAuth({
        authenticate: false,
        data: null,
      });
    }
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegiserUser,
        handleLoginUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
