import { withMongoDB } from "./database.js"; // Importa a função withMongoDB para conexão com o DB
import { saveAsJson } from "./fileUtils.js"; // Importa a função para salvar os processos em JSON
import ExcelJS from "exceljs"; // Importa o módulo para criar e salvar a planilha Excel

// Função para buscar processos no banco de dados
async function fetchProcesses(db) {
  try {
    const processes = await db
      .collection("processo")
      .find(
        {},
        {
          projection: {
            _id: 0,
            nP: 1,
            created_at: 1,
            "config_metadata.title": 1,
            timeline: 1,
          },
        }
      )
      .toArray();

    return processes.map((process) => {
      let lastDestination = "Destino não encontrado";

      if (process.timeline && process.timeline.length > 0) {
        const lastEvent = process.timeline[process.timeline.length - 1];

        // Se houver destino, usa 'to'; senão, usa 'from' como fallback
        const destinationId =
          lastEvent.to?.userId ||
          lastEvent.to?.tag ||
          lastEvent.from?.userId ||
          lastEvent.from?.tag;

        if (destinationId) {
          lastDestination = destinationId;
        }
      }

      return {
        nP: process.nP,
        created_at: process.created_at,
        title: process.config_metadata?.title,
        lastDestination,
      };
    });
  } catch (error) {
    console.error("Erro ao buscar processos no banco de dados:", error);
    throw new Error("Não foi possível buscar os processos.");
  }
}

// Função para salvar processos em Excel
async function saveAsExcel(db) {
  try {
    const listOfProcesses = await fetchProcesses(db);

    if (!listOfProcesses || listOfProcesses.length === 0) {
      console.error("Nenhum processo encontrado para salvar.");
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("listaProcessos2");

    ws.columns = [
      { header: "nP", key: "nP", width: 15 },
      { header: "Created At", key: "created_at", width: 20 },
      { header: "Title", key: "title", width: 30 },
      { header: "Last Destination", key: "lastDestination", width: 30 },
    ];

    listOfProcesses.forEach((process) => {
      ws.addRow(process);
    });

    await wb.xlsx.writeFile("listaProcessos2.xlsx");
    console.log("Arquivo listaProcessos2.xlsx salvo com sucesso!");
  } catch (error) {
    console.error("Erro ao tentar salvar o arquivo Excel:", error);
  }
}

// Executando as funções
(async () => {
  await withMongoDB(saveAsExcel);
})();

withMongoDB((db) =>
  saveAsJson(db, fetchProcesses, "listOfProcesses2.json")
);
