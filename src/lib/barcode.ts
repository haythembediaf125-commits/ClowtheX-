import JsBarcode from "jsbarcode";

export function renderBarcodeToSvg(value: string): string {
  if (!value) return "";
  try {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    JsBarcode(svg, value, {
      format: "CODE128",
      displayValue: true,
      fontSize: 12,
      margin: 6,
      width: 2,
      height: 50,
    });
    return svg.outerHTML;
  } catch {
    return "";
  }
}

export function generateBarcodeValue(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CX${ts}${rand}`.slice(0, 13);
}

export function printBarcode(value: string, label: string): void {
  try {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    JsBarcode(svg, value, {
      format: "CODE128",
      displayValue: true,
      text: label,
      fontSize: 14,
      margin: 10,
    });
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Barcode - ${label}</title>
      <style>body{margin:20px;display:flex;align-items:center;justify-content:center;height:90vh;}</style>
      </head><body>${svg.outerHTML}
      <script>window.onload=()=>{window.print();setTimeout(()=>window.close(),500);}<\/script>
      </body></html>`);
    win.document.close();
  } catch {
    /* noop */
  }
}
