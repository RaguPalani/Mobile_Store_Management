import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { createNewProduct } from "../../actions/productActions";
import { clearError, clearProductCreated } from "../../slices/productSlice";
import { toast } from "react-toastify";

export default function NewProduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [brand, setBrand] = useState("");
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    
    const { loading, isProductCreated, error } = useSelector(state => state.productState);

    const categories = [
        'Mobile',
        'Laptops',
        'Accessories',
        ];

    const brands = [
            'Samsung',
            'IPhone',
            'Vivo',
            'Oppo',
            'Realme',
            'Redmi',
            'IQOO',
            'Infinix',
            'POCO',
            'Moto',
            'HP',
            'DELL',
            'ASUS',
            'Boat',
            'Lenovo'
    ]

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onImagesChange = (e) => {
        const files = Array.from(e.target.files);

        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = () => {
                if(reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, file])
                }
            }

            reader.readAsDataURL(file)
        })
    };

    const submitHandler = (e) => {
        e.preventDefault();

        // Check if brand field is empty
        // if (!brand) {
        //     toast.error('Please enter a brand name', {
        //         position: toast.POSITION.BOTTOM_CENTER,
        //     });
        //     return; // Prevent form submission if brand is empty
        // }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('description', description);
        formData.append('brand', brand);
        formData.append('category', category);
        images.forEach(image => {
            formData.append('images', image)
        });

        dispatch(createNewProduct(formData));
    };

    useEffect(() => {
        if(isProductCreated) {
            toast('Product Created Successfully!', {
                type: 'success',
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => dispatch(clearProductCreated())
            });
            navigate('/admin/products');
            return;
        }

        if(error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => { dispatch(clearError()) }
            });
            return;
        }
    }, [isProductCreated, error, dispatch]);

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <Fragment>
                    <div className="wrapper my-5">
                        <form onSubmit={submitHandler} className="shadow-lg" encType="multipart/form-data">
                        <h1 className="mb-3 text-center text-uppercase">New Product</h1>

                            <div className="form-group">
                                <label htmlFor="name_field">Name</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    className="form-control"
                                    onChange={e => setName(e.target.value)}
                                    value={name}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price_field">Price</label>
                                <input
                                    type="text"
                                    id="price_field"
                                    className="form-control"
                                    onChange={e => setPrice(e.target.value)}
                                    value={price}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description_field">Description</label>
                                <textarea 
                                    className="form-control"
                                    id="description_field" 
                                    rows="8"
                                    onChange={e => setDescription(e.target.value)}
                                    value={description}
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="category_field">Category</label>
                                <select onChange={e => setCategory(e.target.value)} className="form-control" id="category_field">
                                    <option value="">Select</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="stock_field">Stock</label>
                                <input
                                    type="number"
                                    id="stock_field"
                                    className="form-control"
                                    onChange={e => setStock(e.target.value)}
                                    value={stock}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="brand_field">Brand Name</label>
                                <select
                                    id="brand_field"
                                    className="form-control"
                                    onChange={e => setBrand(e.target.value)}
                                    value={brand}
                                >
                                    <option value="">Select Brand</option>
                                    {brands.map((brand) => (
                                        <option key={brand} value={brand}>
                                            {brand}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Images</label>
                                <div className="custom-file">
                                    <input
                                        type="file"
                                        name="product_images"
                                        className="custom-file-input"
                                        id="customFile"
                                        multiple
                                        onChange={onImagesChange}
                                    />
                                    <label className="custom-file-label" htmlFor="customFile">
                                        Choose Images
                                    </label>
                                </div>
                                {imagesPreview.map(image => (
                                    <img
                                        className="mt-3 mr-2"
                                        key={image}
                                        src={image}
                                        alt="Image Preview"
                                        width="55"
                                        height="52"
                                    />
                                ))}
                            </div>

                            <button
                                id="login_button"
                                type="submit"
                                disabled={loading}
                                className="btn btn-block py-3"
                            >
                                CREATE
                            </button>
                        </form>
                    </div>
                </Fragment>
            </div>
        </div>
    );
}
