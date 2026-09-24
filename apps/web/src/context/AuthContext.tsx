import React, { createContext, useContext, useState, useEffect } from 'react';
import { request } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  jobTitle?: string;
  isSuperAdmin: boolean;
}

interface Workspace {
  id: string;
  name: string;
  slug: string;
  role: string;
  logo?: string;
}

interface AuthContextType {
  user: User | null;
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User, workspaces: Workspace[]) => void;
  logout: () => void;
  selectWorkspace: (workspace: Workspace) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('chatbots_token'));
  const [loading, setLoading] = useState(true);

  const selectWorkspace = (ws: Workspace) => {
    setCurrentWorkspace(ws);
    localStorage.setItem('chatbots_workspace_id', ws.id);
  };

  const login = (newToken: string, newUser: User, newWorkspaces: Workspace[]) => {
    setToken(newToken);
    setUser(newUser);
    setWorkspaces(newWorkspaces);
    localStorage.setItem('chatbots_token', newToken);

    if (newWorkspaces.length > 0) {
      selectWorkspace(newWorkspaces[0]);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setWorkspaces([]);
    setCurrentWorkspace(null);
    localStorage.removeItem('chatbots_token');
    localStorage.removeItem('chatbots_workspace_id');
  };

  const refreshUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    const res = await request('/auth/me');
    if (res.success && res.data) {
      setUser(res.data.user);
      setWorkspaces(res.data.workspaces);

      const savedWsId = localStorage.getItem('chatbots_workspace_id');
      const foundWs = res.data.workspaces.find((w: Workspace) => w.id === savedWsId);

      if (foundWs) {
        setCurrentWorkspace(foundWs);
      } else if (res.data.workspaces.length > 0) {
        selectWorkspace(res.data.workspaces[0]);
      }
    } else {
      logout();
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, workspaces, currentWorkspace, token, loading, login, logout, selectWorkspace, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
