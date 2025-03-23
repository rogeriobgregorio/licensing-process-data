import ExcelJS from "exceljs"; // Importa o módulo para criar e salvar a planilha Excel
import fs from "fs"; // Importa o módulo de sistema de arquivos

// Função para salvar processos em JSON
export async function saveAsJson(db, fetchFunction, fileName) {
  try {
    const listOfProcesses = await fetchFunction(db);

    if (!listOfProcesses || listOfProcesses.length === 0) {
      console.error("Nenhum processo encontrado para salvar.");
      return;
    }

    fs.writeFileSync(fileName, JSON.stringify(listOfProcesses, null, 2));
    console.log(`Arquivo ${fileName} salvo com sucesso!`);
  } catch (error) {
    console.error(`Erro ao tentar salvar o arquivo ${fileName}:`, error);
  }
}

// Função para salvar processos em Excel
export async function saveAsExcel(db, fetchFunction, filename, columns) {
  try {
    const listOfProcesses = await fetchFunction(db);

    if (!listOfProcesses || listOfProcesses.length === 0) {
      console.error("Nenhum processo encontrado para salvar.");
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(filename.replace(".xlsx", ""));

    // Define as colunas da planilha
    ws.columns = columns;

    // Mapeia e prepara os dados para a planilha
    listOfProcesses.forEach((process) => {
      const rowData = {
        nP: process.nP,
        created_at: process.created_at,
        title: process.config_metadata?.title || process.title || "",
        lastDestination: process.lastDestination || "",
        lastUser: process.lastUser || "",
        lastSector: process.lastSector || "",
        lastEventAction: process.lastEvent || "",
      };

      ws.addRow(rowData);
    });

    await wb.xlsx.writeFile(filename);
    console.log(`Arquivo ${filename} salvo com sucesso!`);
  } catch (error) {
    console.error("Erro ao tentar salvar o arquivo Excel:", error);
  }
}
