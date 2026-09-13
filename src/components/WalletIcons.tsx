export const WalletIcons: Record<string, React.FC<{ className?: string }>> = {
  MetaMask: ({ className }) => (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M29.5 1.5L16 10L2.5 1.5L6 14L1 20.5L11 20L16 31.5L21 20L31 20.5L26 14L29.5 1.5Z" fill="#F6851B" stroke="#F6851B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 10L6 14L11 20L16 31.5L21 20L26 14L16 10Z" fill="#E2761B"/>
      <path d="M2.5 1.5L11 20L1 20.5L2.5 1.5Z" fill="#E2761B"/>
      <path d="M29.5 1.5L21 20L31 20.5L29.5 1.5Z" fill="#E2761B"/>
    </svg>
  ),
  WalletConnect: ({ className }) => (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="16" fill="#3396FF"/>
      <path d="M22.5 12C18.91 9.33333 13.09 9.33333 9.5 12L8.5 13C8.22386 13.2761 8.22386 13.7239 8.5 14L10 15.5C10.2761 15.7761 10.7239 15.7761 11 15.5L11.5 15C13.9853 13.1438 18.0147 13.1438 20.5 15L21 15.5C21.2761 15.7761 21.7239 15.7761 22 15.5L23.5 14C23.7761 13.7239 23.7761 13.2761 23.5 13L22.5 12Z" fill="white"/>
      <path d="M7 17L8.5 15.5C8.77614 15.2239 9.22386 15.2239 9.5 15.5L12 18C12.2761 18.2761 12.2761 18.7239 12 19L11 20C10.7239 20.2761 10.7239 20.7239 11 21L12.5 22.5C12.7761 22.7761 13.2239 22.7761 13.5 22.5L14.5 21.5C14.7761 21.2239 15.2239 21.2239 15.5 21.5L16.5 22.5C16.7761 22.7761 17.2239 22.7761 17.5 22.5L18.5 21.5C18.7761 21.2239 19.2239 21.2239 19.5 21.5L21 23C21.2761 23.2761 21.7239 23.2761 22 23L23.5 21.5C23.7761 21.2239 23.7761 20.7761 23.5 20.5L20.5 17.5C20.2239 17.2239 19.7761 17.2239 19.5 17.5L17.5 19.5C17.2239 19.7761 16.7761 19.7761 16.5 19.5L15.5 18.5C15.2239 18.2239 14.7761 18.2239 14.5 18.5L12.5 20.5C12.2239 20.7761 11.7761 20.7761 11.5 20.5L9.5 18.5C9.22386 18.2239 8.77614 18.2239 8.5 18.5L7 20C6.72386 20.2761 6.72386 20.7239 7 21V17Z" fill="white"/>
    </svg>
  ),
  Coinbase: ({ className }) => (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="16" fill="#0052FF"/>
      <rect x="12" y="12" width="8" height="8" rx="2" fill="white"/>
    </svg>
  ),
  Rabby: ({ className }) => (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="16" fill="#8697FF"/>
      <path d="M12 22C11 21 10 18 10 15C10 12 11 10 11 10C11 10 14 11 16 11C18 11 21 10 21 10C21 10 22 12 22 15C22 18 21 21 20 22H12Z" fill="white"/>
      <circle cx="14" cy="14" r="1.5" fill="#8697FF"/>
      <circle cx="18" cy="14" r="1.5" fill="#8697FF"/>
    </svg>
  ),
  Trust: ({ className }) => (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="16" fill="#3375BB"/>
      <path d="M16 8L10 10.5V17C10 20.5 12.5 23.5 16 25C19.5 23.5 22 20.5 22 17V10.5L16 8Z" fill="white"/>
    </svg>
  ),
  Default: ({ className }) => (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="16" fill="#4B5563"/>
      <path d="M10 14C10 12.8954 10.8954 12 12 12H20C21.1046 12 22 12.8954 22 14V18C22 19.1046 21.1046 20 20 20H12C10.8954 20 10 19.1046 10 18V14Z" fill="white"/>
      <rect x="18" y="15" width="2" height="2" fill="#4B5563"/>
    </svg>
  ),
};

export const getWalletIcon = (name: string) => {
  const normalizedName = name.toLowerCase();
  if (normalizedName.includes("metamask")) return WalletIcons.MetaMask;
  if (normalizedName.includes("walletconnect")) return WalletIcons.WalletConnect;
  if (normalizedName.includes("coinbase")) return WalletIcons.Coinbase;
  if (normalizedName.includes("rabby")) return WalletIcons.Rabby;
  if (normalizedName.includes("trust")) return WalletIcons.Trust;
  return WalletIcons.Default;
};
