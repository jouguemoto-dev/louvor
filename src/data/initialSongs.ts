import { Song, Setlist } from '../types';

export const INITIAL_SONGS: Song[] = [
  {
    id: '1',
    title: 'Consagração (Louvor Ao Rei)',
    artist: 'Aline Barros',
    key: 'A',
    bpm: 120,
    timeSig: '4/4',
    category: 'Celebração',
    inSetlist: true,
    capo: 0,
    notes: 'Repertório 1 - Fonte Cifra Club (Versão Simplificada). Abertura festiva e solene de consagração.',
    link: 'https://www.cifraclub.com.br/aline-barros/consagracao/simplificada.html',
    tags: ['Abertura', 'Celebração', 'Louvor', 'Cifra Club Simplificada'],
    chords: `<b>[Intro]</b> <c>A</c>  <c>A4</c>  <c>A</c>  <c>A4</c>

<b>[Primeira Parte]</b>
<c>A</c>          <c>E</c>
 Ao Rei dos reis consagro
<c>G</c>    <c>D</c>
 Tudo o que sou
<c>Dm</c>         <c>A</c>
 De gratos louvores transborda
<c>B7</c>          <c>E</c>
 O meu coração

<c>A</c>        <c>E</c>
 A minha vida eu entrego
<c>G</c>        <c>D</c>
 Nas Tuas mãos, meu Senhor
<c>Dm</c>           <c>A</c>
 Pra Te exaltar com todo meu ser
<c>E</c>          <c>A</c>
 Em todo o tempo

<b>[Refrão]</b>
<c>A</c>          <c>E</c>
 Digno és de glória e louvor
<c>F#m</c>        <c>D</c>
 Digno és de honra e poder
<c>A</c>           <c>E</c>
 Santo, santo, Pai poderoso!

<c>A</c>          <c>E</c>
 Digno és de glória e louvor
<c>F#m</c>        <c>D</c>
 Digno és de honra e poder
<c>A</c>           <c>E</c>            <c>A</c>
 Santo, santo, Pai poderoso!

<b>[Segunda Parte]</b>
<c>A</c>          <c>E</c>
 Ao Rei dos reis consagro
<c>G</c>    <c>D</c>
 Tudo o que sou
<c>Dm</c>         <c>A</c>
 De gratos louvores transborda
<c>B7</c>          <c>E</c>
 O meu coração

<c>A</c>        <c>E</c>
 A minha vida eu entrego
<c>G</c>        <c>D</c>
 Nas Tuas mãos, meu Senhor
<c>Dm</c>           <c>A</c>
 Pra Te exaltar com todo meu ser
<c>E</c>          <c>A</c>
 Em todo o tempo

<b>[Ponte]</b>
<c>F#m</c>      <c>C#m</c>
 Toda a terra se prostrará
<c>D</c>         <c>A</c>
 E toda a língua confessará
<c>Bm</c>       <c>E</c>           <c>A</c>
 Que Tu és Senhor, que Tu és Senhor!

<c>F#m</c>      <c>C#m</c>
 Toda a terra se prostrará
<c>D</c>         <c>A</c>
 E toda a língua confessará
<c>Bm</c>       <c>E</c>           <c>A</c>
 Que Tu és Senhor, que Tu és Senhor!

<b>[Refrão Final]</b>
<c>A</c>          <c>E</c>
 Digno és de glória e louvor
<c>F#m</c>        <c>D</c>
 Digno és de honra e poder
<c>A</c>           <c>E</c>
 Santo, santo, Pai poderoso!

<c>A</c>          <c>E</c>
 Digno és de glória e louvor
<c>F#m</c>        <c>D</c>
 Digno és de honra e poder
<c>A</c>           <c>E</c>            <c>A</c>
 Santo, santo, Pai poderoso!

<b>[Final]</b>
<c>D</c>      <c>E</c>      <c>A</c>
 Santo, santo, Pai poderoso!`
  },
  {
    id: '2',
    title: 'Pode Morar Aqui (Minhas Lamparinas)',
    artist: 'Theo Rubia (part. Alessandro Vilas Boas)',
    key: 'C',
    bpm: 68,
    timeSig: '4/4',
    category: 'Adoração',
    inSetlist: true,
    capo: 3,
    notes: 'Repertório 2 - Fonte Cifra Club oficial. Tom C (forma) com Capo 3 para afinação original em Eb. Inclui estrofes de entrega e "Minhas lamparinas estão acesas".',
    link: 'https://www.cifraclub.com.br/theo-rubia/pode-morar-aqui/',
    tags: ['Adoração', 'Entrega', 'Intimidade', 'Cifra Club Oficial'],
    chords: `<b>[Intro]</b> <c>F</c>  <c>Am7</c>  <c>G</c>  <c>C/E</c>
        <c>F</c>  <c>Am7</c>  <c>G</c>

<b>[Primeira Parte]</b>
<c>F</c>              <c>Am7</c>
 Pode morar aqui
<c>G</c>              <c>C/E</c>
 Pode morar aqui
<c>F</c>
 A casa é Sua, a casa é Tua
<c>Am7</c>            <c>G</c>
 Pode morar aqui

<c>F</c>              <c>Am7</c>
 Pode morar aqui
<c>G</c>              <c>C/E</c>
 Pode morar aqui
<c>F</c>
 A casa é Sua, a casa é Tua
<c>Am7</c>            <c>G</c>
 Pode morar aqui

<b>[Segunda Parte]</b>
<c>F</c>
 Não temos pressa pra sair
<c>Am7</c>
 Não temos hora pra acabar
<c>G</c>
 Queremos Tua presença, Senhor
<c>C/E</c>
 Queremos Teu amor

<c>F</c>
 Eu já coloquei as minhas vestes brancas
<c>Am7</c>
 Estou só Te esperando
<c>G</c>
 Vem, vamos dançar!
<c>C/E</c>
 Maranata, Maranata!

<b>[Refrão - Minhas Lamparinas]</b>
<c>F</c>
 Minhas lamparinas estão acesas
<c>Am7</c>
 Só estou esperando
<c>G</c>
 O barulho dos Teus passos
<c>C/E</c>
 Em direção à porta
<c>F</c>
 É só bater que eu
<c>Am7</c>             <c>G</c>
 Vou abrir pra Você entrar!

<c>F</c>
 Minhas lamparinas estão acesas
<c>Am7</c>
 E o meu coração queima de amor
<c>G</c>
 O meu vaso de perfume
<c>C/E</c>
 Eu quebro aos Teus pés, Senhor

<c>F</c>
 Minhas lamparinas estão acesas
<c>Am7</c>
 E o meu coração queima de amor
<c>G</c>
 O meu vaso de perfume
<c>C</c>
 Eu quebro aos Teus pés, Jesus!

<b>[Ponte - Tem Fogo Nos Olhos]</b>
<c>F</c>
 Tem fogo nos olhos
<c>Am7</c>
 Eu não imaginava
<c>G</c>
 Que era lindo assim
<c>C/E</c>
 Que era lindo assim!

<c>F</c>
 Meu Noivo esperado
<c>Am7</c>
 Eu abro a minha casa
<c>G</c>
 Pode morar aqui
<c>C/E</c>
 Pode morar aqui!

<c>F</c>
 Tem fogo nos olhos
<c>Am7</c>
 Eu não imaginava
<c>G</c>
 Que era lindo assim
<c>C/E</c>
 Que era lindo assim!

<c>F</c>
 Meu Noivo esperado
<c>Am7</c>
 Eu abro a minha casa
<c>G</c>
 Pode morar aqui
<c>C</c>
 Pode morar aqui!

<b>[Espontâneo / Final]</b>
<c>F</c>
 Não há outro lugar onde eu queira estar
<c>Am7</c>
 Não há outro lugar onde eu queira estar
<c>G</c>
 A não ser em Teus braços
<c>C/E</c>
 A não ser em Teus braços de amor!`
  },
  {
    id: '3',
    title: 'Vai Valer a Pena',
    artist: 'Juliano Son (Livres Para Adorar)',
    key: 'C',
    bpm: 65,
    timeSig: '4/4',
    category: 'Louvor',
    inSetlist: true,
    capo: 0,
    notes: 'Repertório 3 - Fonte Cifra Club oficial. Letra completa de Rita Springer adaptada por Juliano Son.',
    link: 'https://www.cifraclub.com.br/juliano-son/vai-valer-a-pena/',
    tags: ['Louvor', 'Fidelidade', 'Esperança', 'Cifra Club Oficial'],
    chords: `<b>[Intro]</b> <c>C9</c>  <c>G/B</c>  <c>Am7</c>  <c>F</c>  <c>C/E</c>  <c>Dm</c>  <c>G</c>

<b>[Primeira Parte]</b>
<c>C9</c>
 Não compreendo os Teus caminhos
<c>F</c>            <c>C/E</c>
 Mas Te darei a minha canção
<c>Dm</c>              <c>C</c>   <c>C4</c>  <c>C</c>
 Doces palavras Te darei
<c>C/E</c>
 Me sustentas em minha dor
<c>F</c>                <c>C/E</c>
 E isso me leva mais perto de Ti
<c>Dm</c>             <c>C</c>   <c>C4</c>  <c>C</c>
 Mais perto dos Teus caminhos

<b>[Segunda Parte]</b>
<c>C9</c>
 Não existem mais palavras que eu possa escrever
<c>F</c>               <c>C/E</c>
 Pra Te convencer a me escutar
<c>Dm</c>            <c>C</c>   <c>C4</c>  <c>C</c>
 O que eu tinha já Te entreguei
<c>C/E</c>
 Minha vida, meu futuro e o meu coração
<c>F</c>                 <c>C/E</c>
 Pertencem a Ti, meu Salvador
<c>Dm</c>          <c>G</c>
 Em Ti eu confiarei

<b>[Refrão]</b>
<c>C</c>
 Eu Te direi
             <c>G/B</c>
Que vai valer a pena
             <c>Am7</c>
Vai valer a pena
             <c>F</c>
Vai valer a pena, Senhor!

<c>C</c>
 Vai valer a pena mesmo
             <c>G/B</c>
Vai valer a pena
             <c>Am7</c>
Vai valer a pena
             <c>F</c>
Vai valer a pena mesmo!

<b>[Ponte]</b>
<c>Dm</c>
 E um grande dia vai chegar
<c>Am7</c>
 Quando uma nuvem se abrir
<c>G</c>
 E a Tua face eu vou ver
<c>F</c>
 Face a face com o meu Rei!

<c>Dm</c>
 Toda dor vai passar
<c>Am7</c>
 Toda lágrima dos meus olhos
<c>G</c>
 O Senhor enxugará
<c>F</c>              <c>G</c>
 E eu cantarei bem alto:

<b>[Refrão Final]</b>
<c>C</c>
 Valeu a pena!
             <c>G/B</c>
Vai valer a pena!
             <c>Am7</c>
Vai valer a pena!
             <c>F</c>
Eu sei que vai valer a pena!

<c>C</c>
 Vai valer a pena mesmo
             <c>G/B</c>
Vai valer a pena
             <c>Am7</c>
Tudo o que passei aqui
             <c>F</c>
Vai valer a pena no fim!

<b>[Final]</b>
<c>C</c>  <c>G/B</c>  <c>Am7</c>  <c>F</c>  <c>C</c>`
  },
  {
    id: '4',
    title: 'Nosso Coração Queima',
    artist: 'fhop music (Ellen D\'Karla)',
    key: 'C',
    bpm: 68,
    timeSig: '4/4',
    category: 'Comunhão',
    inSetlist: true,
    capo: 0,
    notes: 'Momento de Comunhão / Santa Ceia - Fonte Cifra Club oficial. Composição de Ellen D\'Karla (FHOP Music). Foco na ceia e na expectativa do encontro com o Noivo.',
    link: 'https://www.cifraclub.com.br/florianopolis-house-of-prayer/nosso-coracao-queima/',
    tags: ['Comunhão', 'Ceia do Senhor', 'Maranata', 'Cifra Club Oficial'],
    chords: `<b>[Intro]</b> <c>C</c>  <c>C/E</c>  <c>F9</c>  <c>G</c>
        <c>Am7</c>  <c>F9</c>  <c>C</c>  <c>G</c>

<b>[Verso]</b>
<c>C</c>
 Existe um dia que queima em meu coração
<c>F9</c>
 Uma eternidade pra Te conhecer
<c>Am7</c>
 Você plantou em mim essa saudade
<c>G</c>
 Você plantou em mim esse anseio

<c>C</c>
 Existe um dia que queima em meu coração
<c>F9</c>
 Uma eternidade pra Te conhecer
<c>Am7</c>
 Você plantou em mim essa saudade
<c>G</c>
 Você plantou em mim esse anseio

<b>[Pré-Refrão]</b>
<c>Dm7</c>
 Você prometeu e irá cumprir
<c>F9</c>
 Você prometeu que em breve voltará
<c>Am7</c>
 Você prometeu e irá cumprir
<c>G</c>
 Você prometeu que em breve voltará!

<b>[Refrão - Comunhão]</b>
<c>F9</c>
 Nosso coração queima
<c>Am7</c>
 Nosso interior deseja
<c>C</c>
 O dia da Sua volta
<c>G</c>
 O dia do nosso encontro

<c>F9</c>
 Nosso coração queima
<c>Am7</c>
 Nosso interior deseja
<c>C</c>
 O dia da Sua volta
<c>G</c>
 O dia do nosso encontro

<b>[Ponte 1]</b>
<c>F9</c>
 Fomos criados pra Te contemplar
<c>Am7</c>
 Fomos criados pra Te desejar
<c>C</c>                           <c>G</c>
 Fomos criados para estar com Você

<c>F9</c>
 Fomos criados pra Te contemplar
<c>Am7</c>
 Fomos criados pra Te desejar
<c>C</c>                           <c>G</c>
 Fomos criados para estar com Você

<b>[Coro - Contigo Para Sempre]</b>
<c>F9</c>
 Contigo para sempre!
<c>Am7</c>
 Contigo para sempre!
<c>C</c>
 Contigo para sempre!
<c>G</c>
 Contigo para sempre!

<c>F9</c>
 Contigo para sempre!
<c>Am7</c>
 Contigo para sempre!
<c>C</c>
 Contigo para sempre!
<c>G</c>
 Contigo para sempre!

<b>[Ponte 2 - Maranata]</b>
<c>F9</c>
 Nós vivemos para esse dia!
<c>Am7</c>
 Nós vivemos para esse dia!
<c>C</c>
 Nós vivemos para esse dia!
<c>G</c>
 Nós vivemos para esse dia!

<b>[Momento da Ceia do Senhor]</b>
<c>Dm7</c>            <c>C/E</c>
 Em memória de Ti nós nos reunimos
<c>F9</c>             <c>G</c>
 Anunciando Tua morte até que venhas
<c>Dm7</c>            <c>C/E</c>
 O pão e o cálice que nos unem a Ti
<c>F9</c>             <c>G</c>
 Até que venhas, até que venhas!

<b>[Refrão Final]</b>
<c>F9</c>
 Nosso coração queima
<c>Am7</c>
 Nosso interior deseja
<c>C</c>
 O dia da Sua volta
<c>G</c>
 O dia do nosso encontro!

<b>[Final]</b>
<c>F9</c>  <c>Am7</c>  <c>C</c>  <c>G</c>  <c>C</c>`
  },
  {
    id: '5',
    title: 'Tudo É Teu',
    artist: 'Drops INA',
    key: 'C',
    bpm: 72,
    timeSig: '4/4',
    category: 'Oferta',
    inSetlist: true,
    capo: 0,
    notes: 'Momento de Oferta e Dízimos - Fonte Cifra Club oficial (Drops INA). Consagração de tudo: "Minha casa, meu dinheiro, meu destino por inteiro... Tudo é Teu!".',
    link: 'https://www.cifraclub.com.br/drops-ina/tudo-e-teu/',
    tags: ['Oferta', 'Dízimo', 'Gratidão', 'Drops INA', 'Cifra Club Oficial'],
    chords: `<b>[Intro]</b> <c>C</c>  <c>G/B</c>  <c>Am7</c>  <c>F</c>

<b>[Primeira Parte]</b>
<c>C</c>
 Não há ninguém como Jesus
<c>G/B</c>
 Em Sua mesa o pão e o vinho
<c>Am7</c>
 Dividiu com os pecadores
<c>F</c>
 Não há ninguém como Jesus

<c>C</c>
 Humilde servo e Rei da Glória
<c>G/B</c>
 Se entregou em sacrifício
<c>Am7</c>
 Por amor derramou Seu sangue
<c>F</c>
 Não há ninguém como Jesus

<b>[Pré-Refrão]</b>
<c>Dm7</c>
 E ao olhar pra Tua cruz
<c>C/E</c>
 Eu vejo quem Tu és
<c>F</c>
 E não me resta mais nada
<c>G</c>
 A não ser Te entregar tudo!

<b>[Refrão - Momento da Oferta]</b>
<c>C</c>
 Tudo que eu tenho é Teu, Cristo!
<c>G/B</c>
 Tudo que eu sou é Teu, Filho!
<c>Am7</c>
 Minha casa, meu dinheiro
<c>G</c>
 Meu destino por inteiro
<c>F</c>
 Tudo é Teu, tudo é Teu!

<c>C</c>
 Tudo que eu tenho é Teu, Cristo!
<c>G/B</c>
 Tudo que eu sou é Teu, Filho!
<c>Am7</c>
 Minha casa, meu dinheiro
<c>G</c>
 Meu destino por inteiro
<c>F</c>
 Tudo é Teu, tudo é Teu!

<b>[Ponte]</b>
<c>Am7</c>
 Eu me esvazio de mim
<c>G</c>
 Pra que Tu cresças em mim
<c>F</c>
 Eu me esvazio de mim
<c>C/E</c>
 Pra que Tu reines em mim!

<c>Dm7</c>
 Nada é meu, Senhor
<c>C/E</c>
 Tudo provém de Ti
<c>F</c>
 Minha vida e meus bens
<c>G</c>
 Consagro a Ti aqui!

<b>[Refrão Final]</b>
<c>C</c>
 Tudo que eu tenho é Teu, Cristo!
<c>G/B</c>
 Tudo que eu sou é Teu, Filho!
<c>Am7</c>
 Minha casa, meu dinheiro
<c>G</c>
 Meu destino por inteiro
<c>F</c>
 Tudo é Teu, tudo é Teu!

<c>C</c>
 Tudo que eu tenho é Teu, Cristo!
<c>G/B</c>
 Tudo que eu sou é Teu, Filho!
<c>Am7</c>
 Minha casa, meu dinheiro
<c>G</c>
 Meu destino por inteiro
<c>F</c>
 Tudo é Teu, tudo é Teu!

<b>[Final]</b>
<c>C</c>  <c>G/B</c>  <c>Am7</c>  <c>F</c>  <c>C</c>`
  }
];

export const INITIAL_SETLISTS: Setlist[] = [
  {
    id: 'culto-completo',
    title: 'Culto de Louvor & Adoração',
    date: new Date().toISOString().split('T')[0],
    minister: 'Equipe de Louvor',
    notes: 'Ordem completa do culto: Repertório inicial (1, 2, 3), Momento da Comunhão e Momento do Ofertório (Links Cifra Club).',
    items: [
      {
        songId: '1',
        transposition: 0,
        transitionNote: 'Repertório 1 - Consagração (Aline Barros). Cifra Club simplificada.'
      },
      {
        songId: '2',
        transposition: 0,
        transitionNote: 'Repertório 2 - Pode Morar Aqui / Minhas Lamparinas (Theo Rubia). Adoração e clamor.'
      },
      {
        songId: '3',
        transposition: 0,
        transitionNote: 'Repertório 3 - Vai Valer a Pena (Juliano Son). Declaração de fé e esperança eterna.'
      },
      {
        songId: '4',
        transposition: 0,
        transitionNote: 'Comunhão - Nosso Coração Queima (fhop music). Celebração da Ceia do Senhor.'
      },
      {
        songId: '5',
        transposition: 0,
        transitionNote: 'Oferta - Tudo É Teu (Drops INA). Consagração de dízimos e ofertas.'
      }
    ]
  }
];
