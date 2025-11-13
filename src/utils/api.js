import axiosInstance from "./axiosInstance";

// ---------------------- ORGANIZATIONS ----------------------

export const getAllOrganizationsList = async (search="",page,limit ) => {
  // console.log(limit)
  try {
    const response = search.length > 0 ? await axiosInstance.get("api/organizations", {
      params: { search,page:1,limit:8},
    }):
    await axiosInstance.get("api/organizations", {
      params: {search,page,limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw error;
  }
};

export const createOrganization = async (organizationData) => {
  try {
    const response = await axiosInstance.post("api/organizations", organizationData);
    return response.data;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw error;
  }
};

export const updateOrganization = async (id, organizationData) => {
  try {
    const response = await axiosInstance.put(`api/organizations/${id}`, organizationData);
    return response.data;
  } catch (error) {
    console.error("Error updating organization:", error);
    throw error;
  }
};

export const deleteOrganization = async (id) => {
  try {
    const response = await axiosInstance.delete(`api/organizations/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting organization:", error);
    throw error;
  }
};

export const addMember = async (orgId, userId) => {
  try {
    const response = await axiosInstance.post(`api/organizations/${orgId}/members`, userId);
    return response.data;
  } catch (error) {
    console.error("Error adding member:", error);
    throw error;
  }
};

export const approve_reject = async (orgId, status) => {
  try {
    const response = await axiosInstance.post(`api/organizations/${orgId}/approve-deny`, status);
    return response.data;
  } catch (error) {
    console.error("Error approving/rejecting org:", error);
    throw error;
  }
};

// ---------------------- CHALLENGES ----------------------

export const getAllChallangeList = async (search="",page,limit) => {
  try {
    const response = search.length > 0 ? await axiosInstance.get("api/challenges/allglobalchallenges", {
      params: { search,page:1,limit:8},
    }):await axiosInstance.get("api/challenges/allglobalchallenges", {
      params: { search,page,limit},
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching challenges:", error);
    throw error;
  }
};

export const getChallangeById = async (id) => {
  try {
    const response =  await axiosInstance.get(`api/challenges/by-challenge/${id}`)
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error fetching challenges:", error);
    throw error;
  }
};


export const deleteChallange = async (id) => {
  try {
    const response = await axiosInstance.delete(`api/challenges/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting challenge:", error);
    throw error;
  }
};

// ---------------------- LEADERBOARD ----------------------

export const getLeaderboard = async () => {
  try {
    const response = await axiosInstance.get("api/organizations/list/stats",{});
    return response.data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
};

// ---------------------- USERS ----------------------

export const getAllUsers = async (search="",page,limit) => {
  try {
    const response = search.length > 0 ? await axiosInstance.get("api/user/users",{params:{search,page : 1,limit: 8}}):  await axiosInstance.get("api/user/users",{params:{search,page,limit}});
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const signUp = async (userData) => {
  try {
    const response = await axiosInstance.post("api/user/sign-up", userData);
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const userUpdate = async (email, userData) => {
  try {
    const response = await axiosInstance.put("api/user/update", userData, {
      headers: { "x-user-email": email },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`api/user/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const getAllMembers = async (orgId) => {
  try {
    const response = await axiosInstance.get(`api/challenges/${orgId}/members`);
    return response.data;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
};

export const getUserTraitSummery = async(userId)=>{
  try {
    const response = await axiosInstance.get(`api/profileRating/${userId}/summary`);
    return response.data;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
}
// ---------------------- NOTIFICATIONS ----------------------

export const postPullNotification = async (formData) => {
  try {
    const response = await axiosInstance.post("api/user/push-notification/all", formData);
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token); // ✅ Save token
    }
    return response.data;
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
};

// ---------------------- ADMIN LOGIN ----------------------

export const adminLogin = async (formData) => {
  try {
    const response = await axiosInstance.post("api/user/admin-login", formData);
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token); // ✅ Save token
    }
    return response.data;
  } catch (error) {
    console.error("Error in admin login:", error);
    throw error;
  }
};

// ---------------------- FEEDS ----------------------

export const getAllFeeds = async (search="",page,limit) => {
  try {
    const response = search.length > 0 ? await axiosInstance.get("api/challenges/get-feed",{params:{search,page : 1,limit: 8}}): await axiosInstance.get("api/challenges/get-feed",{params:{search,page,limit}});
    return response.data;
  } catch (error) {
    console.error("Error fetching feeds:", error);
    throw error;
  }
};

export const getFeedById = async (feedId) => {
  try {
    const response = await axiosInstance.get(`api/challenges/get-single-feed/${feedId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching feed by ID:", error);
    throw error;
  }
};

export const createFeed = async (feedData) => {
  try {
    const response = await axiosInstance.post("api/challenges/create-feed", feedData);
    return response.data;
  } catch (error) {
    console.error("Error creating feed:", error);
    throw error;
  }
};

export const deleteFeed = async (feedId) => {
  try {
    const response = await axiosInstance.delete(`api/challenges/feed/${feedId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting feed:", error);
    throw error;
  }
};
