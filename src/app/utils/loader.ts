import { isMobile } from "react-device-detect";

export const imageKitLoader = ({
  src,
  // width,
  quality,
}: {
  src: string;
  // width?: string;
  quality?: string;
}) => {
  const width = isMobile ? "1024" : "2048";
  // const width = "auto";
  if (src[0] === "/") src = src.slice(1);
  const params = [`w-${width}`];
  if (quality) {
    params.push(`q-${quality}`);
  }
  const paramsString = params.join(",");
  var urlEndpoint = "https://ik.imagekit.io/simplyfurnished/";
  if (urlEndpoint[urlEndpoint.length - 1] === "/")
    urlEndpoint = urlEndpoint.substring(0, urlEndpoint.length - 1);
  return `${urlEndpoint}/${src}?tr=${paramsString}`;
};
