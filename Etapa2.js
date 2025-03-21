import { withMongoDB } from "./database.js"; // Importa a função withMongoDB para conexão com o DB
import { saveAsJson, saveAsExcel } from "./fileUtils.js"; // Importa a função para salvar os processos em JSON

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

// Configura as colunas para salvar o Excel
const excelColumns = [
  { header: "nP", key: "nP", width: 15 },
  { header: "Created At", key: "created_at", width: 20 },
  { header: "Title", key: "title", width: 30 },
  { header: "Last Destination", key: "lastDestination", width: 30 },
];

// Executando as funções
withMongoDB(async (db) => {
  await saveAsExcel(db, fetchProcesses, "listaProcessos2.xlsx", excelColumns);
  await saveAsJson(db, fetchProcesses, "listOfProcesses2.json");
});
