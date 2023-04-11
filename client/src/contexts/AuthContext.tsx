import React, { ReactNode, useContext, useEffect, useState } from "react";

type AuthContextType = {
  currentUser: User | undefined;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

const AuthContext = React.createContext<any>(undefined);

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);
  
  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
