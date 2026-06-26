import React, { useRef, useState } from 'react';
import type { Profile } from '../services/profile';
import { fileToDataURL } from '../services/collection';

interface ProfileMenuProps {
  profile: Profile;
  onSignIn: (email: string, username: string) => void;
  onSignOut: () => void;
  onUpdate: (patch: Partial<Profile>) => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ profile, onSignIn, onSignOut, onUpdate }) => {
  const [email, setEmail] = useState(profile.email);
  const [username, setUsername] = useState(profile.username === 'Guest Collector' ? '' : profile.username);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    onSignIn(email.trim(), username.trim());
  };

  const handleAvatar = async (file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await fileToDataURL(file, 256);
      onUpdate({ avatar: dataUrl });
    } catch {
      setError('Could not read that image');
    }
  };

  return (
    <div
      className="absolute right-0 top-full mt-2 w-72 bg-surface-container-low border border-outline-variant rounded-2xl shadow-2xl p-md z-50 animate-slide-up"
      onClick={(e) => e.stopPropagation()}
    >
      {!profile.loggedIn ? (
        /* ---------------- SIGN IN ---------------- */
        <form onSubmit={handleSignIn} className="space-y-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary">account_circle</span>
            <p className="font-headline-md text-on-surface">Sign in</p>
          </div>
          <p className="text-[11px] text-on-surface-variant -mt-1">Sign in with your email to sync your collection.</p>
          {error && <p className="text-label-sm text-error">{error}</p>}
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com" aria-label="Email"
            className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-2 text-label-md text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          <input
            type="text" value={username} onChange={(e) => setUsername(e.target.value)}
            placeholder="Username (optional)" aria-label="Username"
            className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-2 text-label-md text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          <button type="submit" className="btn-press w-full py-sm rounded-xl racing-gradient text-white font-bold">
            Sign In
          </button>
        </form>
      ) : (
        /* ---------------- PROFILE ---------------- */
        <div className="space-y-md">
          <div className="flex items-center gap-sm">
            <div className="relative group/av">
              <img src={profile.avatar} alt="Your avatar" className="w-14 h-14 rounded-full object-cover border border-outline-variant" />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-label="Change profile picture"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full racing-gradient text-white flex items-center justify-center border-2 border-surface-container-low"
              >
                <span className="material-symbols-outlined text-[14px]">photo_camera</span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatar(e.target.files?.[0])} />
            </div>
            <div className="min-w-0">
              <p className="text-label-lg font-bold text-on-surface truncate">{profile.username}</p>
              <p className="text-[11px] text-on-surface-variant truncate">{profile.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-label-sm text-on-surface-variant mb-1">Username</label>
            <div className="flex gap-2">
              <input
                value={username} onChange={(e) => setUsername(e.target.value)}
                className="flex-1 min-w-0 bg-surface-container border border-outline-variant rounded-lg px-sm py-2 text-label-md text-on-surface outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <button
                type="button"
                onClick={() => username.trim() && onUpdate({ username: username.trim() })}
                className="btn-press px-3 py-2 rounded-lg bg-surface-container-high border border-secondary text-secondary font-bold text-label-sm hover:bg-secondary/10"
              >
                Save
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className="btn-press w-full py-sm rounded-xl bg-surface-container-high border border-outline-variant text-on-surface font-bold hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};
