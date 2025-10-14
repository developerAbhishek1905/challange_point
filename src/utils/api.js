import axios from "axios";
import { updateUser } from "../Redux/API/API";
const BASE_URL ="http://localhost:5001/"

const headers={
    'Content-Type': 'application/json',
    'x-user-email': 'shubhampalpal832@gmail.com',
}


export const getAllOrganizationsList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}api/organizations`,{ headers: headers });
    return response.data;
    
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw error;
  }
}

export const createOrganization = async (organizationData) => {
  try {
    const response = await axios.post(`${BASE_URL}api/organizations`, organizationData, { headers: headers });
    return response.data;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw error;
  }
};

export const updateOrganization = async (id, organizationData) => {
  try {
    const response = await axios.put(`${BASE_URL}api/organizations/${id}`,organizationData, { headers: headers });
    return response.data;
  } catch (error) {
    console.error("Error updating organization:", error);
    throw error;
  }
};

export const deleteOrganization = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}api/organizations/${id}`, { headers: headers });
    return response.data;
  } catch (error) {
    console.error("Error deleting organization:", error);
    throw error;
  }
};


//get all challange list 

export const getAllChallangeList = async (page) => {
  try {
    const response = await axios.get(`${BASE_URL}api/challenges/allglobalchallenges`,{
        params: { page: page, },
        headers: headers });
    console.log("Challenges data:", response.data); // Log the response data
    return response.data;
    
  } catch (error) {
    console.error("Error fetching challenges:", error);
    throw error;
  }
}

//get leaderboard


export const getLeaderboard = async () => {
  try {
    const response = await axios.get(`${BASE_URL}api/challenges/leader-boards`,{ headers: headers });
    console.log("Leaderboard data:", response.data); // Log the response data
    return response.data;
    
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
}

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}api/user/users`,{ headers: headers });
    return response.data;
    
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export const getUserById = async (id,user) => {
  try {
    const response = await axios.get(`${BASE_URL}api/users/${id}`,{ headers: headers });
    return response.data;
    
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
} 

export const signUp = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}api/user/sign-up`,userData,{ headers: headers });
    return response.data;
    
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export const userUpdate = async (id, userData) => { 
  try {
    const response = await axios.put(`${BASE_URL}api/user/update/${id}`,userData, { headers: headers });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}api/users/${id}`, { headers: headers });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}