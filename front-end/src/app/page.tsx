"use client"

import style from "./page.module.css";
import { Notification } from "@/components/notification";
import { ResizeCard } from "@/components/resizeCard";
import { useSelector } from "react-redux";
import { RootState } from "../redux-store";

export default function Home() {
  const notificationList = useSelector((state: RootState) => state.notificationList);

  return (
    <main className={style.main}>
      {notificationList.map((notification) => (
        <Notification
          key={notification.id}
          icon={notification.icon}
          content={notification.content}
        />
      ))}
      <ResizeCard />
    </main>
  )
}
