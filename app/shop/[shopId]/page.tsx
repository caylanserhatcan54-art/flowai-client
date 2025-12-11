"use client";

import { useEffect, useState } from "react";

export default function ShopPage({ params }: any) {
  const { shopId } = params;

  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<any>(null);
  const [error, setError] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  // ------------------------------
  //  SHOP GETIR
  // ------------------------------
  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    if (!API_URL) {
      console.error("NEXT_PUBLIC_API_URL tanımlı değil!");
      setError(true);
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/shop/public/${shopId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setShop(data.shop);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(true);
        setLoading(false);
      });
  }, [shopId]);

  // ------------------------------
  //  MESAJ GONDER
  // ------------------------------
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const content = input;
    setInput("");

    // AI typing
    setMessages((prev) => [...prev, { sender: "typing", text: "" }]);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${API_URL}/api/assistant/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId, message: content }),
      });

      const data = await res.json();

      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.sender !== "typing");
        return [...filtered, { sender: "ai", text: data.answer || "Bir cevap alınamadı." }];
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sunucuya bağlanılamadı ❌" },
      ]);
    }
  };

  // ------------------------------
  //  UI
  // ------------------------------

  if (loading)
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        Yükleniyor...
      </div>
    );

  if (error)
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl text-red-500 font-bold">Mağaza bulunamadı ❌</h1>
        <p>{shopId} ID bulunamadı.</p>
      </div>
    );

  return (
    <div className="h-screen bg-[#202123] text-gray-100 flex flex-col">

      {/* HEADER */}
      <div className="p-4 border-b border-gray-700 text-center font-semibold">
        {shop.shopName}
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {/* Default AI message */}
        {messages.length === 0 && (
          <div className="bg-gray-700 p-3 rounded-lg max-w-[75%]">
            Selam 👋 Ben mağaza yapay zeka asistanınız.
            Ürün sorgulayabilir ve kombin isteyebilirsiniz.
          </div>
        )}

        {messages.map((msg, i) => {
          if (msg.sender === "typing") {
            return (
              <div key={i} className="bg-gray-700 p-3 rounded-lg max-w-[60%]">
                <span className="animate-pulse">AI yazıyor...</span>
              </div>
            );
          }

          return msg.sender === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="bg-blue-500 text-white p-3 rounded-lg max-w-[75%]">
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={i} className="bg-gray-700 p-3 rounded-lg max-w-[75%]">
              {msg.text}
            </div>
          );
        })}
      </div>

      {/* INPUT BAR */}
      <div className="p-3 border-t border-gray-700 flex gap-2">
        <input
          className="flex-1 p-3 rounded-lg bg-gray-700 outline-none"
          placeholder="Mesaj yazın..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="px-4 bg-blue-500 rounded-lg" onClick={sendMessage}>
          Gönder
        </button>
      </div>

    </div>
  );
}
