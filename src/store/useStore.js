// store/useStore.js
import {create} from 'zustand';

const useStore = create((set) => ({
  currentUser: {
    _id: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "",
    isActive: null,
    createdAt: "",
    updatedAt: "",
    __v: 0,
    passwordResetExpires: "",
    passwordResetToken: "",
    isEmailVerified: true
},
  // Method to update details
  updateUser: (newUser) => set((state) => ({
    currentUser: { ...state.currentUser, ...newUser }
  })),
}));

export default useStore;
