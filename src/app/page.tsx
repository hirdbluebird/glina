"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { FormEvent, useState } from "react";

export default function Home() {
  const [data, setData] = useState();
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [receiptSource, setReceiptSource] = useState("camera");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    setUploadInProgress(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await fetch("/api/receipt", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setData(data);
    setUploadInProgress(false);
  };

  return (
    <main className={styles.main}>
      {uploadInProgress && <div className="loader" />}
      <div className={styles.center}>
        <form onSubmit={submit}>
          <p>
            <label htmlFor="camera">
              <input
                id="camera"
                type="radio"
                name="receiptSource"
                checked={receiptSource === "camera"}
                onClick={() => setReceiptSource("camera")}
              />
              <span> Take a photo </span>
            </label>
          </p>
          <p>
            <label htmlFor="file">
              <input
                id="file"
                type="radio"
                name="receiptSource"
                checked={receiptSource === "file"}
                onClick={() => setReceiptSource("file")}
              />
              <span> Upload file </span>
            </label>
          </p>
          <input
            type="file"
            accept="image/*"
            capture={receiptSource === "camera"}
            checked={receiptSource === "camera"}
            name="photo"
          />
          <button type="submit" disabled={uploadInProgress}>
            Send image
          </button>
        </form>
      </div>
      <pre>{data && JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
