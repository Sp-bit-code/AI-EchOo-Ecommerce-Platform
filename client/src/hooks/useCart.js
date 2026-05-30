import { useCart as useCartContext } from "../context/CartContext";

const useCart = () => {
  return useCartContext();
};

export default useCart;
export { useCart };