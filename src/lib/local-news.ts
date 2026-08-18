import type { Post } from "@/lib/news";

/**
 * Seed de notícias locais (hardcoded).
 * Posts criados pelo admin ficam em localStorage (ver local-posts.ts).
 */
export const localPosts: Post[] = [
  {
    id: "local-incendio-loja-darmand-parauapebas",
    title: "Incêndio de grandes proporções destrói loja de roupas na Avenida JK, em Parauapebas",
    slug: "incendio-destroi-loja-roupas-avenida-jk-parauapebas",
    excerpt:
      "Fogo atingiu a loja Darmand, no bairro Rio Verde. Funcionários conseguiram deixar o estabelecimento e não houve registro de feridos; causa ainda deverá ser apurada.",
    content: `
      <p>Um incêndio de grandes proporções atingiu a loja de moda masculina Darmand, localizada na Avenida JK, no bairro Rio Verde, em Parauapebas, no sábado (15). As chamas se espalharam rapidamente pelo estabelecimento e provocaram danos significativos à estrutura e ao estoque.</p>
      <p>Durante o incêndio, uma intensa coluna de fumaça preta pôde ser vista a distância. Imagens registradas no local e compartilhadas nas redes sociais mostraram as chamas tomando conta do imóvel e chamaram a atenção de moradores da região.</p>
      <p>Apesar da proporção do incêndio, não houve registro de feridos. De acordo com informações divulgadas pelos responsáveis pelo estabelecimento, os funcionários conseguiram sair do prédio após perceberem o fogo.</p>
      <p>Antes que as chamas se espalhassem por toda a loja, funcionários e pessoas que estavam próximas ao local ainda conseguiram retirar parte das mercadorias, incluindo caixas e peças de roupas.</p>
      <h2>Bombeiros combateram as chamas</h2>
      <p>O Corpo de Bombeiros Militar do Pará foi acionado para controlar o incêndio. Após o combate às chamas, as equipes realizaram o trabalho de rescaldo, procedimento necessário para eliminar possíveis focos remanescentes e reduzir o risco de o fogo voltar a se espalhar.</p>
      <p>A preocupação também envolvia os imóveis próximos ao estabelecimento devido à intensidade das chamas e ao calor provocado pelo incêndio.</p>
      <h2>Causa ainda será investigada</h2>
      <p>Informações preliminares levantadas no local apontaram para a possibilidade de o fogo ter começado em um aparelho de ar-condicionado. A informação, entretanto, não representa uma conclusão oficial sobre a origem do incêndio.</p>
      <p>A causa deverá ser determinada por meio de perícia, que poderá analisar fatores como instalações elétricas, materiais atingidos e o provável ponto onde as chamas começaram.</p>
      <p>Até o momento das informações disponíveis, também não havia uma estimativa oficial do valor dos prejuízos provocados pelo incêndio.</p>
      <p>A estrutura do imóvel deverá passar por avaliação técnica antes de uma eventual retomada das atividades, principalmente em razão dos danos provocados pelas chamas e pelas altas temperaturas.</p>
      <h2>Loja confirma que funcionários e clientes estão bem</h2>
      <p>Após o ocorrido, a Darmand utilizou suas redes sociais para confirmar o incêndio e informar que colaboradores e clientes estavam bem.</p>
      <p>A empresa também agradeceu pelas mensagens de apoio e solidariedade recebidas e informou que novas atualizações deverão ser divulgadas por seus canais oficiais.</p>
      <p>As primeiras informações sobre a ocorrência foram divulgadas pelo Portal Pebão, enquanto imagens aéreas do incêndio foram registradas por Weidy Graciano.</p>
      <p>Esta reportagem foi elaborada a partir de informações disponíveis publicamente sobre a ocorrência. A causa definitiva do incêndio depende de confirmação oficial dos órgãos responsáveis.</p>
    `,
    image_url:
      "https://cdn.dol.com.br/img/Artigo-Destaque/950000/1200x0/fogo1009599260-t.webp?fallback=https%3A%2F%2Fcdn.dol.com.br%2Fimg%2FArtigo-Destaque%2F950000%2Ffogo1009599260.jpg%3Fxid%3D3300586&xid=3300586",
    category_id: "local-seguranca",
    city_id: "local-parauapebas",
    author_id: null,
    canonical_url: null,
    focus_keyword: "incêndio loja Darmand Parauapebas",
    is_featured: true,
    is_urgent: true,
    meta_title: "Incêndio destrói loja Darmand na Avenida JK, em Parauapebas",
    meta_description:
      "Incêndio atingiu a loja Darmand, no Rio Verde, em Parauapebas. Não houve feridos e a causa será investigada.",
    og_image: null,
    og_image_url:
      "https://cdn.dol.com.br/img/Artigo-Destaque/950000/1200x0/fogo1009599260-t.webp?fallback=https%3A%2F%2Fcdn.dol.com.br%2Fimg%2FArtigo-Destaque%2F950000%2Ffogo1009599260.jpg%3Fxid%3D3300586&xid=3300586",
    robots_meta: "index, follow",
    schema_data: null,
    seo_score: 86,
    twitter_card: null,
    twitter_card_type: "summary_large_image",
    published_at: "2026-08-17T03:05:00-03:00",
    created_at: "2026-08-17T03:05:00-03:00",
    updated_at: "2026-08-17T03:05:00-03:00",
    category: {
      name: "Segurança",
      slug: "seguranca",
    },
    city: {
      name: "Parauapebas",
      slug: "parauapebas",
    },
    author: {
      name: "Redação",
      slug: "redacao",
    },
    tags: ["Parauapebas", "Incêndio", "Rio Verde", "Darmand"],
  },
];
