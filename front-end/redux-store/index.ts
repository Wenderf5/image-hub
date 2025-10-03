import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./slices/notificationListSlice";

export const reduxStore = configureStore({
    reducer: {
        notificationList: notificationReducer
    }
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;