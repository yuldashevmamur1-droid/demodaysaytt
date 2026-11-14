const BOT_TOKEN = "9111452440:AAFrj3loFA4P_kPQe_BoPJf7GcC-ONitIh0";
const CHAT_ID = "ID: 7679215827"; // Faqat raqam (guruh bo'lsa -100 bilan boshlanadi)
// HTML maxsus belgilarini (&, <, >) xavfsiz qilish funksiyasi
    function escapeHTML(str) {
      return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    async function sendToTelegramBot(text) {
      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: "HTML"
        })
      });
      return res.json();
    }

    async function submitOrderToTelegramBot(e) {
      e.preventDefault();
      if (state.cart.length === 0) {
        showToast("⚠️ Savatingiz bo'sh!");
        return;
      }

      const btn = document.getElementById("submitOrderBtn");
      const originalBtnHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<i class="ri-loader-4-line"></i> Yuborilmoqda...`;

      const name = escapeHTML(document.getElementById("orderCustomerName").value.trim());
      const phone = escapeHTML(document.getElementById("orderCustomerPhone").value.trim());
      const type = escapeHTML(document.getElementById("orderType").value);
      const pay = escapeHTML(document.getElementById("orderPayment").value);
      const addr = escapeHTML(document.getElementById("orderAddress").value.trim());
      const comm = escapeHTML(document.getElementById("orderComment").value.trim() || "Yo'q");
      const { subtotal, discount, delivery, total } = calculateCartTotals();
      const orderId = "NB-" + Math.floor(100000 + Math.random() * 900000);

      const itemsText = state.cart.map((i, idx) => {
        const rawTitle = typeof i.title === "object" ? i.title.uz : i.title;
        const safeTitle = escapeHTML(rawTitle);
        return `${idx + 1}. <b>${safeTitle}</b> (${escapeHTML(i.size)}) — ${i.qty} x ${formatUZS(i.price)} = <b>${formatUZS(i.price * i.qty)}</b>`;
      }).join("\n");

      const msg =
`☕️ <b>YANGI BUYURTMA — NOIR &amp; BEAN</b>
🆔 <b>Buyurtma:</b> #${orderId}
━━━━━━━━━━━━━━━━━━━━
👤 <b>Mijoz:</b> ${name}
📞 <b>Tel:</b> ${phone}
🚚 <b>Usul:</b> ${type}
📍 <b>Manzil:</b> ${addr}
💳 <b>To'lov:</b> ${pay}
💬 <b>Izoh:</b> ${comm}
━━━━━━━━━━━━━━━━━━━━
🛒 <b>TOVARLAR:</b>
${itemsText}
━━━━━━━━━━━━━━━━━━━━
💵 <b>Tovarlar summasi:</b> ${formatUZS(subtotal)}
🎁 <b>Chegirma:</b> -${formatUZS(discount)}
🛵 <b>Yetkazib berish:</b> ${formatUZS(delivery)}
🔥 <b>JAMI TO'LOV: ${formatUZS(total)}</b>`;

      try {
        const res = await sendToTelegramBot(msg);
        if (res.ok) {
          state.cart = [];
          localStorage.setItem("nb_cart", "[]");
          updateCartUI();
          closeAllDrawersAndModals();
          e.target.reset();
          showToast(`✅ Buyurtma #${orderId} Telegram botingizga tushdi!`);
        } else {
          console.error("Telegram API Error:", res);
          if (res.error_code === 401) {
            showToast("⚠️ BOT_TOKEN xato! @BotFather dan yangi token oling.");
          } else if (res.error_code === 400 && String(res.description).includes("chat not found")) {
            showToast("⚠️ Botga kirib /start bosing yoki CHAT_ID ni tekshiring!");
          } else {
            showToast("⚠️ Telegram xatosi: " + (res.description || "Noma'lum xato"));
          }
        }
      } catch (err) {
        console.error("Network Error:", err);
        showToast("⚠️ Tarmoq xatoligi! Internet yoki VPN ni tekshiring.");
      } finally {
          <nav className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-white/10 bg-[#14110f] flex-nowrap">
  <a href="#home" className="flex items-center gap-2 px-4 py-2.5 rounded-full text-gray-300 hover:text-white whitespace-nowrap shrink-0">
    <span>🏠</span>
    <span>Bosh sahifa</span>
  </a>

  <a href="#catalog" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d4a36a] text-black font-medium whitespace-nowrap shrink-0">
    <span>🍴</span>
    <span>Katalog & Menyu</span>
  </a>

  <a href="#about" className="flex items-center gap-2 px-4 py-2.5 rounded-full text-gray-300 hover:text-white whitespace-nowrap shrink-0">
    <span>🏪</span>
    <span>Kafe haqida & Filiallar</span>
  </a>

  <a href="#checkout" className="flex items-center gap-2 px-4 py-2.5 rounded-full text-gray-300 hover:text-white whitespace-nowrap shrink-0">
    <span>🛍️</span>
    <span>Rasmiylashtirish</span>
  </a>
</nav>
        btn.disabled = false;
        btn.innerHTML = originalBtnHTML;
      }
    }
