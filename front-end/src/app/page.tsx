import style from "./page.module.css";
import { ResizeCard } from "@/components/resizeCard";

export default function Home() {
  return (
    <main className={style.main}>
      <ResizeCard />
    </main>
  )
}
