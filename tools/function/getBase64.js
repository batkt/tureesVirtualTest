function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result, img.name));
  reader.readAsDataURL(img);
}

export default getBase64;
