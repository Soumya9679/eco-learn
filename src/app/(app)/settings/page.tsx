"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PageHeader from "@/components/ui/PageHeader";
import {
  Settings as SettingsIcon,
  User,
  Phone,
  School,
  MapPin,
  Globe,
  Save,
  CheckCircle,
} from "lucide-react";

export default function SettingsPage() {
  const { user, firebaseUser, fetchProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    school: "",
    state: "",
    country: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        mobile: user.mobile || "",
        school: user.school || "",
        state: user.state || "",
        country: user.country || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;
    setSaving(true);
    setSaved(false);

    const token = await firebaseUser.getIdToken();
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      await fetchProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (!user) return null;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" icon={<SettingsIcon size={22} />} />

      <motion.div variants={staggerItem}>
        <Card variant="glass" padding="lg">
          <h2 className="text-lg font-semibold text-white mb-6" style={{ fontFamily: "var(--font-jakarta)" }}>
            Profile Information
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={<User size={18} />}
              required
            />
            <Input
              label="Email"
              value={user.email}
              disabled
              helperText="Email cannot be changed"
            />
            <Input
              label="Mobile Number"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              icon={<Phone size={18} />}
            />
            <Input
              label="School / Institution"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              icon={<School size={18} />}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                icon={<MapPin size={18} />}
              />
              <Input
                label="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                icon={<Globe size={18} />}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                loading={saving}
                icon={saved ? <CheckCircle size={16} /> : <Save size={16} />}
              >
                {saved ? "Saved!" : "Save Changes"}
              </Button>
              {saved && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-green-400 font-medium"
                >
                  Changes saved successfully
                </motion.span>
              )}
            </div>
          </form>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card variant="default" padding="lg">
          <h2 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
            Account Security
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            Password management is handled through Firebase Auth. To change your password, use the password reset feature.
          </p>
          <Button
            variant="secondary"
            onClick={async () => {
              const { sendPasswordResetEmail } = await import("firebase/auth");
              const { auth } = await import("@/lib/firebase-client");
              await sendPasswordResetEmail(auth, user.email);
              alert("Password reset email sent!");
            }}
          >
            Send Password Reset Email
          </Button>
        </Card>
      </motion.div>
    </motion.div>
  );
}
