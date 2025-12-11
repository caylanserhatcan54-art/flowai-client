"use client";
import { useEffect, useState } from "react";

export default function ShopPage({ params }: { params: { shopId?: string } }) {
  console.log("PARAMS:", params);

  const shopId = params?.shopId;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Eğer shopId gelmiyorsa
  if (!shopId) {
    return <p>shopId henüz gelmedi, bekleniyor...</p>;
  }

  useEffect(() => {
    async function loadShop() {
      try {
        const res = await fetch(`${API_URL}/api/shop/public/${shopId}`);
        const data = await res.json();

        if (!data.ok) {
          setError("Mağaza bulunamadı ❌");
        } else {
          setShop(data.shop);
        }

      } catch (err) {
        console.error(err);
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
      <h1>Mağaza: {shop?.shopId}</h1>
      <p>AI Asistan hazır!</p>
    </div>
  );
}
