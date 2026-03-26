import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BusinessPlan } from "./business-plan";

export async function generateBusinessPlanPDFFromElement(
  element: HTMLElement,
  plan: BusinessPlan
): Promise<void> {
  // クローンを作成してbodyに追加（キャプチャ用）
  const clone = element.cloneNode(true) as HTMLElement;

  // クローンのスタイルを設定（画面外だがレンダリングは可能な状態）
  clone.style.position = "fixed";
  clone.style.top = "0";
  clone.style.left = "0";
  clone.style.width = "210mm";
  clone.style.zIndex = "99999";
  clone.style.backgroundColor = "#FFFFFF";

  // bodyに追加
  document.body.appendChild(clone);

  try {
    // 少し待機してDOMが完全にレンダリングされるのを待つ
    await new Promise(resolve => setTimeout(resolve, 100));

    // html2canvasでHTMLをキャンバスに変換
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#FFFFFF",
      width: clone.scrollWidth,
      height: clone.scrollHeight,
    });

    // クローンを削除
    document.body.removeChild(clone);

    const imgData = canvas.toDataURL("image/png");

    // A4サイズのPDFを作成
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // 画像のアスペクト比を維持しながらサイズを計算
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // 最初のページに画像を追加
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 必要に応じて追加ページを作成
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // ファイル名を生成
    const fileName = plan.basic.clinicName
      ? `事業計画書_${plan.basic.clinicName}_${new Date().toISOString().split("T")[0]}.pdf`
      : `事業計画書_${new Date().toISOString().split("T")[0]}.pdf`;

    pdf.save(fileName);
  } catch (error) {
    // エラー時もクローンを削除
    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
    }
    throw error;
  }
}
