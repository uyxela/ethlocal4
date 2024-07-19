import { useContext, createContext, type PropsWithChildren } from "react";

const AuthContext = createContext<{
  login: () => void;
  logout: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  login: () => null,
  logout: () => null,
  session: null,
  isLoading: false,
});

export function useAuth() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
  return (
    <AuthContext.Provider
      value={{
        login: () => {},
        logout: () => {},
        session: null,
        isLoading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
