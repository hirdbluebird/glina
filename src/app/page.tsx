"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { FormEvent, useState } from "react";

export default function Home() {
  const [data, setData] = useState();
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData(e.currentTarget);
    console.log(formData);
    const response = await fetch("/api/receipt", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setData(data);
  };

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <form onSubmit={submit}>
          <input type="file" accept="image/*" capture name="photo" />
          <button type="submit">Send image</button>
        </form>
      </div>
      {data && JSON.stringify(data, null, 2)}
    </main>
  );
}
