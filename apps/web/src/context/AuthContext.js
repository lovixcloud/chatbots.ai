import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { request } from '../services/api';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [workspaces, setWorkspaces] = useState([]);
    const [currentWorkspace, setCurrentWorkspace] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('chatbots_token'));
    const [loading, setLoading] = useState(true);
    const selectWorkspace = (ws) => {
        setCurrentWorkspace(ws);
        localStorage.setItem('chatbots_workspace_id', ws.id);
    };
    const login = (newToken, newUser, newWorkspaces) => {
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
            const foundWs = res.data.workspaces.find((w) => w.id === savedWsId);
            if (foundWs) {
                setCurrentWorkspace(foundWs);
            }
            else if (res.data.workspaces.length > 0) {
                selectWorkspace(res.data.workspaces[0]);
            }
        }
        else {
            logout();
        }
        setLoading(false);
    };
    useEffect(() => {
        refreshUser();
    }, [token]);
    return (_jsx(AuthContext.Provider, { value: { user, workspaces, currentWorkspace, token, loading, login, logout, selectWorkspace, refreshUser }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
