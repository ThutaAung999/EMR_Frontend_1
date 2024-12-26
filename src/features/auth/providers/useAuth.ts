import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../providers/AuthContext';

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  console.log("context :", context);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
