import type { NextApiRequest, NextApiResponse } from "next";
import { tasks } from "@trigger.dev/sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const handle = await tasks.trigger("github-pull-request-webhook", { body: req.body, headers: req.headers, method: req.method });
    res.status(202).json({ triggered: true, handleId: handle.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to trigger webhook", details: (error as Error).message });
  }
}