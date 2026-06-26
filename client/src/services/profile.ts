// User profile, stored locally in the browser (no backend auth). Holds the
// display name, email, avatar (data URL or remote URL) and sign-in state.

export interface Profile {
  username: string;
  email: string;
  avatar: string;
  loggedIn: boolean;
}

const KEY = 'hw_profile';

export const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB6tw_BZmhf8Dz3kAAkBB9QOwRRjDPdvPld16xv4xb2aTJd5KHNGxQ72UWkZKHqIM1j6A2kJWGrEC9orVXQy9lnRPe4tjo49UIaouf9LGzbSBqoMxgThmIW4oeCmBDX9TL2MhttDhiN7_0z1BWkmbxew67XcTfIFsocIv3nrohaowusqfsx9Hn_fwFL_XzZmjE36AMu2hEDafSE5Bt_nsGv6SrjCieUHZRoaBIiRIpx5LLSAmdkIighxSaitRn60LBJWWihGw9hwD9-';

export const DEFAULT_PROFILE: Profile = {
  username: 'Guest Collector',
  email: '',
  avatar: DEFAULT_AVATAR,
  loggedIn: false,
};

export function getProfile(): Profile {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile: Profile): Profile {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    // ignore storage failures
  }
  return profile;
}
