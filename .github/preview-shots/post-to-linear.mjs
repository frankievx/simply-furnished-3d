// Posts the contact sheet from preview-shot.mjs to the Linear issue named in
// the branch (e.g. frankievx/ren-44-title -> REN-44), as a comment with the
// image inline. Reads shots.json and shots/sheet.jpg from the working dir.
import { readFileSync, existsSync } from "node:fs";

const { LINEAR_API_KEY, BRANCH = "", PREVIEW_URL = "", RUN_URL = "" } = process.env;
const match = BRANCH.match(/(?:^|\/)([a-z][a-z0-9]{1,9})-(\d+)(?:-|$)/i);
if (!match) {
  console.log(`No Linear issue id in branch "${BRANCH}", nothing to post.`);
  process.exit(0);
}
if (!LINEAR_API_KEY) throw new Error("LINEAR_API_KEY is not set");
const identifier = `${match[1].toUpperCase()}-${match[2]}`;

async function gql(query, variables) {
  const res = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: LINEAR_API_KEY },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`Linear: ${JSON.stringify(json.errors ?? res.status)}`);
  return json.data;
}

const report = existsSync("shots.json") ? JSON.parse(readFileSync("shots.json", "utf8") || "{}") : {};
const hasSheet = existsSync("shots/sheet.jpg");

const { issue } = await gql(`query($id:String!){ issue(id:$id){ id } }`, { id: identifier });
if (!issue) {
  console.log(`Linear has no issue ${identifier}, nothing to post.`);
  process.exit(0);
}

let image = "";
if (hasSheet) {
  const bytes = readFileSync("shots/sheet.jpg");
  const { fileUpload } = await gql(
    `mutation($size:Int!){ fileUpload(contentType:"image/jpeg", filename:"preview-sheet.jpg", size:$size){
       success uploadFile{ uploadUrl assetUrl headers{ key value } } } }`,
    { size: bytes.length }
  );
  const { uploadUrl, assetUrl, headers } = fileUpload.uploadFile;
  const put = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=31536000",
      ...Object.fromEntries(headers.map((h) => [h.key, h.value])) },
    body: bytes,
  });
  if (!put.ok) throw new Error(`Upload failed: ${put.status}`);
  image = `![Preview screenshots](${assetUrl})`;
}

const errors = report.consoleErrors?.length ?? 0;
const lines = [
  `🤖 Preview screenshots for \`${BRANCH}\``,
  image || `Screenshots failed: ${report.error ?? "no sheet was produced"}`,
  [
    PREVIEW_URL && `[Preview](${PREVIEW_URL})`,
    RUN_URL && `[Run](${RUN_URL})`,
    hasSheet && `${errors} console error${errors === 1 ? "" : "s"}`,
  ].filter(Boolean).join(" · "),
];
await gql(`mutation($input:CommentCreateInput!){ commentCreate(input:$input){ success } }`,
  { input: { issueId: issue.id, body: lines.filter(Boolean).join("\n\n") } });
console.log(`Posted to ${identifier}`);
