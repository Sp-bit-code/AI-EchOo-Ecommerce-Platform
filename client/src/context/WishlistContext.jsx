import { createContext, useContext } from "react";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  return <WishlistContext.Provider value={{}}>{children}</WishlistContext.Provider>;
};

export const useWishlistContext = () => useContext(WishlistContext);
