
export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const now = new Date();
  const daraaShunu = new Date(now);
  daraaShunu.setHours(24, 0, 0, 0);
  const shunuHurtel = daraaShunu - now;
  return res.status(200).json({ shunuHurtel });
}
