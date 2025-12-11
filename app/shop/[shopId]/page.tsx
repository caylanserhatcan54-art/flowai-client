"use client";
import { useEffect, useState } from "react";

export default function ShopPage({ params }: { params: { shopId: string } }) {
  const { shopId } = params;

  // 🔥 Debug Log
  console.log("SHOP ID:", shopId);

  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ai-shop-backend-2.onrender.com";

  useEffect(() => {
    console.log("ENV:", process.env.NEXT_PUBLIC_API_URL);
    console.log("SHOP ID:", shopId);
    console.log("FETCH:", `${process.env.NEXT_PUBLIC_API_URL}/api/shop/public/${shopId}`);

    async function loadShop() {
      try {
        const res = await fetch(`${API_URL}/api/shop/public/${shopId}`);
        const data = await res.json();

        // BACKEND CEVABI:
        // { "tamam": "doğru", "mağaza": {...} }

        if (!data.tamam) {
          setError("Mağaza bulunamadı ❌");
        } else {
          setShop(data.mağaza);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Sunucu hatası!");
      }

      setLoading(false);
    }

    loadShop();
  }, [shopId]);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Mağaza: {shop.id}</h1>
      <p>Mağaza verileri başarıyla yüklendi ✔</p>

      <div
        style={{
          marginTop: 20,
          padding: 20,
          background: "#f3f3f3",
          borderRadius: 10,
        }}
      >
        <p>AI Asistan Yakında Burada 🤖</p>
      </div>
    </div>
  );
}
