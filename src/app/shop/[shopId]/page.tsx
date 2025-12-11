"use client";
import { useEffect, useState } from "react";

export default function ShopPage({ params }: { params: { shopId: string } }) {
  const { shopId } = params;

  console.log("SHOP ID:", shopId);

  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ai-shop-backend-2.onrender.com";

  useEffect(() => {
    if (!shopId) {
      console.log("shopId gelmedi, bekleniyor...");
      return;
    }

    console.log("FETCH →", `${API_URL}/api/shop/public/${shopId}`);

    fetch(`${API_URL}/api/shop/public/${shopId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.ok) {
          setError("Mağaza bulunamadı ❌");
        } else {
          setShop(data.shop);
        }
      })
      .catch(() => setError("Sunucu hatası!"))
      .finally(() => setLoading(false));
  }, [shopId]);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Mağaza: {shop.shopId}</h1>
      <p>Mağaza verileri başarıyla yüklendi ✔</p>
    </div>
  );
}
