const form = document.getElementById('serie-form');
const container = document.getElementById('series-container');
const filtroGenero = document.getElementById('filtro-genero');

// Carrega as séries do localStorage
let series = JSON.parse(localStorage.getItem('series')) || [];

// === Função para salvar o array de séries no localStorage ===
const salvarSeries = () => {
    localStorage.setItem('series', JSON.stringify(series));
};

// === Função que cria e exibe um card de série na tela ===
function criarCardSerie(serie) {
    const card = document.createElement('article');
    card.classList.add('serie-card');

    // Imagem da série
    const img = document.createElement('img');
    img.src = serie.imagem;
    img.alt = `Imagem da série ${serie.nome}`;

    // Nome da série
    const h3 = document.createElement('h3');
    h3.textContent = serie.nome;

    // Gênero e descrição
    const genero = document.createElement('p');
    genero.textContent = `Gênero: ${serie.genero}`;

    const descricao = document.createElement('p');
    descricao.textContent = serie.descricao;

    // Botão para remover a série
    const btnRemover = document.createElement('button');
    btnRemover.textContent = "×";
    btnRemover.style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background-color: var(--cor-nota-baixa);
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        font-weight: bold;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    btnRemover.addEventListener('click', () => {
        series = series.filter(s => s.id !== serie.id); // Remove pelo ID
        salvarSeries();
        renderizarSeries(); // Atualiza a exibição
    });

    // Adiciona efeito hover
    btnRemover.addEventListener('mouseenter', () => {
        btnRemover.style.backgroundColor = '#c0392b';
    });

    btnRemover.addEventListener('mouseleave', () => {
        btnRemover.style.backgroundColor = 'var(--cor-nota-baixa)';
    });

    // === Formulário interno para adicionar episódio à série ===
    const formEp = document.createElement('form');
    formEp.innerHTML = `
    <input type="text" placeholder="Nome do episódio" required />
    <input type="number" placeholder="Nota (0-10)" min="0" max="10" required />
    <input type="text" placeholder="Comentário (opcional)" />
    <button type="submit">Adicionar Episódio</button>
  `;

    // Ao enviar episódio:
    formEp.addEventListener('submit', function (e) {
        e.preventDefault(); // Pagina nao ser recarregada ao madnar o formulário
        const [nome, nota, comentario] = [...this.elements]; 

        const episodio = {
            id: crypto.randomUUID(),
            nome: nome.value,
            nota: parseFloat(nota.value),
            comentario: comentario.value
        };

        serie.episodios.push(episodio);
        salvarSeries();
        renderizarSeries();
    });

    // === Lista de episódios ===
    const lista = document.createElement('ul');
    lista.classList.add('episodios-lista');

    for (const ep of serie.episodios) {
        const li = document.createElement('li');

        // Aplica classe para cor da nota (baixa ou alta)
        const notaClasse = ep.nota < 6 ? "nota baixa" : "nota";

        li.innerHTML = `
      <strong>${ep.nome}</strong> — 
      <span class="${notaClasse}">${ep.nota}</span> 
      <em>${ep.comentario}</em>
    `;
        lista.appendChild(li);
    }

    // === Monta o card da série ===
    card.appendChild(img);
    card.appendChild(h3);
    card.appendChild(genero);
    card.appendChild(descricao);
    card.appendChild(formEp);
    card.appendChild(lista);
    card.appendChild(btnRemover);

    container.appendChild(card);
}

// === Renderiza todas as séries e aplica os filtros ===
function renderizarSeries() {
    container.innerHTML = ''; // Limpa antes de renderizar

    const generoFiltro = filtroGenero.value.toLowerCase();
    const generosSet = new Set(); // Para preencher o <select> de gênero

    series
        .filter(serie =>
            generoFiltro === '' || serie.genero.toLowerCase() === generoFiltro
        )
        .forEach(serie => {
            criarCardSerie(serie);
            generosSet.add(serie.genero); // Armazena gêneros únicos
        });

    // Atualiza as opções de filtro de gênero
    filtroGenero.innerHTML = `<option value="">Todos os Gêneros</option>`;
    for (const genero of Array.from(generosSet)) {
        const opt = document.createElement('option');
        opt.value = genero;
        opt.textContent = genero;
        filtroGenero.appendChild(opt);
    }
}

// === Ao enviar o formulário principal: adiciona nova série ===
form.addEventListener('submit', e => {
    e.preventDefault();

    const { titulo, genero, imagem, descricao } = form.elements;

    const novaSerie = {
        id: crypto.randomUUID(),
        nome: titulo.value,
        genero: genero.value,
        imagem: imagem.value,
        descricao: descricao.value,
        episodios: [] // Nenhum episódio inicialmente
    };

    series.push(novaSerie);
    salvarSeries();
    renderizarSeries();
    form.reset(); // Limpa o formulário
});

// === Eventos para filtros ===
filtroGenero.addEventListener('change', renderizarSeries);

// === Inicializa a interface com os dados salvos ===
renderizarSeries();
