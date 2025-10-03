import style from "./page.module.css";
import { Notification } from "@/components/notification";
import { ResizeCard } from "@/components/resizeCard";

export default function Home() {
  return (
    <main className={style.main}>
      <Notification
        content="Esssa é uma notificação qualquer, por favor ignore!"
      />
      <ResizeCard />
    </main>
  )
}
