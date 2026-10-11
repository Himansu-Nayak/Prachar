import React from "react";
import { UpdateProfileInput } from "@/types";
import { THEME_COLORS } from "@/lib/constants/themes";
import { X, Check } from "lucide-react";

interface ProfileEditorFormProps {
  isOpen: boolean;
  editForm: UpdateProfileInput;
  setEditForm: (form: UpdateProfileInput) => void;
  saveStatus: "IDLE" | "SAVING" | "SAVED" | "FAILED";
  usernameSlug: string;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function ProfileEditorForm({
  isOpen,
  editForm,
  setEditForm,
  saveStatus,
  usernameSlug,
  onSave,
  onCancel,
}: ProfileEditorFormProps) {
  if (!isOpen) return null;

  return (
    <div className="p-6 sm:p-7 rounded-3xl border border-slate-800/80 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest block font-mono">
            Profile Settings
          </span>
          <h3 className="text-lg font-bold text-white">Edit Phygital Profile</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            /u/{usernameSlug}
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={onSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-name" className="block text-xs font-semibold text-slate-300 mb-1">
              Display Name *
            </label>
            <input
              id="edit-name"
              type="text"
              value={editForm.displayName || ""}
              onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
            />
          </div>
          <div>
            <label htmlFor="edit-business" className="block text-xs font-semibold text-slate-300 mb-1">
              Business Name
            </label>
            <input
              id="edit-business"
              type="text"
              value={editForm.businessName || ""}
              onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-category" className="block text-xs font-semibold text-slate-300 mb-1">
              Category *
            </label>
            <input
              id="edit-category"
              type="text"
              value={editForm.category || ""}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
            />
          </div>
          <div>
            <label htmlFor="edit-tagline" className="block text-xs font-semibold text-slate-300 mb-1">
              Tagline
            </label>
            <input
              id="edit-tagline"
              type="text"
              value={editForm.tagline || ""}
              onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        </div>

        <div>
          <label htmlFor="edit-bio" className="block text-xs font-semibold text-slate-300 mb-1">
            Bio / Business Summary
          </label>
          <textarea
            id="edit-bio"
            rows={3}
            value={editForm.bio || ""}
            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="edit-phone" className="block text-xs font-semibold text-slate-300 mb-1">
              Primary Phone *
            </label>
            <input
              id="edit-phone"
              type="tel"
              value={editForm.primaryPhone || ""}
              onChange={(e) => setEditForm({ ...editForm, primaryPhone: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition font-mono"
            />
          </div>
          <div>
            <label htmlFor="edit-whatsapp" className="block text-xs font-semibold text-slate-300 mb-1">
              WhatsApp Number
            </label>
            <input
              id="edit-whatsapp"
              type="tel"
              value={editForm.whatsappNumber || ""}
              onChange={(e) => setEditForm({ ...editForm, whatsappNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition font-mono"
            />
          </div>
          <div>
            <label htmlFor="edit-email" className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <input
              id="edit-email"
              type="email"
              value={editForm.email || ""}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="edit-city" className="block text-xs font-semibold text-slate-300 mb-1">
              City
            </label>
            <input
              id="edit-city"
              type="text"
              value={editForm.city || ""}
              onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
            />
          </div>
          <div>
            <label htmlFor="edit-district" className="block text-xs font-semibold text-slate-300 mb-1">
              District (Odisha)
            </label>
            <input
              id="edit-district"
              type="text"
              value={editForm.district || ""}
              onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
              placeholder="e.g. Khordha, Cuttack"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
            />
          </div>
          <div>
            <label htmlFor="edit-state" className="block text-xs font-semibold text-slate-300 mb-1">
              State
            </label>
            <input
              id="edit-state"
              type="text"
              value={editForm.state || "Odisha"}
              onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-website" className="block text-xs font-semibold text-slate-300 mb-1">
              Website URL
            </label>
            <input
              id="edit-website"
              type="url"
              value={editForm.websiteUrl || ""}
              onChange={(e) => setEditForm({ ...editForm, websiteUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
            />
          </div>
          <div>
            <label htmlFor="edit-address" className="block text-xs font-semibold text-slate-300 mb-1">
              Street Address
            </label>
            <input
              id="edit-address"
              type="text"
              value={editForm.addressText || ""}
              onChange={(e) => setEditForm({ ...editForm, addressText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-300 block font-mono">Social Profiles</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-ig" className="block text-[11px] text-slate-400 mb-1">
                Instagram (@handle or URL)
              </label>
              <input
                id="edit-ig"
                type="text"
                value={editForm.socialInstagram || ""}
                onChange={(e) => setEditForm({ ...editForm, socialInstagram: e.target.value })}
                placeholder="@username"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>
            <div>
              <label htmlFor="edit-fb" className="block text-[11px] text-slate-400 mb-1">
                Facebook URL
              </label>
              <input
                id="edit-fb"
                type="text"
                value={editForm.socialFacebook || ""}
                onChange={(e) => setEditForm({ ...editForm, socialFacebook: e.target.value })}
                placeholder="facebook.com/..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 font-mono">
            Card Theme Accent Color
          </label>
          <div className="flex items-center gap-3">
            {THEME_COLORS.map((tc) => (
              <button
                key={tc.value}
                type="button"
                onClick={() => setEditForm({ ...editForm, themeColor: tc.value })}
                style={{ backgroundColor: tc.value }}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  editForm.themeColor === tc.value
                    ? "scale-110 shadow-lg ring-2 ring-white/50 border-white"
                    : "border-transparent opacity-75 hover:opacity-100"
                }`}
                title={tc.name}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={saveStatus === "SAVING"}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs transition disabled:opacity-50 shadow-md shadow-orange-950/40"
          >
            {saveStatus === "SAVING" ? "Saving Changes..." : "Save Profile Updates"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
