export class TableGenerator {
	constructor(data, functions, table=undefined) {
		this.data = data;
		this.rows = [];
		this.columns = [];
		this.functions = functions;
		// generateRowsColumns(data) { return {rows, columns} }
		// createRow(data, rows, columns, row) { return row }
		// createCell(data, rows, columns, row, col) { return cell}
		this.table = table;
		if (table == undefined) {
			this.table = document.createElement("table");
		}
	}
	generateTableContent() {
		this.table.innerHTML = "";
		const rowsColumns = this.functions.generateRowsColumns(this.data);
		this.rows = rowsColumns.rows;
		this.columns = rowsColumns.columns;
		for (const row of this.rows) {
			const rowElement = this.functions.createRow(this.data, this.rows, this.columns, row);
			this.table.appendChild(rowElement);
			for (const col of this.columns) {
				const cellElement = this.functions.createCell(this.data, this.rows, this.columns, row, col);
				if (cellElement) {
					rowElement.appendChild(cellElement);
				}
			}
		}
	}
}
