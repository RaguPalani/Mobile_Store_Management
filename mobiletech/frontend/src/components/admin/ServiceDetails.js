import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createNewService } from "../../actions/serviceActions";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

export default function ServiceForm() {
  const [mobileName, setMobileName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [complaintDetails, setComplaintDetails] = useState("");
  const [mobileColor, setMobileColor] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const dispatch = useDispatch();

  // Set current date when component mounts
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    setCurrentDate(formattedDate);
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!mobileName || !username || !phoneNumber || !complaintDetails || !mobileColor) {
      toast.error("Please fill all the fields");
      return;
    }

    const newService = {
      mobileName,
      username,
      phoneNumber,
      complaintDetails,
      mobileColor,
      serviceDate: currentDate
    };

    dispatch(createNewService(newService));
    toast.success("Service Request Created Successfully!");
    
    // Reset form after submission
    setMobileName("");
    setUsername("");
    setPhoneNumber("");
    setComplaintDetails("");
    setMobileColor("");
  };

  return (
    <div className="row">
      {/* Sidebar Section */}
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>

      {/* Main Form Section */}
      <div className="col-12 col-md-10">
        <div className="wrapper my-5">
          <form onSubmit={submitHandler} className="shadow-lg p-4" encType="multipart/form-data">
          <h1 className="mb-3 text-center text-uppercase">Add Service Details</h1>

            <div className="form-group">
              <label htmlFor="service_date">Service Date</label>
              <input
                type="date"
                id="service_date"
                className="form-control"
                value={currentDate}
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="mobile_name">Mobile Name</label>
              <input
                type="text"
                id="mobile_name"
                className="form-control"
                value={mobileName}
                onChange={(e) => setMobileName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="text"
                id="phone_number"
                className="form-control"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength="10"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="complaint_details">Complaint Details</label>
              <textarea
                id="complaint_details"
                className="form-control"
                rows="4"
                value={complaintDetails}
                onChange={(e) => setComplaintDetails(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="mobile_color">Mobile Color</label>
              <input
                type="text"
                id="mobile_color"
                className="form-control"
                value={mobileColor}
                onChange={(e) => setMobileColor(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block py-2 mt-4"
            >
              Submit 
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
