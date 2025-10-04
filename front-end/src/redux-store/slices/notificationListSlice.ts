import { iconType } from "@/components/notification";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface notification {
    id: string,
    iconType?: iconType,
    content: string
}

const initialState: notification[] = [];

const notificationListSlice = createSlice({
    name: "notificationListSlice",
    initialState: initialState,
    reducers: {
        add: (state, action: PayloadAction<notification>) => {
            state.push(action.payload);
            return state;
        },
        remove: (state, action: PayloadAction<{ id: string }>) => {
            for (let notification of state) {
                if (notification.id === action.payload.id) {
                    state.splice(state.indexOf(notification), 1);
                }
            }
            return state;
        }
    }
});

export const { add, remove } = notificationListSlice.actions;
export default notificationListSlice.reducer;