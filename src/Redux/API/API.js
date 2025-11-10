import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
// const baseUrl = "/api";

//Login

export const login = createAsyncThunk("login", async (data) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/login`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
});



// Dashboard

export const dashboard = createAsyncThunk("dashboard", async () => {
  try {
    const response = await axios.get(`${baseUrl}/dashboard/all`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
});


//Events

export const getEvent = createAsyncThunk("getEvent", async ({ page, searchTerm = '', userId, user=false}) => {
  try {
    const url = user?`${baseUrl}/event/list?limit=10&page=${page}&search=${searchTerm}&userId=${userId}`:`${baseUrl}/event/list?limit=10&page=${page}&search=${searchTerm}`
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
});

export const createEvent = createAsyncThunk("createEvent", async (data) => {
  try {
    const response = await axios.post(`${baseUrl}/event/create`, data,);
    return response;
  } catch (error) {
    throw error;
  }
});

export const updateEvent = createAsyncThunk(
  "updateEvent",
  async ({eventId,data}) => {
    try {
      const response = await axios.put(`${baseUrl}/event/update/${eventId}`,data);
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const eventById = createAsyncThunk("eventById", async (eventId) => {
  try {
    const response = await axios.get(`${baseUrl}/event/get/${eventId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
});


export const deleteEvent = createAsyncThunk(
  "deleteEvent",
  async (eventId) => {
    try {
      const response = await axios.delete(`${baseUrl}/event/delete/${eventId}`);
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const EventCSV = createAsyncThunk("EventCSV", async () => {
  try {
    const response = await axios.get(`${baseUrl}/event/export/excel`, {
      responseType:'blob',
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
});


export const EventCategoryList = createAsyncThunk("EventCategoryList", async ({eventName = '', getAll=false }) => {
  try {
    const url = getAll?`${baseUrl}/event/eventCategoryList`:`${baseUrl}/event/eventCategoryList?search=${eventName}`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
});


//Organisation

export const createOrganisation = createAsyncThunk(
  "createOrganisation",
  async (data) => {
    try {
      const response = await axios.post(
        `${baseUrl}/organization/create`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const getOrganisation = createAsyncThunk("getOrganisation", async ({ page, searchTerm = '', getAll = false}) => {
  try {
    const url = getAll?`${baseUrl}/organization/list`:`${baseUrl}/organization/list?limit=0&page=${page}&search=${searchTerm}`
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
});

export const updateOrganization = createAsyncThunk(
  "updateOrganization",
  async ({organizationId,data}) => {
    try {
      const response = await axios.put(`${baseUrl}/organization/update/${organizationId}`,data);
      return response;
    } catch (error) {
      return error;
    }
  }
);


export const deleteOrganization = createAsyncThunk(
  "deleteOrganization",
  async (organizationId) => {
    try {
      const response = await axios.delete(`${baseUrl}/organization/delete/${organizationId}`);
      return response;
    } catch (error) {
      return error;
    }
  }
);


export const getOrganisationUser = createAsyncThunk("getOrganisationUser", async () => {
  try {
    const response = await axios.get(`${baseUrl}/organization/orgUserList`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
});

// Users

export const getUsers = createAsyncThunk("getUsers", async ({ page, searchTerm = '', getAll = false }) => {
  try {
    const url = getAll?`${baseUrl}/users/list`:`${baseUrl}/users/list?limit=0&page=${page}&search=${searchTerm}`
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
});

export const createUser = createAsyncThunk("createUser", async (data) => {
  try {
    const response = await axios.post(`${baseUrl}/users/create`, data,);
    return response;
  } catch (error) {
    throw error;
  }
});


export const updateUser = createAsyncThunk(
  "updateUser",
  async ({userId,data}) => {
    try {
      const response = await axios.put(`${baseUrl}/users/update/${userId}`,data);
      return response;
    } catch (error) {
      return error;
    }
  }
);


export const deleteUser = createAsyncThunk(
  "deleteUser",
  async (userId) => {
    try {
      const response = await axios.delete(`${baseUrl}/users/delete/${userId}`);
      return response;
    } catch (error) {
      return error;
    }
  }
);


// Category 

export const getCategories = createAsyncThunk("getCategories", async ({ page, searchTerm = '', getAll = false  }) => {
  try {
     const url = getAll 
      ? `${baseUrl}/categories/list` // Set a high limit to get all records
      : `${baseUrl}/categories/list?page=${page}&limit=10&search=${searchTerm}`;
      
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
});


export const createCategory = createAsyncThunk("createCategory", async (data) => {
  try {
    const response = await axios.post(`${baseUrl}/categories/create`, data,);
    return response;
  } catch (error) {
    throw error;
  }
});

export const updateCategory = createAsyncThunk(
  "updateCategory",
  async ({categoryId,data}) => {
    try {
      const response = await axios.put(`${baseUrl}/categories/update/${categoryId}`,data);
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "deleteUser",
  async (categoryId) => {
    try {
      const response = await axios.delete(`${baseUrl}/categories/delete/${categoryId}`);
      return response;
    } catch (error) {
      return error;
    }
  }
);


export const completeCategory = createAsyncThunk("completeCategory", async ({categoryId,data}) => {
  try {
    const response = await axios.put(`${baseUrl}/categories/updateStatus/${categoryId}`, data,);
    return response;
  } catch (error) {
    throw error;
  }
});


//Participants

export const getParticipant = createAsyncThunk("getParticipant", async ({ page, searchTerm = '' ,eventId,categoryId, event = false }) => {
  try {
    const url = event?`${baseUrl}/participants/list?limit=10&page=${page}&eventId=${eventId}&categoryId=${categoryId}&search=${searchTerm}`:`${baseUrl}/participants/list?limit=10&page=${page}&search=${searchTerm}`
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
});

export const getParticipantById = createAsyncThunk("getParticipantById", async (participantId) => {
  try {
    const url = `${baseUrl}/participants/view/${participantId}`
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
});


export const ParticipantDownload = createAsyncThunk("ParticipantDownload", async (eventId) => {
  try {
    const response = await axios.get(`${baseUrl}/participants/export/excel/${eventId}`, {
      responseType:'blob',
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
});
export const ParticipantSample = createAsyncThunk("ParticipantSample", async () => {
  try {
    const response = await axios.get(`${baseUrl}/participants/sampleFile`, {
      responseType:'blob',
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
});

export const uploadParticipant = createAsyncThunk("uploadParticipant", async (formData) => {
  try {
    const response = await axios.post(`${baseUrl}/participants/uploadThroughExcel`, formData,);
    return response;
  } catch (error) {
    throw error;
  }
});

export const createParticipant = createAsyncThunk("createParticipant", async (data) => {
  try {
    const response = await axios.post(`${baseUrl}/participants/create`, data,);
    return response;
  } catch (error) {
    throw error;
  }
});

export const updateParticipant = createAsyncThunk(
  "updateParticipant",
  async ({participantId,formData}) => {
    try {
      const response = await axios.put(`${baseUrl}/participants/update/${participantId}`,formData);
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const deleteParticipant = createAsyncThunk(
  "deleteParticipant",
  async (participantId) => {
    try {
      const response = await axios.delete(`${baseUrl}/participants/delete/${participantId}`);
      return response;
    } catch (error) {
      return error;
    }
  }
);


// Result

export const createResult = createAsyncThunk("createResult", async (data) => {
  try {
    const response = await axios.post(`${baseUrl}/event/eventResult`, data,);
    return response;
  } catch (error) {
    throw error;
  }
});


export const getResult = createAsyncThunk("getParticipant", async ({ page, searchTerm = '' ,eventId,categoryId }) => {
  try {
    const url = `${baseUrl}/event/resultList/${eventId}/${categoryId}?limit=10&page=${page}&search=${searchTerm}`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
});



// Change Password 

export const changePassword = createAsyncThunk("changePassword", async ({Id,data}) => {
  try {
    const response = await axios.put(`${baseUrl}/auth/updatePassword/${Id}`, data,);
    return response;
  } catch (error) {
    throw error;
  }
});