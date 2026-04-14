"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Tabs from "@/components/ui/Tabs";
import Avatar from "@/components/ui/Avatar";
import PageHeader from "@/components/ui/PageHeader";
import { PageSkeleton } from "@/components/ui/Skeleton";
import {
  Shield,
  Users,
  BookOpen,
  HelpCircle,
  Target,
  Plus,
  Trash2,
  Edit,
  UserPlus,
  BarChart3,
  X,
  Save,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  school?: string;
  ecoPoints: number;
  profilePicture?: string;
}

interface Stats {
  totalUsers: number;
  totalFaculty: number;
  activeUsers: number;
  totalContent: number;
  usersChange: string;
  facultyChange: string;
  activityChange: string;
  contentChange: string;
}

const adminTabs = [
  { id: "overview", label: "Overview", icon: <BarChart3 size={16} /> },
  { id: "users", label: "Users", icon: <Users size={16} /> },
  { id: "content", label: "Content", icon: <BookOpen size={16} /> },
];

export default function AdminPage() {
  const { user, firebaseUser } = useAuth();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "", school: "" });
  const [creating, setCreating] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [message, setMessage] = useState("");

  const isSuperAdmin = user?.role === "superadmin";

  useEffect(() => {
    if (!firebaseUser || !user) return;
    fetchData();
  }, [firebaseUser, user]);

  const getHeaders = async () => {
    const token = await firebaseUser!.getIdToken();
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  };

  const fetchData = async () => {
    const headers = await getHeaders();
    // Uses new split endpoints (#5)
    const [statsRes, usersRes] = await Promise.all([
      fetch("/api/admin/stats", { headers }),
      fetch("/api/admin/users", { headers }),
    ]);
    if (statsRes.ok) setStats(await statsRes.json());
    if (usersRes.ok) setUsers(await usersRes.json());
    setLoading(false);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setMessage("");
    const headers = await getHeaders();
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers,
      body: JSON.stringify(newAdmin),
    });
    const data = await res.json();
    setMessage(data.message);
    if (res.ok) {
      setNewAdmin({ name: "", email: "", password: "", school: "" });
      setShowCreateAdmin(false);
      fetchData();
    }
    setCreating(false);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Delete this user and all their posts?")) return;
    const headers = await getHeaders();
    await fetch(`/api/admin/users?id=${id}`, { method: "DELETE", headers });
    fetchData();
  };

  const handleUpdateUser = async () => {
    if (!editUser) return;
    const headers = await getHeaders();
    await fetch("/api/admin/users", {
      method: "PUT",
      headers,
      body: JSON.stringify(editUser),
    });
    setEditUser(null);
    fetchData();
  };

  const handleInitChallenges = async () => {
    const headers = await getHeaders();
    const res = await fetch("/api/admin/init-challenges", {
      method: "POST",
      headers,
    });
    const data = await res.json();
    setMessage(data.message);
  };

  if (loading || !user) return <PageSkeleton />;

  if (!["admin", "superadmin"].includes(user.role)) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card variant="default" padding="lg" className="text-center max-w-sm">
          <Shield size={48} className="mx-auto mb-4 text-slate-500" />
          <h2 className="text-lg font-bold text-white">Access Denied</h2>
          <p className="text-sm text-slate-400 mt-1">You need admin privileges to access this page.</p>
        </Card>
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle={isSuperAdmin ? "Super Admin Access" : "Faculty Admin Access"}
        icon={<Shield size={22} />}
        action={
          isSuperAdmin && (
            <Button onClick={() => setShowCreateAdmin(!showCreateAdmin)} icon={<UserPlus size={16} />}>
              {showCreateAdmin ? "Cancel" : "Add Faculty"}
            </Button>
          )
        }
      />

      {message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 py-3 rounded-xl text-sm font-medium"
          style={{ background: "rgba(16,185,129,0.1)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)" }}
        >
          {message}
        </motion.div>
      )}

      <motion.div variants={staggerItem}>
        <Tabs tabs={adminTabs} activeTab={tab} onTabChange={setTab} />
      </motion.div>

      {/* Overview Tab — Fixed theme (#11) */}
      {tab === "overview" && stats && (
        <motion.div variants={staggerItem} className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Users", value: stats.totalUsers, change: stats.usersChange, icon: Users, color: "text-blue-400", bg: "rgba(59,130,246,0.1)" },
              { label: "Faculty", value: stats.totalFaculty, change: stats.facultyChange, icon: Shield, color: "text-purple-400", bg: "rgba(147,51,234,0.1)" },
              { label: "Active Users", value: stats.activeUsers, change: stats.activityChange, icon: BarChart3, color: "text-green-400", bg: "rgba(34,197,94,0.1)" },
              { label: "Total Content", value: stats.totalContent, change: stats.contentChange, icon: BookOpen, color: "text-amber-400", bg: "rgba(245,158,11,0.1)" },
            ].map((s) => (
              <Card key={s.label} variant="glass" padding="md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{s.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
                    <p className="text-xs text-green-400 mt-1">{s.change}</p>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}
                    style={{ background: s.bg }}
                  >
                    <s.icon size={20} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button variant="secondary" onClick={handleInitChallenges} icon={<Target size={16} />}>
            Initialize Default Challenges
          </Button>
        </motion.div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <motion.div variants={staggerItem} className="space-y-4">
          {showCreateAdmin && (
            <Card variant="glass" padding="lg">
              <h3 className="text-base font-semibold text-white mb-4">Create Faculty Account</h3>
              <form onSubmit={handleCreateAdmin} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Name" value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} required />
                  <Input label="Email" type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Password" type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} required />
                  <Input label="School" value={newAdmin.school} onChange={(e) => setNewAdmin({ ...newAdmin, school: e.target.value })} />
                </div>
                <Button type="submit" loading={creating} icon={<UserPlus size={16} />}>Create Admin</Button>
              </form>
            </Card>
          )}

          {/* Edit User Modal */}
          {editUser && (
            <Card variant="glass" padding="lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-white">Edit User</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditUser(null)}><X size={16} /></Button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Name" value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
                  <Input label="Email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Role</label>
                    <select
                      value={editUser.role}
                      onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/30"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
                    <select
                      value={editUser.status}
                      onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/30"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <Input label="EcoPoints" type="number" value={String(editUser.ecoPoints)} onChange={(e) => setEditUser({ ...editUser, ecoPoints: Number(e.target.value) })} />
                </div>
                <Button onClick={handleUpdateUser} icon={<Save size={16} />}>Save Changes</Button>
              </div>
            </Card>
          )}

          <Card variant="default" padding="none">
            <div className="divide-y divide-white/5">
              {users.map((u) => (
                <div key={u.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors">
                  <Avatar src={u.profilePicture} name={u.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </div>
                  <Badge
                    variant={u.role === "superadmin" ? "purple" : u.role === "admin" ? "info" : "default"}
                  >
                    {u.role}
                  </Badge>
                  <Badge variant={u.status === "active" ? "success" : "warning"}>{u.status}</Badge>
                  <div className="flex gap-1">
                    {isSuperAdmin && (
                      <>
                        <button onClick={() => setEditUser(u)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Content Tab */}
      {tab === "content" && (
        <motion.div variants={staggerItem}>
          <Card variant="glass" padding="lg" className="text-center space-y-4">
            <BookOpen size={48} className="mx-auto text-slate-500" />
            <h3 className="text-lg font-semibold text-white">Content Management</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Manage modules, quizzes, and challenges through the API. Full content management UI coming soon.
            </p>
            <Button variant="secondary" onClick={handleInitChallenges} icon={<Target size={16} />}>
              Initialize Challenges
            </Button>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
