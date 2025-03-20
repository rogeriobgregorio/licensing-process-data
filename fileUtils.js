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
