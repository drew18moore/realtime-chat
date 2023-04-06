import React, { ReactNode, useContext, useEffect, useState } from "react";

const AuthContext = React.createContext<any>(undefined);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState({});

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
