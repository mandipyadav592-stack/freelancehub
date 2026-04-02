import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "client" | "freelancer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  avatarColor: string;
  title?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  rating?: number;
  reviews?: number;
  completedJobs?: number;
  balance?: number;
  verified?: boolean;
  joinedDate?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users database
const mockUsers: User[] = [
  {
    id: "1",
    name: "Mandip Yadav",
    email: "client@demo.com",
    role: "client",
    avatar: "MY",
    avatarColor: "from-violet-500 to-indigo-600",
    location: "Mumbai, India",
    bio: "Entrepreneur building the next big thing.",
    balance: 2500,
    verified: true,
    joinedDate: "Jan 2024",
  },
  {
    id: "2",
    name: "Sophia Chen",
    email: "freelancer@demo.com",
    role: "freelancer",
    avatar: "SC",
    avatarColor: "from-pink-500 to-rose-600",
    title: "Full-Stack Developer",
    location: "San Francisco, CA",
    bio: "Ex-Google engineer building scalable web apps for 7+ years.",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    hourlyRate: 85,
    rating: 4.9,
    reviews: 312,
    completedJobs: 248,
    balance: 12400,
    verified: true,
    joinedDate: "Mar 2023",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, _password: string, _role: UserRole): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 1000));
    const found = mockUsers.find((u) => u.email === email);
    if (found) { setUser(found); return true; }
    // Auto-create if not found (demo)
    const newUser: User = {
      id: Date.now().toString(),
      name: email.split("@")[0],
      email,
      role: _role,
      avatar: email.slice(0, 2).toUpperCase(),
      avatarColor: "from-violet-500 to-indigo-600",
      balance: 0,
      verified: false,
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
    setUser(newUser);
    return true;
  };

  const signup = async (name: string, email: string, _password: string, role: UserRole): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 1200));
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      avatar: name.slice(0, 2).toUpperCase(),
      avatarColor: role === "freelancer" ? "from-pink-500 to-rose-600" : "from-violet-500 to-indigo-600",
      balance: role === "client" ? 0 : 0,
      verified: false,
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
    setUser(newUser);
    return true;
  };

  const logout = () => setUser(null);
  const updateUser = (data: Partial<User>) => setUser((u) => u ? { ...u, ...data } : u);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
