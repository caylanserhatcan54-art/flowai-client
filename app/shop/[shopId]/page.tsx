"use client";
import { useEffect, useState } from "react";

export default function ShopPage({ params }: { params: { shopId: string } }) {
  const { shopId } = params;

  // Debug
  console.log("SHOP ID:", shopId);

  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://ai-shop-backend-2.onrender.com";

  /**
   * Güçlendirilmiş Fetch — Timeout + Retry
   */
  async function fetchWithTimeout(url: string, timeout = 45000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      return res;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  useEffect(() => {
    async function loadShop() {
      try {
        const url = `${API_URL}/api/shop/public/${shopId}`;
        console.log("FETCH URL:", url);

        let res;

        // 1. DENEME (Render uyanıyor olabilir)
        try {
          res = await fetchWithTimeout(url);
        } catch (err) {
          console.warn("⚠️ İlk istek başarısız, 3 saniye sonra tekrar deniyoruz…");
          await new Promise((r) => setTimeout(r, 3000));
        }

        // 2. DENEME (yüksek başarı)
        if (!res) {
          res = await fetchWithTimeout(url);
        }

        const data = await res.json();
        console.log("BACKEND DATA:", data);

        /**
         * Backend JSON:
         *
         * { ok: true, shop: { id, shopName, ... } }
         *
         */
        if (!data.ok) {
          setError("Mağaza bulunamadı ❌");
        } else {
          setShop(data.shop);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Sunucu hatası! (Zaman aşımı ya da bağlantı reset)");
      }

      setLoading(false);
    }

    loadShop();
  }, [shopId]);

  // UI
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

