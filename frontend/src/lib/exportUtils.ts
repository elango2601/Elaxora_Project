export function exportToCSV(filename: string, rows: string[][]) {
  const processRow = (row: string[]) => {
    return row
      .map((val) => {
        let finalVal = val === null || val === undefined ? "" : val.toString();
        // Escape quotes
        finalVal = finalVal.replace(/"/g, '""');
        // Wrap in quotes if it contains comma, quote, or newline
        if (finalVal.search(/("|,|\n)/g) >= 0) {
          finalVal = `"${finalVal}"`;
        }
        return finalVal;
      })
      .join(",");
  };

  const csvFile = rows.map(processRow).join("\n");
  const blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
  
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
