import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { loginService, registerService, checkAuthService } from "@/services";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  // console.log("sign up form data :", signUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });

  // add state for activeTab :
  const [activeTab, setActiveTab] = useState("signin");

  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(event) {
    event.preventDefault();

    // console.log("Sign-up form submitted!"); // Check if this logs

    // console.log("Sign-up form data before sending:", signUpFormData); // Debugging log

    const data = await registerService(signUpFormData); // Call API

    console.log("Register API response:", data); // Log API response

    if (data.success) {
      console.log("User registered successfully!");
      setActiveTab("signin");
    } else {
      console.error("User registration failed:", data.message);
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);
      console.log("login :", data);

      if (data.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
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
    } catch (error) {
      console.error("Login error:", error);
      setAuth({
        authenticate: false,
        user: null,
      });
    }
  }

  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });

        setLoading(false);
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });

        setLoading(false);
      }
    } catch (error) {
      console.log(error);

      if (!error?.response?.data?.success) {
        setAuth({
          authenticate: false,
          user: null,
        });
      }

      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  // for logout :
  const resetCredential = () => {
    setAuth({
      authenticate: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,

        activeTab,
        setActiveTab,

        resetCredential,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
