#!/usr/bin/env node
/**
 * Gate Vercel deploy + npm/pnpm publish behind pnpm lint + pnpm test.
 * Non-deploy vercel subcommands (env, logs, ls, …) are allowed through.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

// Only real CLI invocations (start / after ;|&), not incidental "vercel" text.
const NON_DEPLOY =
  /(?:^|[;&|]|\n)\s*(?:(?:npx|pnpm\s+dlx|yarn\s+dlx)\s+)?vercel(?:@[^\s]+)?\s+(?:env|ls|list|logs|inspect|link|unlink|whoami|project|domains|alias|certs|dns|git|integration|teams|switch|logout|login|help|dev|pull|blob|open|docs|browse)\b/;

const VERCEL_CMD =
  /(?:^|[;&|]|\n)\s*(?:(?:npx|pnpm\s+dlx|yarn\s+dlx)\s+)?vercel(?:@[^\s]+)?(?:\s|$)/;

const PUBLISH_CMD =
  /(?:^|[;&|]|\n)\s*(?:npm|pnpm|yarn)\s+publish\b/;

function reply(obj) {
  process.stdout.write(JSON.stringify(obj));
  process.exit(0);
}

let input;
try {
  input = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  reply({
    permission: "deny",
    user_message: "gate-deploy hook could not parse stdin JSON.",
    agent_message: "Hook input was invalid JSON; release blocked.",
  });
}

const command = String(input.command ?? "");
const isPublish = PUBLISH_CMD.test(command);
const isVercelDeploy = VERCEL_CMD.test(command) && !NON_DEPLOY.test(command);

if (!isPublish && !isVercelDeploy) {
  reply({ permission: "allow" });
}

const label = isPublish ? "publish" : "Vercel deploy";

function run(script) {
  const r = spawnSync("pnpm", ["run", script], {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: process.env,
  });
  return {
    ok: r.status === 0,
    out: `${r.stdout ?? ""}${r.stderr ?? ""}`.trim(),
    status: r.status,
  };
}

const lint = run("lint");
if (!lint.ok) {
  reply({
    permission: "deny",
    user_message: `${label} blocked: \`pnpm lint\` failed. Fix lint errors before releasing.`,
    agent_message: `pnpm lint failed (exit ${lint.status}). Output:\n${lint.out.slice(0, 4000)}`,
  });
}

const test = run("test");
if (!test.ok) {
  reply({
    permission: "deny",
    user_message: `${label} blocked: \`pnpm test\` failed. Fix failing unit tests before releasing.`,
    agent_message: `pnpm test failed (exit ${test.status}). Output:\n${test.out.slice(0, 4000)}`,
  });
}

reply({ permission: "allow" });
