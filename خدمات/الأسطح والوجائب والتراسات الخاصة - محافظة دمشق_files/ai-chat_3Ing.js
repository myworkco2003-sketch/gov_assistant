(function () {
  if (document.getElementById("ai-chat-btn")) return;

  document.body.insertAdjacentHTML(
    "beforeend",
    `
<button id="ai-chat-btn" aria-label="مساعد ذكي">
  <span class="notif">1</span>
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6V10h12v2zm0-3H6V7h12v2z"/>
  </svg>
</button>

<div id="ai-chat-panel" role="dialog" aria-modal="true" aria-label="المساعد الذكي">
  <div id="chat-header">
    <div class="avatar">
      <svg viewBox="0 0 24 24"><path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z"/></svg>
    </div>
    <div class="info">
      <div class="name">مساعد البوابة الذكي</div>
      <div class="status">متاح الآن</div>
    </div>
    <button id="chat-close-btn" aria-label="إغلاق">✕</button>
  </div>

  <div id="chat-chips">
    <span class="chip" data-q="ما هي خدماتكم؟">خدماتنا</span>
    <span class="chip" data-q="كيف أتقدم بطلب رخصة؟">المهن والرخص</span>
    <span class="chip" data-q="كيف أقدم شكوى؟">الشكاوى</span>
    <span class="chip" data-q="ما هو الدفع الإلكتروني؟">الدفع</span>
    <span class="chip" data-q="عن الشؤون المالية؟">الشؤون المالية</span>
  </div>

  <div id="chat-messages"></div>

  <div id="chat-input-area">
    <button id="chat-send-btn" aria-label="إرسال">
      <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
    </button>
    <textarea id="chat-input" placeholder="اكتب سؤالك هنا..." rows="1"></textarea>
  </div>
</div>`,
  );

  const KB = [
    {
      keywords: ['خدمات', 'تقدم', 'ماذا', 'ما هي', 'عن الموقع', 'تعرف', 'نبذة'],
      answer: `مرحباً! 👋 تقدم البوابة مجموعة من الخدمات الإلكترونية الحكومية، تشمل:\n\n• **الشؤون المالية** – إدارة المدفوعات والرسوم\n• **التنظيم والتخطيط العمراني** – تراخيص البناء والتخطيط\n• **المهن والرخص** – استخراج وتجديد التراخيص المهنية\n• **الشكاوى** – تقديم وتتبع الشكاوى\n• **الخدمات الخارجية** – خدمات متنوعة للمتعاملين الخارجيين\n• **الدفع الإلكتروني** – سداد الرسوم بأمان\n• **المرسوم 66** – خدمات مرتبطة بالمرسوم التنظيمي رقم 66\n• **السجل المؤقت** – تسجيل مؤقت للمنشآت والأنشطة\n• **تصريح فعالية** – استخراج تصاريح إقامة الفعاليات\n\nهل تريد التفاصيل عن خدمة بعينها؟`
    },
    {
      keywords: ['مالية', 'شؤون مالية', 'رسوم', 'مدفوعات'],
      answer: `💰 **الشؤون المالية**\n\nتتيح لك هذه الخدمة:\n• الاطلاع على الرسوم والمستحقات المالية\n• سداد الفواتير الحكومية\n• الاستعلام عن حالة الدفعات\n• طباعة الإيصالات والفواتير\n\nيمكنك الوصول إلى هذه الخدمة مباشرةً من لوحة الخدمات الرئيسية. هل تحتاج مساعدة إضافية؟`
    },
    {
      keywords: ['تخطيط', 'عمراني', 'تنظيم', 'بناء'],
      answer: `🏙️ **التنظيم والتخطيط العمراني**\n\nتشمل هذه الخدمة:\n• طلبات تراخيص البناء والهدم\n• الاستعلام عن مخططات التنظيم\n• اعتماد المخططات الهندسية\n• متابعة طلبات التخطيط العمراني\n\nيرجى تجهيز المستندات اللازمة (الهوية، عقد الملكية، المخططات) عند تقديم طلبك.`
    },
    {
      keywords: ['رخصة', 'ترخيص', 'مهن', 'رخص', 'تجديد رخصة', 'مهنة'],
      answer: `📄 **المهن والرخص**\n\nمن خلال هذه الخدمة يمكنك:\n• تقديم طلب استخراج رخصة مهنية جديدة\n• تجديد رخصة قائمة\n• الاستعلام عن حالة الطلب\n• دفع رسوم الترخيص إلكترونياً\n\n**الخطوات:**\n1. تسجيل الدخول بحساب المتعامل\n2. اختيار "المهن والرخص"\n3. تعبئة النموذج ورفع المستندات\n4. سداد الرسوم والمتابعة\n\nهل لديك استفسار محدد؟`
    },
    {
      keywords: ['شكوى', 'شكاوى', 'تقديم شكوى', 'بلاغ'],
      answer: `📋 **الشكاوى والبلاغات**\n\nيتيح نظام الشكاوى:\n• تقديم شكوى جديدة بسهولة\n• متابعة حالة الشكوى المقدمة\n• تلقّي إشعارات بآخر المستجدات\n• إرفاق المستندات والصور الداعمة\n\n**للتقديم:** اضغط على خدمة "الشكاوى" من الصفحة الرئيسية، أدخل بياناتك واشرح مشكلتك بالتفصيل.\n\nملاحظة: سيتم الرد خلال 5–7 أيام عمل.`
    },
    {
      keywords: ['دفع', 'الدفع الإلكتروني', 'بطاقة', 'سداد', 'فاتورة'],
      answer: `💳 **الدفع الإلكتروني**\n\nنوفر بيئة دفع آمنة تدعم:\n• **بطاقات الائتمان والخصم** (Visa / MasterCard)\n• **التحويل البنكي** المباشر\n• **محافظ الدفع الإلكتروني**\n\nجميع المعاملات مشفّرة ومؤمّنة. يمكنك طباعة الإيصال فور اكتمال الدفع.\n\nهل تواجه مشكلة في عملية الدفع؟`
    },
    {
      keywords: ['مرسوم', '66', 'مرسوم 66'],
      answer: `📜 **المرسوم 66**\n\nيُنظّم هذا المرسوم عدداً من الأنشطة والمنشآت. تتيح لك الخدمة:\n• الاطلاع على نص المرسوم ولوائحه التنفيذية\n• تقديم طلبات مرتبطة بالمرسوم\n• الاستعلام عن الامتثال والاشتراطات\n• تسجيل المنشأة وفق أحكام المرسوم\n\nللمزيد من التفاصيل يُرجى التواصل مع الجهة المختصة أو زيارة الخدمة مباشرةً.`
    },
    {
      keywords: ['سجل', 'مؤقت', 'السجل المؤقت', 'تسجيل مؤقت'],
      answer: `🗂️ **السجل المؤقت**\n\nيُتيح لك هذا السجل:\n• تسجيل منشأة أو نشاط تجاري بصورة مؤقتة ريثما تكتمل الإجراءات الرسمية\n• الحصول على رقم سجل للتعامل مع الجهات الأخرى\n• تحديث البيانات وإكمال التسجيل الدائم لاحقاً\n\nمدة السجل المؤقت قابلة للتمديد وفق اللوائح المعمول بها.`
    },
    {
      keywords: ['فعالية', 'تصريح', 'حفل', 'مناسبة', 'مهرجان', 'ترخيص فعالية'],
      answer: `🎪 **تصريح فعالية**\n\nهل تخطط لإقامة فعالية؟ الخدمة تتيح لك:\n• تقديم طلب تصريح لإقامة فعاليات عامة أو خاصة\n• تحديد تفاصيل الفعالية (النوع، الموقع، المدة)\n• رفع الوثائق الداعمة (تأمين، خطط الأمن، وغيرها)\n• استلام التصريح إلكترونياً عند الموافقة\n\nيُنصح بتقديم الطلب قبل موعد الفعالية بـ 14 يوم عمل على الأقل.`
    },
    {
      keywords: ['خارجية', 'خدمات خارجية'],
      answer: `🌐 **الخدمات الخارجية**\n\nتشمل هذه الخدمة:\n• التعامل مع الجهات والشركاء الخارجيين\n• خدمات للمقيمين والزوار من خارج النطاق المحلي\n• ربط الإجراءات مع جهات حكومية أخرى\n\nيُرجى تجهيز الوثائق اللازمة وتسجيل الدخول للاستفادة من هذه الخدمات.`
    },
    {
      keywords: ['ساعات', 'وقت', 'دوام', 'متاح', 'عمل'],
      answer: `🕐 **أوقات الخدمة**\n\nالبوابة الإلكترونية متاحة **24 ساعة / 7 أيام** طوال الأسبوع.\n\nأما الدعم البشري فيعمل خلال:\n• الأحد – الخميس: 8 صباحاً – 3 مساءً\n\nللطوارئ تواصل عبر البريد الإلكتروني أو الخط الساخن.`
    },
    {
      keywords: ['تسجيل', 'حساب', 'اشتراك', 'دخول', 'كلمة مرور'],
      answer: `🔐 **تسجيل الدخول والحساب**\n\nللاستفادة من الخدمات:\n1. اضغط "تسجيل الدخول" في أعلى الصفحة\n2. أدخل اسم المستخدم وكلمة المرور\n3. أو سجّل حساباً جديداً إن كنت تزور البوابة لأول مرة\n\nإذا نسيت كلمة المرور، استخدم خيار "نسيت كلمة المرور" وسيصلك رمز التحقق على الجوال.`
    },
    {
      keywords: ['شكرا', 'شكراً', 'ممتاز', 'رائع', 'جيد', 'حسنا', 'حسناً'],
      answer: `😊 على الرحب والسعة! يسعدنا خدمتك دائماً.\nإذا كان لديك أي استفسار آخر فلا تتردد في السؤال. 🌟`
    },
    {
      keywords: ['مرحبا', 'مرحباً', 'السلام', 'اهلا', 'أهلاً', 'هلا', 'هاي', 'hi', 'hello'],
      answer: `أهلاً وسهلاً! 👋 أنا مساعد البوابة الذكي.\nيمكنني مساعدتك في:\n• التعرف على خدمات البوابة\n• الإرشاد لكيفية تقديم الطلبات\n• الإجابة على أسئلتك حول الرسوم والإجراءات\n\nما الذي يمكنني مساعدتك به اليوم؟`
    },
  ];

  const FALLBACK = `شكراً على سؤالك 🙏\nلم أتمكن من فهم استفساركم بشكل كامل، لكن يمكنني مساعدتك في الخدمات التالية:\n\n• المهن والرخص\n• الشكاوى\n• الدفع الإلكتروني\n• التنظيم العمراني\n• المرسوم 66\n• تصريح فعالية\n\nيُرجى إعادة صياغة سؤالك أو اختيار إحدى الخدمات أعلاه.`;

  const btn        = document.getElementById('ai-chat-btn');
  const panel      = document.getElementById('ai-chat-panel');
  const closeBtn   = document.getElementById('chat-close-btn');
  const messagesEl = document.getElementById('chat-messages');
  const inputEl    = document.getElementById('chat-input');
  const sendBtn    = document.getElementById('chat-send-btn');
  const chipsEl    = document.getElementById('chat-chips');
  const notifDot   = btn.querySelector('.notif');

  let isOpen   = false;
  let isTyping = false;

  function getTime() {
    const d = new Date();
    return d.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  }

  function scrollToBottom() {
    setTimeout(() => { messagesEl.scrollTop = messagesEl.scrollHeight; }, 50);
  }

  function appendTimestamp() {
    const t = document.createElement('div');
    t.className = 'msg-time';
    t.textContent = getTime();
    messagesEl.appendChild(t);
  }

  function formatText(text) {

    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  function addMessage(text, sender) {
    const row = document.createElement('div');
    row.className = `msg-row ${sender}`;

    const av = document.createElement('div');
    av.className = `msg-avatar ${sender === 'bot' ? 'bot-av' : 'user-av'}`;
    av.textContent = sender === 'bot' ? '🤖' : 'أنت';

    const bubble = document.createElement('div');
    bubble.className = `bubble ${sender}`;
    bubble.innerHTML = formatText(sender === 'bot' ? text : escapeHtml(text));

    row.appendChild(av);
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    appendTimestamp();
    scrollToBottom();
  }

  function showTyping() {
    const row = document.createElement('div');
    row.className = 'msg-row bot';
    row.id = 'typing-indicator';

    const av = document.createElement('div');
    av.className = 'msg-avatar bot-av';
    av.textContent = '🤖';

    const typing = document.createElement('div');
    typing.className = 'typing-bubble';
    typing.innerHTML = '<span></span><span></span><span></span>';

    row.appendChild(av);
    row.appendChild(typing);
    messagesEl.appendChild(row);
    scrollToBottom();
  }

  function hideTyping() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
  }

  function getBotAnswer(query) {
    const q = query.toLowerCase().trim();
    for (const entry of KB) {
      if (entry.keywords.some(kw => q.includes(kw.toLowerCase()))) {
        return entry.answer;
      }
    }
    return FALLBACK;
  }

  function botRespond(userText) {
    if (isTyping) return;
    isTyping = true;

    showTyping();
    const delay = 900 + Math.random() * 700;

    setTimeout(() => {
      hideTyping();
      const answer = getBotAnswer(userText);
      addMessage(answer, 'bot');
      isTyping = false;
    }, delay);
  }

  function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isTyping) return;

    addMessage(text, 'user');
    inputEl.value = '';
    inputEl.style.height = 'auto';
    botRespond(text);
  }

  function openPanel() {
    panel.classList.add('open');
    isOpen = true;
    if (notifDot) notifDot.style.display = 'none';
    setTimeout(() => inputEl.focus(), 300);
  }

  function closePanel() {
    panel.classList.remove('open');
    isOpen = false;
  }

  btn.addEventListener('click', () => { isOpen ? closePanel() : openPanel(); });
  closeBtn.addEventListener('click', closePanel);

  sendBtn.addEventListener('click', sendMessage);

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  inputEl.addEventListener('input', () => {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 90) + 'px';
  });

  chipsEl.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const q = chip.dataset.q;
    inputEl.value = q;
    sendMessage();
  });

  document.addEventListener('click', (e) => {
    if (isOpen && !panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
      closePanel();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closePanel();
  });

  setTimeout(() => {
    addMessage('أهلاً بك في البوابة الإلكترونية! 👋\nأنا مساعدك الذكي، يمكنني الإجابة على أسئلتك حول خدماتنا.\nاضغط على أحد الاختيارات أدناه أو اكتب سؤالك مباشرةً.', 'bot');
  }, 400);
})();
