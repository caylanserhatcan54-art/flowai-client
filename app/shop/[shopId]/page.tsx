"use client";
import { useEffect, useState } from "react";

export default function ShopPage({ params }: { params: { shopId?: string } }) {
  const shopId = params?.shopId;

  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://ai-shop-backend-2.onrender.com";

  useEffect(() => {
    // ❌ shopId yoksa fetch başlatma
    if (!shopId) {
      console.log("shopId henüz gelmedi, bekleniyor...");
      return;
    }

    console.log("SHOP ID:", shopId);
    console.log("FETCH:", `${API_URL}/api/shop/public/${shopId}`);

    async function loadShop() {
      try {
        const res = await fetch(`${API_URL}/api/shop/public/${shopId}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!data.ok) {
          setError("Mağaza bulunamadı ❌");
        } else {
          setShop(data.shop);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Sunucu hatası!");
      }

      setLoading(false);
    }

    loadShop();
  }, [shopId]);

  if (!shopId) return <p>Hazırlanıyor...</p>;
  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Mağaza: {shopId}</h1>
      <p>Mağaza verileri başarıyla yüklendi ✔</p>
    </div>
  );
}
