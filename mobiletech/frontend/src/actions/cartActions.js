import { addCartItemRequest, addCartItemSuccess } from '../slices/cartSlice';
import axios from 'axios';

export const addCartItem = (id, quantity) => async (dispatch, getState) => {
    try {
        dispatch(addCartItemRequest());
        
        // Fetch product details
        const { data } = await axios.get(`/api/v1/product/${id}`);
        
        dispatch(addCartItemSuccess({
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].image,
            stock: data.product.stock,
            quantity
        }));

        // Save updated cart to localStorage
        localStorage.setItem('cartItems', JSON.stringify(getState().cartState.items));
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
};
