import { NextRequest, NextResponse } from "next/server";
import { getProductIndex, products } from "@/data/products";

// The carousel lives at /<product id>. Everything else is sent to a product
// with a real redirect, before anything renders:
//   /                       first product
//   /<n>  (old position)    the product at that position
//   /<n>/related/<m>        the old two-id carousel URL: product m
//   anything unknown        first product
export function middleware(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const candidate =
    segments.length === 1
      ? segments[0]
      : segments.length === 3 && segments[1] === "related"
      ? segments[2]
      : undefined;

  let target = products[0].id;
  if (candidate !== undefined) {
    if (getProductIndex(candidate) !== -1) target = candidate;
    else if (/^\d+$/.test(candidate) && products[Number(candidate)])
      target = products[Number(candidate)].id;
  }

  if (segments.length === 1 && segments[0] === target) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = `/${target}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Skip Next internals and any file in public/ (they all contain a dot).
  matcher: ["/((?!_next|.*\\..*).*)"],
};
