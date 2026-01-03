export type MunicipalityOption = {
  label: string;
  value: string;
  search: string;
};

type IbgeMunicipio = {
  nome: string;
  microrregiao: {
    mesorregiao: {
      UF: {
        sigla: string;
      };
    };
  };
};

const IBGE_BASE_URL = import.meta.env.DEV
  ? "/ibge"
  : "https://servicodados.ibge.gov.br";
const IBGE_MUNICIPIOS_URL = `${IBGE_BASE_URL}/api/v1/localidades/municipios`;

export const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const fetchMunicipalities = async (): Promise<MunicipalityOption[]> => {
  const response = await fetch(IBGE_MUNICIPIOS_URL);

  if (!response.ok) {
    throw new Error("Falha ao buscar municipios do IBGE.");
  }

  const data = (await response.json()) as IbgeMunicipio[];

  return data.map((item) => {
    const label = `${item.nome}, ${item.microrregiao.mesorregiao.UF.sigla}`;
    const value = label.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return {
      label,
      value,
      search: normalizeText(
        `${item.nome} ${item.microrregiao.mesorregiao.UF.sigla}`
      ),
    };
  });
};
