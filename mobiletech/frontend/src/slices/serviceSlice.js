import { createSlice } from "@reduxjs/toolkit";

const serviceSlice = createSlice({
  name: "service",
  initialState: {
    services: [],
    service: null,
    loading: false,
    error: null,
    serviceCreated: false,
    // Removed isServiceDeleted since we're removing delete functionality
    lastFetched: null // Added to track when data was last fetched
  },
  reducers: {
    // Create a new service reducers
    newServiceRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    newServiceSuccess: (state, action) => {
      state.loading = false;
      state.serviceCreated = true;
      state.service = action.payload;
      // Add the new service to the beginning of the services array
      state.services.unshift(action.payload);
    },
    newServiceFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearServiceCreated: (state) => {
      state.serviceCreated = false;
    },

    // Fetch all services reducers
    fetchServicesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchServicesSuccess: (state, action) => {
      state.loading = false;
      state.services = action.payload;
      state.lastFetched = Date.now(); // Update last fetched timestamp
    },
    fetchServicesFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update service reducers
    updateServiceRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateServiceSuccess: (state, action) => {
      state.loading = false;
      // Update the service in the services array
      state.services = state.services.map(service => 
        service._id === action.payload._id ? action.payload : service
      );
      // Also update the single service if it's the one being viewed
      if (state.service && state.service._id === action.payload._id) {
        state.service = action.payload;
      }
    },
    updateServiceFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear error reducer
    clearError: (state) => {
      state.error = null;
    },

    // Reset service state (optional)
    resetServiceState: (state) => {
      state.services = [];
      state.service = null;
      state.loading = false;
      state.error = null;
      state.serviceCreated = false;
      state.lastFetched = null;
    }
  },
});

export const {
  newServiceRequest,
  newServiceSuccess,
  newServiceFail,
  clearServiceCreated,
  fetchServicesRequest,
  fetchServicesSuccess,
  fetchServicesFail,
  updateServiceRequest,
  updateServiceSuccess,
  updateServiceFail,
  clearError,
  resetServiceState
} = serviceSlice.actions;

export default serviceSlice.reducer;