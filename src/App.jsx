import { useMemo, useState } from "react";

const MOTIVES = [
  { id: "A1", title: "A1｜解决问题", desc: "有个困扰想解决掉。" },
  { id: "A2", title: "A2｜升级体验", desc: "现在能用，但想更舒服一点。" },
  { id: "A3", title: "A3｜省事省心", desc: "不想折腾，想少操心。" },
  { id: "A4", title: "A4｜奖励一下", desc: "最近累，想给自己一点开心。" },
  { id: "A5", title: "A5｜被迫需要", desc: "情况变了，不得不买。" },
  { id: "A6", title: "A6｜直觉想要", desc: "说不清原因，但就是有点想要。" },
];

function clampMoney(n) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(999999, n));
}

export default function App() {
  const [step, setStep] = useState(1);
  const [motive, setMotive] = useState(null);
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [acceptThrow, setAcceptThrow] = useState(null); // true/false
  const [result, setResult] = useState(null);

  const priceNum = useMemo(() => clampMoney(Number(price)), [price]);

  const smallScopeHint = useMemo(() => {
    // 你可以后面把阈值做成可配置，这里先写死：≤500
    if (!priceNum) return "建议用于小额消费（例如 ≤ 500 元）";
    return priceNum <= 500
      ? "小额范围：适用（≤ 500）"
      : "提示：金额偏高。此工具更适合小额（≤ 500）。";
  }, [priceNum]);

  function resetAll() {
    setStep(1);
    setMotive(null);
    setItem("");
    setPrice("");
    setAcceptThrow(null);
    setResult(null);
  }

  function decide() {
    // 结果逻辑：你现在的宗旨是止纠结，所以用非常直接的规则：
    // - 价格偏高且仍纠结 -> 优先冷静
    // - “扔掉也能接受” -> 买
    // - 不能接受 -> 不买/冷静
    if (acceptThrow === true) {
      if (priceNum > 500) {
        setResult({
          title: "先冷静 24 小时",
          body:
            "你愿意承担损失，但金额偏高。为了避免事后复盘，先放 24 小时。到点再决定。",
          action: "现在关掉页面，24 小时后再回来。",
        });
      } else {
        setResult({
          title: "可以买",
          body:
            "你已经做完签约：就算没达到目的，这笔钱也能当作沉没成本。别再复盘了。",
          action: "买完就结束：不满意就按规则退/卖/丢（只选一个）。",
        });
      }
    } else {
      // 不能接受“扔掉”
      setResult({
        title: priceNum > 500 ? "先冷静 24 小时" : "不买",
        body:
          priceNum > 500
            ? "你现在承担不了它变成沉没成本。先放 24 小时，避免在纠结里下注。"
            : "你承担不了它变成沉没成本。那就别买：这不是亏，是止损。",
        action:
          "立刻把它从购物车/收藏里移除，去做一件具体的事（洗脸/走路/回消息）。",
      });
    }
    setStep(3);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>蛋挞 · 终止纠结</div>
          <div style={styles.sub}>{smallScopeHint}</div>
        </div>

        {step === 1 && (
          <>
            <div style={styles.sectionTitle}>先说清楚：你想买什么？</div>
            <input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="例如：特步跑鞋 / 会员 / 拖鞋"
              style={styles.input}
            />
            <div style={styles.sectionTitle}>大概多少钱？</div>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ""))}
              placeholder="例如：199"
              style={styles.input}
              inputMode="numeric"
            />

            <div style={styles.sectionTitle}>你买它最核心是为了什么？</div>
            <div style={styles.grid}>
              {MOTIVES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMotive(m)}
                  style={{
                    ...styles.choice,
                    borderColor: motive?.id === m.id ? "#111" : "#ddd",
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{m.title}</div>
                  <div style={{ opacity: 0.75, fontSize: 12 }}>{m.desc}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!motive || !item.trim() || !priceNum}
              style={{
                ...styles.primary,
                opacity: !motive || !item.trim() || !priceNum ? 0.4 : 1,
              }}
            >
              下一步
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={styles.sectionTitle}>终极签约</div>
            <div style={styles.block}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>
                你想买：{item}（约 {priceNum} 元）
              </div>
              <div style={{ opacity: 0.85 }}>
                你的理由：{motive?.title}
              </div>
            </div>

            <div style={styles.blockStrong}>
              如果买回来没达到你刚才的目的，<br />
              <b>这笔钱就当扔掉了</b>。<br />
              你能接受吗？
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setAcceptThrow(false)}
                style={{
                  ...styles.choiceLarge,
                  borderColor: acceptThrow === false ? "#111" : "#ddd",
                }}
              >
                不能接受
              </button>
              <button
                onClick={() => setAcceptThrow(true)}
                style={{
                  ...styles.choiceLarge,
                  borderColor: acceptThrow === true ? "#111" : "#ddd",
                }}
              >
                能接受
              </button>
            </div>

            <button
              onClick={decide}
              disabled={acceptThrow === null}
              style={{
                ...styles.primary,
                opacity: acceptThrow === null ? 0.4 : 1,
              }}
            >
              给我结论
            </button>

            <button onClick={resetAll} style={styles.secondary}>
              重来
            </button>
          </>
        )}

        {step === 3 && result && (
          <>
            <div style={styles.sectionTitle}>结论</div>
            <div style={styles.resultTitle}>{result.title}</div>
            <div style={styles.resultBody}>{result.body}</div>
            <div style={styles.resultAction}>动作：{result.action}</div>

            <button onClick={resetAll} style={styles.primary}>
              再做一次
            </button>
          </>
        )}

        <div style={styles.footer}>
          仅供参考：用于小额消费的“终止纠结”工具，不评估商品质量与长期回报。
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 16,
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  },
  card: {
    width: "min(520px, 100%)",
    border: "1px solid #e5e5e5",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 6px 30px rgba(0,0,0,0.06)",
  },
  header: { marginBottom: 12 },
  sub: { fontSize: 12, opacity: 0.7, marginTop: 6 },
  sectionTitle: { fontWeight: 800, marginTop: 12, marginBottom: 8 },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "1px solid #ddd",
    outline: "none",
  },
  grid: {
    display: "grid",
    gap: 10,
    gridTemplateColumns: "1fr 1fr",
  },
  choice: {
    textAlign: "left",
    padding: 12,
    borderRadius: 12,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
  },
  choiceLarge: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 800,
  },
  primary: {
    width: "100%",
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    border: "1px solid #111",
    background: "#111",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 800,
  },
  secondary: {
    width: "100%",
    marginTop: 10,
    padding: 10,
    borderRadius: 12,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  block: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid #eee",
    background: "#fafafa",
    marginBottom: 10,
  },
  blockStrong: {
    padding: 14,
    borderRadius: 12,
    border: "1px solid #111",
    background: "#fff",
    marginBottom: 12,
    lineHeight: 1.5,
  },
  resultTitle: { fontSize: 22, fontWeight: 900, marginTop: 6 },
  resultBody: { marginTop: 10, opacity: 0.85, lineHeight: 1.6 },
  resultAction: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    border: "1px dashed #ccc",
    background: "#fcfcfc",
    fontWeight: 800,
  },
  footer: { marginTop: 14, fontSize: 12, opacity: 0.6 },
};
