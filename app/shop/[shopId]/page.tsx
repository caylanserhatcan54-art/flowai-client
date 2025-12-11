"use client";

import { useEffect, useState } from "react";

export default function ShopPage({ params }: any) {
  const { shopId } = params;

  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<any>(null);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function loadShop() {
      try {
        const res = await fetch(`${API_URL}/shop/public/${shopId}`);

        if (!res.ok) {
          setError("Sunucu hatası!");
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (!data.ok) {
          setError("Mağaza bulunamadı ❌");
          setLoading(false);
          return;
        }

        setShop(data.shop);
        setLoading(false);

      } catch (err) {
        console.error(err);
        setError("Bağlantı hatası!");
        setLoading(false);
      }
    }

    loadShop();
  }, [shopId, API_URL]);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Mağaza: {shop.shopName}</h1>

      <p>Mağaza ID: {shop.shopId}</p>
      <p>Platform: {shop.platform}</p>

      <hr />

      {/* Sohbet Asistanı */}
      <iframe
        src={`/assistant?shop=${shopId}`}
        style={{
          width: "100%",
          height: "80vh",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      />
    </div>
  );
}
