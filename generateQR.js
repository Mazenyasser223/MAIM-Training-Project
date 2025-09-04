import QRCode from "qrcode";

export async function generateTicketQR(payload) {
  const text = JSON.stringify(payload);
  return QRCode.toDataURL(text, { width: 256, margin: 1 });
}
