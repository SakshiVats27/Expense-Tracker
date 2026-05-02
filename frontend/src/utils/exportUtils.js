import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = (data, totalBalance) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Expense Tracker Report', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Net Balance: Rs. ${totalBalance}`, 14, 37);

    const tableColumn = ["Date", "Type", "Category", "Account", "Amount", "Notes"];
    const tableRows = [];

    data.forEach(item => {
        const rowData = [
            new Date(item.date).toLocaleDateString(),
            item.type.toUpperCase(),
            item.category,
            item.account || 'Cash',
            `Rs. ${item.amount}`,
            item.notes || ''
        ];
        tableRows.push(rowData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'grid',
        headStyles: { fillStyle: [100, 100, 255] }
    });

    doc.save(`report_${new Date().getTime()}.pdf`);
};

export const exportToCSV = (data) => {
    const headers = ["Date", "Type", "Category", "Account", "Amount", "Tags", "Notes"];
    const rows = data.map(item => [
        new Date(item.date).toLocaleDateString(),
        item.type,
        item.category,
        item.account || 'Cash',
        item.amount,
        (item.tags || []).join(';'),
        `"${item.notes || ''}"`
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n"
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expenses_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
};