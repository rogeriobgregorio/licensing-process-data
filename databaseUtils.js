// Função para buscar todos os usuários e setores e armazenar em um dicionário
export async function fetchUsersAndSectors(db) {
  try {
    const users = await db
      .collection("users")
      .find({}, { projection: { _id: 0, id: 1, name: 1 } })
      .toArray();

    const sectors = await db
      .collection("setores")
      .find({}, { projection: { _id: 0, tag: 1, nome: 1 } })
      .toArray();

    const userMap = Object.fromEntries(
      users.map((user) => [user.id, user.name])
    );

    const sectorMap = Object.fromEntries(
      sectors.map((sector) => [sector.tag, sector.nome])
    );

    return { userMap, sectorMap };
  } catch (error) {
    console.error("Erro ao buscar usuários e setores:", error);
    throw new Error("Não foi possível buscar usuários e setores.");
  }
}
