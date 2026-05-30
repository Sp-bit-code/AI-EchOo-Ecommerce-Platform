import { createContext, useContext } from "react";

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  return <OrderContext.Provider value={{}}>{children}</OrderContext.Provider>;
};

export const useOrderContext = () => useContext(OrderContext);
