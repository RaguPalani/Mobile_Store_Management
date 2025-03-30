import axios from "axios";
import {
  newServiceRequest,
  newServiceSuccess,
  newServiceFail,
  fetchServicesRequest,
  fetchServicesSuccess,
  fetchServicesFail,
} from "../slices/serviceSlice";

// Create a new service
export const createNewService = (serviceData) => async (dispatch) => {
  try {
    dispatch(newServiceRequest());

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await axios.post("/api/v1/admin/service/new", serviceData, config);
    dispatch(newServiceSuccess(data));
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : "An unexpected error occurred";
    dispatch(newServiceFail(errorMessage));
  }
};

// Fetch all services
export const fetchAllServices = (searchTerm = "") => async (dispatch) => {
    try {
      dispatch(fetchServicesRequest());
  
      // Replace this URL with your actual backend API route
      const { data } = await axios.get(`/api/v1/admin/services?search=${searchTerm}`);
  
      // Assuming 'data.services' contains the array of service objects
      dispatch(fetchServicesSuccess(data.services));
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : "Failed to load services";
      dispatch(fetchServicesFail(errorMessage));
    }
  };
