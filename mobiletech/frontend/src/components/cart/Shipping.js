import { useDispatch, useSelector } from "react-redux";
import { Fragment, useState } from "react";
import { countries } from 'countries-list';
import { saveShippingInfo } from "../../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutStep";
import { toast } from "react-toastify";

// Validation function to check valid phone number, postal code, and city
const isValidPhoneNumber = (phoneNo) => {
    const phoneRegex = /^[6-9][0-9]{9}$/; // Must start with 6-9 and be exactly 10 digits
    return phoneRegex.test(phoneNo);
};

const isValidPostalCode = (postalCode) => {
    const postalRegex = /^[0-9]{6}$/; // Must be exactly 6 digits
    return postalRegex.test(postalCode);
};

const isValidCity = (city) => {
    const cityRegex = /^[a-zA-Z\s]+$/; // Must contain only alphabetic characters and spaces
    return cityRegex.test(city);
};

export const validateShipping = (shippingInfo, navigate) => {
    if (
        !shippingInfo.address ||
        !shippingInfo.city ||
        !shippingInfo.state || 
        !shippingInfo.country ||
        !shippingInfo.phoneNo ||
        !shippingInfo.postalCode
    ) {
        toast.error('Please fill in all the shipping information', { position: toast.POSITION.BOTTOM_CENTER });
        navigate('/shipping');
        return false;
    }

    if (!isValidPhoneNumber(shippingInfo.phoneNo)) {
        toast.error('Invalid phone number. Must be 10 digits and start with a number between 6 and 9.', { position: toast.POSITION.BOTTOM_CENTER });
        navigate('/shipping');
        return false;
    }

    if (!isValidPostalCode(shippingInfo.postalCode)) {
        toast.error('Invalid postal code. Must be exactly 6 digits.', { position: toast.POSITION.BOTTOM_CENTER });
        navigate('/shipping');
        return false;
    }

    if (!isValidCity(shippingInfo.city)) {
        toast.error('Invalid city name. City must only contain alphabetic characters.', { position: toast.POSITION.BOTTOM_CENTER });
        navigate('/shipping');
        return false;
    }

    return true;
};

export default function Shipping() {
    const { shippingInfo = {} } = useSelector(state => state.cartState);

    const [address, setAddress] = useState(shippingInfo.address);
    const [city, setCity] = useState(shippingInfo.city);
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
    const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
    const [country, setCountry] = useState(shippingInfo.country);
    const [state, setState] = useState(shippingInfo.state);
    const countryList = Object.values(countries);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();

        const shippingData = { address, city, phoneNo, postalCode, country, state };

        if (!validateShipping(shippingData, navigate)) return;

        dispatch(saveShippingInfo(shippingData));
        navigate('/order/confirm');
    };

    return (
        <Fragment>
            <CheckoutSteps shipping />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg">
                        <h1 className="mb-4">Shipping Info</h1>

                        <div className="form-group">
                            <label htmlFor="address_field">Address</label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city_field">City</label>
                            <input
                                type="text"
                                id="city_field"
                                className="form-control"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone_field">Phone No</label>
                            <input
                                type="tel"
                                id="phone_field"
                                className="form-control"
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="postal_code_field">Postal Code</label>
                            <input
                                type="number"
                                id="postal_code_field"
                                className="form-control"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country_field">Country</label>
                            <select
                                id="country_field"
                                className="form-control"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            >
                                {countryList.map((country, i) => (
                                    <option key={i} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="state_field">State</label>
                            <input
                                type="text"
                                id="state_field"
                                className="form-control"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            id="shipping_btn"
                            type="submit"
                            className="btn btn-block py-3"
                        >
                            CONTINUE
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}
