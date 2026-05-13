import axios from "axios";

const ECR_URL = "http://localhost:7000/api/ecr";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { data } = await axios.get(ECR_URL, { timeout: 3000 });
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const { data } = await axios.post(ECR_URL, req.body, {
        headers: { "Content-Type": "application/json" },
        timeout: 100000,
      });
      return res.status(200).json(data);
    }

    res.status(405).json({ message: "Method not allowed" });
  } catch (e) {
    if (e.response) {
      return res.status(e.response.status).json(e.response.data);
    }
    res.status(503).json({ success: false, message: "ECR сервис холбогдохгүй байна" });
  }
}
