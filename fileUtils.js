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

    if (!listOfProcesses.length) {
      console.error("Nenhum processo encontrado para salvar.");
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(filename.replace(".xlsx", ""));
    
    ws.columns = columns;

    listOfProcesses.forEach((process) => ws.addRow(process));

    await wb.xlsx.writeFile(filename);
    console.log(`Arquivo ${filename} salvo com sucesso!`);
  } catch (error) {
    console.error("Erro ao tentar salvar o arquivo Excel:", error);
  }
}