import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: localStorage.getItem('cartItems') 
            ? JSON.parse(localStorage.getItem('cartItems')) 
            : [],
        loading: false,
        shippingInfo: localStorage.getItem('shippingInfo') 
            ? JSON.parse(localStorage.getItem('shippingInfo')) 
            : {}
    },
    reducers: {
        // Request to add item (for loading state)
        addCartItemRequest(state) {
            state.loading = true;
        },

        // Successfully added an item to the cart
        addCartItemSuccess(state, action) {
            const item = action.payload;

            // Check if item already exists
            const isItemExist = state.items.find(i => i.product === item.product);

            if (isItemExist) {
                // Update existing item
                state.items = state.items.map(i =>
                    i.product === item.product ? item : i
                );
            } else {
                // Add new item to cart
                state.items.push(item);
            }

            state.loading = false;

            // Sync cart with localStorage
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },

        // Increase quantity of a specific cart item
        increaseCartItemQty(state, action) {
            const itemIndex = state.items.findIndex(item => item.product === action.payload);

            if (itemIndex !== -1) {
                state.items[itemIndex].quantity += 1;
            }

            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },

        // Decrease quantity of a specific cart item
        decreaseCartItemQty(state, action) {
            const itemIndex = state.items.findIndex(item => item.product === action.payload);

            if (itemIndex !== -1 && state.items[itemIndex].quantity > 1) {
                state.items[itemIndex].quantity -= 1;
            }

            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },

        // Remove an item from the cart
        removeItemFromCart(state, action) {
            state.items = state.items.filter(item => item.product !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },

        // Save shipping information to state and localStorage
        saveShippingInfo(state, action) {
            state.shippingInfo = action.payload;
            localStorage.setItem('shippingInfo', JSON.stringify(state.shippingInfo));
        },

        // Clear cart and shipping info when an order is completed
        orderCompleted(state) {
            state.items = [];
            state.loading = false;
            state.shippingInfo = {};

            localStorage.removeItem('cartItems');
            localStorage.removeItem('shippingInfo');
            sessionStorage.removeItem('orderInfo');
        },

        // Clear the entire cart and shipping info (e.g., after logout)
        clearCart(state) {
            state.items = [];
            state.shippingInfo = {};

            localStorage.removeItem('cartItems');
            localStorage.removeItem('shippingInfo');
        },
    },
});

const { actions, reducer } = cartSlice;

// Export actions for use in your components
export const {
    addCartItemRequest,
    addCartItemSuccess,
    decreaseCartItemQty,
    increaseCartItemQty,
    removeItemFromCart,
    saveShippingInfo,
    orderCompleted,
    clearCart,
} = actions;

export default reducer;
