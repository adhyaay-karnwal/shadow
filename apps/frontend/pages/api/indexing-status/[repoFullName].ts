import type { NextApiRequest, NextApiResponse } from "next";
import { tasks } from "@trigger.dev/sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { repoFullName } = req.query;
  try {
    const handle = await tasks.trigger("indexing-status", { repoFullName, method: req.method });
    res.status(202).json({ triggered: true, handleId: handle.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to trigger indexing-status", details: (error as Error).message });
  }
}