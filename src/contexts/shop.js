import React, { createContext, useState, useEffect, useContext } from 'react';
import Client from 'shopify-buy';
import { InterfaceContext } from './interface';

const domain = process.env.GATSBY_SHOPIFY_SHOP_NAME + '.myshopify.com';
const custom = domain;

const client = Client.buildClient({
    storefrontAccessToken: process.env.GATSBY_SHOPIFY_ACCESS_TOKEN,
    domain,
});

const defaultValues = {
    quantity: 0,
    checkout: {
        lineItems: [],
    },
    coupon: '',
    addProductToCart: () => {},
    updateQuantity: () => {},
    removeProductFromCart: () => {},
    onCouponChange: () => {},
    checkCoupon: () => {},
    removeCoupon: () => {},
    domain,
    custom,
    client,
};

const isBrowser = typeof window !== 'undefined';

export const ShopContext = createContext(defaultValues);

export const ShopProvider = ({ children }) => {
    const { setLoading, setCartOpen } = useContext(InterfaceContext);
    const [checkout, setCheckout] = useState(defaultValues.checkout);
    const [coupon, setCoupon] = useState('');
    const onCouponChange = (value) => setCoupon(value);
    const addProductToCart = async (variantId, quantity) => {
        try {
            setLoading(true);
            const lineItemsToAdd = [
                {
                    variantId,
                    quantity,
                },
            ];
            const newCheckout = await client.checkout.addLineItems(checkout.id, lineItemsToAdd);
            setCheckout(newCheckout);
            setCartOpen(true);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.error(e);
        }
    };
    const updateQuantity = async (id, quantity) => {
        try {
            setLoading(true);
            const lineItemsToUpdate = [
                {
                    id,
                    quantity,
                },
            ];
            const newCheckout = await client.checkout.updateLineItems(checkout.id, lineItemsToUpdate);
            setCheckout(newCheckout);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.error(e);
        }
    };
    const removeProductFromCart = async (id) => {
        try {
            setLoading(true);
            const lineItemIdsToRemove = [id];
            const newCheckout = await client.checkout.removeLineItems(checkout.id, lineItemIdsToRemove);
            setCheckout(newCheckout);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.error(e);
        }
    };
    const checkCoupon = async (coupon) => {
        try {
            setLoading(true);
            const newCheckout = await client.checkout.addDiscount(checkout.id, coupon);
            setCheckout(newCheckout);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.error(e);
        }
    };
    const removeCoupon = async (coupon) => {
        try {
            setLoading(true);
            const newCheckout = await client.checkout.removeDiscount(checkout.id, coupon);
            setCheckout(newCheckout);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.error(e);
        }
    };
    const quantity = checkout.lineItems.reduce((total, item) => total + item.quantity, 0);
    useEffect(() => {
        const createNewCheckout = async () => {
            try {
                const newCheckout = await client.checkout.create();
                if (isBrowser) {
                    localStorage.setItem('checkout_id', newCheckout.id);
                }
                return newCheckout;
            } catch (e) {
                console.error(e);
            }
        };
        const initializeCheckout = async () => {
            try {
                const currentCheckoutId = isBrowser ? localStorage.getItem('checkout_id') : null;
                let newCheckout = null;
                if (currentCheckoutId) {
                    newCheckout = await client.checkout.fetch(currentCheckoutId);
                    if (newCheckout.completedAt) {
                        newCheckout = await createNewCheckout();
                    }
                } else {
                    newCheckout = await createNewCheckout();
                }
                setCheckout(newCheckout);
            } catch (e) {
                console.error(e);
            }
        };
        initializeCheckout();
    }, []);
    return (
        <ShopContext.Provider
            value={{
                ...defaultValues,
                quantity,
                checkout,
                coupon,
                addProductToCart,
                updateQuantity,
                removeProductFromCart,
                onCouponChange,
                checkCoupon,
                removeCoupon,
            }}
        >
            {children}
        </ShopContext.Provider>
    );
};
