/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

import {
  getCart,
  addToCart as addToBackendCart,
  updateCartQuantity,
  removeCartItem,
  clearCart as clearBackendCart,
} from "../services/cartService";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "roshni_cart";
const SAVED_STORAGE_KEY = "roshni_saved_items";

const SHIPPING_THRESHOLD = 999;
const SHIPPING_CHARGE = 100;

export const CartProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();

  // ============================================================
  // GUEST CART
  // ============================================================

  const [guestCartItems, setGuestCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // ============================================================
  // BACKEND CART
  // ============================================================

  const [backendCartItems, setBackendCartItems] = useState([]);

  const [cartLoading, setCartLoading] = useState(false);

  // Prevent login merge from running multiple times
  const previousAuthState = useRef(false);

  // ============================================================
  // SAVED ITEMS
  // ============================================================

  const [savedItems, setSavedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(SAVED_STORAGE_KEY);

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ============================================================
  // PERSIST GUEST CART
  // ============================================================

  useEffect(() => {
    /*
     * We only persist the guest cart.
     *
     * Logged-in cart lives in MongoDB.
     */
    if (!isAuthenticated) {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(guestCartItems),
      );
    }
  }, [guestCartItems, isAuthenticated]);

  // ============================================================
  // PERSIST SAVED ITEMS
  // ============================================================

  useEffect(() => {
    localStorage.setItem(
      SAVED_STORAGE_KEY,
      JSON.stringify(savedItems),
    );
  }, [savedItems]);

  // ============================================================
  // NORMALIZE BACKEND CART
  // ============================================================

  const normalizeBackendCart = (cart) => {
    if (!cart?.items) return [];

    return cart.items
      .filter((item) => item.productId)
      .map((item) => {
        const product = item.productId;

        return {
          id: product._id,

          productId: product._id,

          name: product.name,

          price:
            typeof item.price === "number"
              ? item.price
              : product.price || 0,

          image:
            product.image ||
            product.images?.[0] ||
            "",

          category:
            product.category?.title ||
            product.category?.name ||
            product.category?.category ||
            "",

          subcategory: product.subcategory || "",

          material: product.material || "",

          availability:
            product.availability || "in-stock",

          stockLeft:
            typeof product.stockLeft === "number"
              ? product.stockLeft
              : Infinity,

          badge: product.badge || null,

          craftLabel: product.craftLabel || "",

          quantity: item.quantity,
        };
      });
  };

  // ============================================================
  // FETCH BACKEND CART
  // ============================================================

  const loadBackendCart = async () => {
    try {
      setCartLoading(true);

      const response = await getCart();

      const items = normalizeBackendCart(response?.cart);

      setBackendCartItems(items);

      return items;
    } catch (error) {
      console.error("Failed to load backend cart:", error);

      setBackendCartItems([]);

      return [];
    } finally {
      setCartLoading(false);
    }
  };

  // ============================================================
  // MERGE GUEST CART INTO BACKEND CART
  // ============================================================

  const mergeGuestCart = async () => {
    if (!guestCartItems.length) {
      await loadBackendCart();
      return;
    }

    try {
      setCartLoading(true);

      /*
       * First load the user's existing backend cart.
       */
      const response = await getCart();

      const backendItems = normalizeBackendCart(
        response?.cart,
      );

      /*
       * Add each guest item to backend cart.
       *
       * Backend addToCart already handles:
       *
       * existing product → increase quantity
       * new product      → add product
       */
      for (const guestItem of guestCartItems) {
        try {
          await addToBackendCart(
            guestItem.productId || guestItem.id,
            guestItem.quantity,
          );
        } catch (error) {
          console.error(
            "Failed to merge cart item:",
            guestItem,
            error,
          );
        }
      }

      /*
       * Reload final merged cart.
       */
      const finalResponse = await getCart();

      const finalItems = normalizeBackendCart(
        finalResponse?.cart,
      );

      setBackendCartItems(finalItems);

      /*
       * Guest cart has now been transferred to MongoDB.
       */
      setGuestCartItems([]);

      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Cart merge failed:", error);

      /*
       * Keep guest cart if merge fails.
       * This prevents accidental cart loss.
       */
    } finally {
      setCartLoading(false);
    }
  };

  // ============================================================
  // AUTH STATE CHANGE
  // ============================================================

  useEffect(() => {
    if (authLoading) return;

    /*
     * User logged in.
     */
    if (isAuthenticated && !previousAuthState.current) {
      previousAuthState.current = true;

      mergeGuestCart();

      return;
    }

    /*
     * User logged out.
     */
    if (!isAuthenticated && previousAuthState.current) {
      previousAuthState.current = false;

      setBackendCartItems([]);
      setCartLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  // ============================================================
  // INITIAL AUTHENTICATED CART LOAD
  // ============================================================

  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated) {
      previousAuthState.current = true;

      /*
       * Only load if we don't currently have backend items.
       *
       * mergeGuestCart() handles the guest-cart case.
       */
      if (guestCartItems.length === 0) {
        loadBackendCart();
      }
    }
  }, [authLoading, isAuthenticated]);

  // ============================================================
  // ACTIVE CART
  // ============================================================

  const cartItems = isAuthenticated
    ? backendCartItems
    : guestCartItems;

  // ============================================================
  // ADD TO CART
  // ============================================================

  const addToCart = async (product, quantity = 1) => {
    if (!product) {
      return {
        success: false,
        message: "Product not found.",
      };
    }

    const productId = product._id || product.id;

    if (!productId) {
      return {
        success: false,
        message: "Product ID is missing.",
      };
    }

    if (product.availability === "out-of-stock") {
      return {
        success: false,
        message: "This product is currently out of stock.",
      };
    }

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1) {
      return {
        success: false,
        message: "Invalid quantity.",
      };
    }

    // ==========================================================
    // LOGGED-IN USER
    // ==========================================================

    if (isAuthenticated) {
      try {
        setCartLoading(true);

        const response = await addToBackendCart(
          productId,
          qty,
        );

        const items = normalizeBackendCart(
          response?.cart,
        );

        setBackendCartItems(items);

        return {
          success: true,
          message: `${product.name} added to cart.`,
        };
      } catch (error) {
        console.error("Backend add to cart error:", error);

        return {
          success: false,
          message:
            error.response?.data?.message ||
            "Unable to add product to cart.",
        };
      } finally {
        setCartLoading(false);
      }
    }

    // ==========================================================
    // GUEST USER
    // ==========================================================

    const existingProduct = guestCartItems.find(
      (item) => item.id === productId,
    );

    const currentQuantity = existingProduct
      ? existingProduct.quantity
      : 0;

    const requestedQuantity =
      currentQuantity + qty;

    const maxStock =
      typeof product.stockLeft === "number" &&
      product.stockLeft > 0
        ? product.stockLeft
        : Infinity;

    if (requestedQuantity > maxStock) {
      return {
        success: false,
        message: `Only ${maxStock} ${
          maxStock === 1 ? "item" : "items"
        } available in stock.`,
      };
    }

    setGuestCartItems((prev) => {
      const existing = prev.find(
        (item) => item.id === productId,
      );

      if (existing) {
        return prev.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity + qty,
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          id: productId,
          productId,

          name: product.name,

          price: product.price || 0,

          image:
            product.image ||
            product.images?.[0] ||
            "",

          category:
            product.category?.title ||
            product.category?.name ||
            product.category?.category ||
            "",

          subcategory:
            product.subcategory || "",

          material:
            product.material || "",

          availability:
            product.availability || "in-stock",

          stockLeft:
            typeof product.stockLeft === "number"
              ? product.stockLeft
              : Infinity,

          badge: product.badge || null,

          craftLabel:
            product.craftLabel || "",

          quantity: qty,
        },
      ];
    });

    return {
      success: true,
      message: `${product.name} added to cart.`,
    };
  };

  // ============================================================
  // REMOVE FROM CART
  // ============================================================

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        setCartLoading(true);

        const response =
          await removeCartItem(productId);

        const items = normalizeBackendCart(
          response?.cart,
        );

        setBackendCartItems(items);
      } catch (error) {
        console.error(
          "Backend remove cart item error:",
          error,
        );
      } finally {
        setCartLoading(false);
      }

      return;
    }

    setGuestCartItems((prev) =>
      prev.filter(
        (item) => item.id !== productId,
      ),
    );
  };

  // ============================================================
  // UPDATE EXACT QUANTITY
  // ============================================================

  const updateQuantity = async (
    productId,
    quantity,
  ) => {
    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1) {
      return;
    }

    // ==========================================================
    // LOGGED-IN
    // ==========================================================

    if (isAuthenticated) {
      try {
        setCartLoading(true);

        const response =
          await updateCartQuantity(
            productId,
            qty,
          );

        const items = normalizeBackendCart(
          response?.cart,
        );

        setBackendCartItems(items);
      } catch (error) {
        console.error(
          "Backend update quantity error:",
          error,
        );
      } finally {
        setCartLoading(false);
      }

      return;
    }

    // ==========================================================
    // GUEST
    // ==========================================================

    setGuestCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        const maxStock =
          typeof item.stockLeft === "number" &&
          item.stockLeft > 0
            ? item.stockLeft
            : Infinity;

        const safeQuantity = Math.min(
          Math.max(1, qty),
          maxStock,
        );

        return {
          ...item,
          quantity: safeQuantity,
        };
      }),
    );
  };

  // ============================================================
  // INCREASE QUANTITY
  // ============================================================

  const increaseQuantity = async (productId) => {
    const item = cartItems.find(
      (item) => item.id === productId,
    );

    if (!item) return;

    const maxStock =
      typeof item.stockLeft === "number" &&
      item.stockLeft > 0
        ? item.stockLeft
        : Infinity;

    if (item.quantity >= maxStock) {
      return;
    }

    await updateQuantity(
      productId,
      item.quantity + 1,
    );
  };

  // ============================================================
  // DECREASE QUANTITY
  // ============================================================

  const decreaseQuantity = async (productId) => {
    const item = cartItems.find(
      (item) => item.id === productId,
    );

    if (!item) return;

    if (item.quantity <= 1) {
      return;
    }

    await updateQuantity(
      productId,
      item.quantity - 1,
    );
  };

  // ============================================================
  // CLEAR CART
  // ============================================================

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        setCartLoading(true);

        await clearBackendCart();

        setBackendCartItems([]);
      } catch (error) {
        console.error(
          "Backend clear cart error:",
          error,
        );
      } finally {
        setCartLoading(false);
      }

      return;
    }

    setGuestCartItems([]);

    localStorage.removeItem(
      CART_STORAGE_KEY,
    );
  };

  // ============================================================
  // SAVE FOR LATER
  // ============================================================

  const saveForLater = (productId) => {
    const product = cartItems.find(
      (item) => item.id === productId,
    );

    if (!product) return;

    setSavedItems((prev) => {
      const alreadySaved = prev.some(
        (item) => item.id === productId,
      );

      if (alreadySaved) {
        return prev;
      }

      return [...prev, product];
    });

    removeFromCart(productId);
  };

  // ============================================================
  // MOVE SAVED ITEM TO CART
  // ============================================================

  const moveToCart = async (productId) => {
    const product = savedItems.find(
      (item) => item.id === productId,
    );

    if (!product) return;

    const result = await addToCart(
      product,
      product.quantity || 1,
    );

    if (result?.success) {
      setSavedItems((prev) =>
        prev.filter(
          (item) => item.id !== productId,
        ),
      );
    }

    return result;
  };

  // ============================================================
  // REMOVE SAVED ITEM
  // ============================================================

  const removeSavedItem = (productId) => {
    setSavedItems((prev) =>
      prev.filter(
        (item) => item.id !== productId,
      ),
    );
  };

  // ============================================================
  // CART COUNT
  // ============================================================

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0,
    );
  }, [cartItems]);

  // ============================================================
  // SUBTOTAL
  // ============================================================

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0,
    );
  }, [cartItems]);

  // ============================================================
  // SHIPPING
  // ============================================================

  const shipping = useMemo(() => {
    if (cartItems.length === 0) {
      return 0;
    }

    return subtotal > SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_CHARGE;
  }, [cartItems.length, subtotal]);

  // ============================================================
  // DISCOUNT
  // ============================================================

  /*
   * No fake discount is calculated here.
   *
   * Discounts should eventually come from the backend
   * promotion/coupon system.
   */
  const discount = 0;

  // ============================================================
  // TAX
  // ============================================================

  /*
   * Tax should eventually be calculated by the backend
   * during checkout/order creation.
   *
   * Keeping it at 0 prevents the frontend total from
   * disagreeing with the backend cart total.
   */
  const tax = 0;

  // ============================================================
  // TOTAL
  // ============================================================

  const total = useMemo(() => {
    return subtotal -
      discount +
      tax +
      shipping;
  }, [
    subtotal,
    discount,
    tax,
    shipping,
  ]);

  // ============================================================
  // CONTEXT DATA
  // ============================================================

  const cartData = {
    cartItems,
    savedItems,

    cartCount,

    subtotal,
    discount,
    tax,
    shipping,
    total,

    cartLoading,

    addToCart,
    removeFromCart,

    updateQuantity,
    increaseQuantity,
    decreaseQuantity,

    clearCart,

    saveForLater,
    moveToCart,
    removeSavedItem,
  };

  return (
    <CartContext.Provider value={cartData}>
      {children}
    </CartContext.Provider>
  );
};

// ============================================================
// USE CART
// ============================================================

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider",
    );
  }

  return context;
};