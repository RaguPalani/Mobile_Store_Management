import { Fragment, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteOrder, adminOrders as adminOrdersAction } from "../../actions/orderActions";
import { clearError, clearOrderDeleted } from "../../slices/orderSlice";
import Loader from '../layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import Sidebar from "./Sidebar";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function OrderList() {
    const { adminOrders = [], loading = true, error, isOrderDeleted } = useSelector(state => state.orderState);
    const dispatch = useDispatch();

    // Function to prepare table data
    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Number of Items',
                    field: 'noOfItems',
                    sort: 'asc'
                },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc'
                },
                {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc'
                }
            ],
            rows: []
        };

        adminOrders.forEach(order => {
            data.rows.push({
                id: order._id,
                noOfItems: order.orderItems.length,
                amount: `$${order.totalPrice}`,
                status: (
                    <p style={{ color: order.orderStatus.includes('Processing') ? 'red' : 'green' }}>
                        {order.orderStatus}
                    </p>
                ),
                actions: (
                    <Fragment>
                        <Link to={`/admin/order/${order._id}`} className="btn btn-primary">
                            <i className="fa fa-pencil"></i>
                        </Link>
                        <Button onClick={e => deleteHandler(e, order._id)} className="btn btn-danger py-1 px-2 ml-2">
                            <i className="fa fa-trash"></i>
                        </Button>
                    </Fragment>
                )
            });
        });

        return data;
    };

    // Function to delete order
    const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteOrder(id));
    };

    // Function to download orders as PDF
    const downloadPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["Order ID", "Number of Items", "Amount", "Status"];
        const tableRows = [];

        adminOrders.forEach(order => {
            const orderData = [
                order._id,
                order.orderItems.length,
                `$${order.totalPrice}`,
                order.orderStatus
            ];
            tableRows.push(orderData);
        });

        doc.autoTable(tableColumn, tableRows, { startY: 20 });
        doc.text("Order List Report", 14, 15);
        doc.save(`order_list_report.pdf`);
    };

    useEffect(() => {
        if (error) {
            toast(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: () => { dispatch(clearError()); }
            });
            return;
        }
        if (isOrderDeleted) {
            toast('Order Deleted Successfully!', {
                type: 'success',
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => dispatch(clearOrderDeleted())
            });
            return;
        }

        dispatch(adminOrdersAction);
    }, [dispatch, error, isOrderDeleted]);

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
            <h1 className="mb-3 text-center text-uppercase">Order List</h1>
                <Fragment>
                    {loading ? <Loader /> : (
                        <Fragment>
                            <MDBDataTable
                                data={setOrders()}
                                bordered
                                striped
                                hover
                                className="px-3"
                                noBottomColumns
                            />
                            {/* Button to download PDF */}
                            <div className="row justify-content-center mt-3">
                                <Button onClick={downloadPDF} className="btn btn-success">
                                    Download PDF Report
                                </Button>
                            </div>
                        </Fragment>
                    )}
                </Fragment>
            </div>
        </div>
    );
}
