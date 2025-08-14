import type { NextApiRequest, NextApiResponse } from "next";
import { tasks } from "@trigger.dev/sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug = [] } = req.query;
  try {
    const handle = await tasks.trigger("tasks", { slug, body: req.body, method: req.method });
    res.status(202).json({ triggered: true, handleId: handle.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to trigger tasks", details: (error as Error).message });
  }
}