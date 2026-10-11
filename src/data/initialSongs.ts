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
    notes: 'Repertório 1 - Letra e Cifra completa oficial (Cifra Club). Entrada enérgica com teclado e bateria. Toda a igreja canta o refrão em uníssono.',
    tags: ['Abertura', 'Celebração', 'Louvor', 'Cifra Club Oficial', 'Completa'],
    chords: `<b>[Intro]</b> <c>A</c>  <c>A4</c>  <c>A</c>  <c>A4</c>  <c>E/G#</c>  <c>F#m7</c>  <c>D</c>  <c>E</c>

<b>[Primeira Parte]</b>
<c>A</c>          <c>E/G#</c>
 Ao Rei dos reis consagro
<c>Em/G</c>   <c>D/F#</c>
 Tudo o que sou
<c>Dm/F</c>        <c>A/E</c>
 De gratos louvores transborda
<c>E/B</c>   <c>B7</c>   <c>E</c>
 O meu coração
<c>A</c>        <c>E/G#</c>
 A minha vida eu entrego
<c>Em/G</c>        <c>D/F#</c>
 Nas Tuas mãos, meu Senhor
<c>Dm/F</c>           <c>A/E</c>
 Pra Te exaltar com todo meu ser
<c>E/B</c>    <c>E</c>    <c>A</c>
 Em todo o tempo

<b>[Pré-Refrão]</b>
<c>E</c>
 Exaltado seja o Teu nome
<c>D/F#</c>                <c>E/G#</c>
 Exaltado seja o Teu santo nome!

<b>[Refrão]</b>
<c>A</c>          <c>E/G#</c>
 Digno és de glória e louvor
<c>F#m7</c>       <c>D</c>
 Digno és de honra e poder
<c>A/C#</c>        <c>Bm7</c>        <c>E</c>
 Santo, santo, Pai poderoso
<c>A</c>          <c>E/G#</c>
 Digno és de glória e louvor
<c>F#m7</c>       <c>D</c>
 Digno és de honra e poder
<c>A/C#</c>        <c>E</c>            <c>A</c>   <c>E</c>
 Santo, santo, Pai poderoso!

<b>[Segunda Parte]</b>
<c>A</c>          <c>E/G#</c>
 Ao Rei dos reis consagro
<c>Em/G</c>   <c>D/F#</c>
 Tudo o que sou
<c>Dm/F</c>        <c>A/E</c>
 De gratos louvores transborda
<c>E/B</c>   <c>B7</c>   <c>E</c>
 O meu coração
<c>A</c>        <c>E/G#</c>
 A minha vida eu entrego
<c>Em/G</c>        <c>D/F#</c>
 Nas Tuas mãos, meu Senhor
<c>Dm/F</c>           <c>A/E</c>
 Pra Te exaltar com todo meu ser
<c>E/B</c>    <c>E</c>    <c>A</c>
 Em todo o tempo

<b>[Ponte]</b>
<c>F#m7</c>      <c>C#m7</c>
 Toda a terra se prostrará
<c>D</c>         <c>A/C#</c>
 E toda a língua confessará
<c>Bm7</c>       <c>D/E</c>         <c>A</c>   <c>A/C#</c>
 Que Tu és Senhor, que Tu és Senhor!
<c>F#m7</c>      <c>C#m7</c>
 Toda a terra se prostrará
<c>D</c>         <c>A/C#</c>
 E toda a língua confessará
<c>Bm7</c>       <c>E</c>           <c>F#m7</c>  <c>E</c>  <c>D</c>
 Que Tu és Senhor, que Tu és Senhor!

<b>[Refrão Final]</b>
<c>A</c>          <c>E/G#</c>
 Digno és de glória e louvor
<c>F#m7</c>       <c>D</c>
 Digno és de honra e poder
<c>A/C#</c>        <c>Bm7</c>        <c>E</c>
 Santo, santo, Pai poderoso
<c>A</c>          <c>E/G#</c>
 Digno és de glória e louvor
<c>F#m7</c>       <c>D</c>
 Digno és de honra e poder
<c>A/C#</c>        <c>E</c>            <c>A</c>
 Santo, santo, Pai poderoso!

<b>[Final]</b>
<c>A/C#</c>        <c>D</c>      <c>E</c>      <c>A</c>
 Santo, santo, Pai poderoso!`
  },
  {
    id: '2',
    title: 'Minhas Lamparinas (Pode Morar Aqui)',
    artist: 'Theo Rubia & Alessandro Vilas Boas',
    key: 'C',
    bpm: 68,
    timeSig: '4/4',
    category: 'Adoração',
    inSetlist: true,
    capo: 3,
    notes: 'Repertório 2 - Letra e Cifra completa oficial (Cifra Club). Tom em C (original com Capo na 3ª casa em Eb). Inclui o momento profético "Tem fogo nos olhos" e "Minhas lamparinas estão acesas".',
    tags: ['Adoração', 'Entrega', 'Intimidade', 'Cifra Club Oficial', 'Completa'],
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
    notes: 'Repertório 3 - Letra e Cifra completa oficial (Cifra Club). Composição de Rita Springer adaptada por Juliano Son. O arranjo cresce do dedilhado íntimo até o clamor pleno no refrão.',
    tags: ['Louvor', 'Fidelidade', 'Esperança', 'Cifra Club Oficial', 'Completa'],
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
    notes: 'Momento de Comunhão / Santa Ceia - Letra e Cifra completa oficial (Cifra Club & FHOP Music). Composição de Ellen D\'Karla. Foco no anseio pela volta de Cristo e na comunhão da mesa.',
    tags: ['Comunhão', 'Ceia do Senhor', 'Maranata', 'Cifra Club Oficial', 'Completa'],
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
    title: 'Tudo É Teu (Tudo Que Eu Tenho É Teu)',
    artist: 'Morada (Banda MORADA)',
    key: 'D',
    bpm: 125,
    timeSig: '4/4',
    category: 'Oferta',
    inSetlist: true,
    capo: 0,
    notes: 'Momento de Oferta e Dízimos - Letra e Cifra completa oficial (Cifra Club). Canção de consagração e gratidão, declarando que todos os nossos bens e talentos pertencem ao Senhor.',
    tags: ['Oferta', 'Dízimo', 'Gratidão', 'Cifra Club Oficial', 'Completa'],
    chords: `<b>[Intro]</b> <c>D</c>  <c>A</c>  <c>Bm7</c>  <c>G</c>
        <c>D</c>  <c>A</c>  <c>Bm7</c>  <c>G</c>

<b>[Primeira Parte]</b>
<c>D</c>
 De todo lugar, perdidos virão
<c>A</c>
 Em uma só voz, livres vamos cantar
<c>Bm7</c>
 Jesus, por Ti eu viverei
<c>G</c>
 Nunca me envergonharei

<c>D</c>
 De todo lugar, perdidos virão
<c>A</c>
 Em uma só voz, livres vamos cantar
<c>Bm7</c>
 Jesus, por Ti eu viverei
<c>G</c>
 Nunca me envergonharei

<b>[Segunda Parte - Consagração da Oferta]</b>
<c>D</c>
 A minha vida é a Tua vida
<c>A</c>
 Tudo o que sou é totalmente Teu, Senhor
<c>Bm7</c>
 O meu presente, o meu futuro eu entreguei
<c>G</c>
 E o meu passado eu afoguei no mar

<c>D</c>
 Meu coração, a minha oferta
<c>A</c>
 Tudo o que tenho entrego no Teu altar
<c>Bm7</c>
 O meu sustento vem de Ti
<c>G</c>
 Toda provisão vem de Tuas mãos

<b>[Refrão]</b>
<c>D</c>
 Teu, Teu, tudo é Teu!
<c>A</c>
 Teu, Teu, tudo é Teu!
<c>Bm7</c>
 Meu ser e todo meu louvor
<c>G</c>
 Teu, Teu, tudo é Teu!

<c>D</c>
 Tudo o que eu tenho é Teu!
<c>A</c>
 Tudo o que eu tenho é Teu!
<c>Bm7</c>
 Minha vida, meu louvor
<c>G</c>
 Meu coração é Teu, Senhor!

<b>[Ponte]</b>
<c>Em7</c>            <c>D/F#</c>
 Levaste a cruz, morreste e vivo estás
<c>G</c>                 <c>A</c>
 Meu Deus, meu tudo sempre Te darei!
<c>Em7</c>            <c>D/F#</c>
 Não há nada que eu tenha aqui
<c>G</c>                 <c>A</c>
 Que não pertença a Ti, Senhor!

<b>[Ponte 2 - Nova Criatura]</b>
<c>D</c>
 Sou nova criatura, sou nova criatura!
<c>A</c>
 Sou nova criatura, sou nova criatura!
<c>Bm7</c>
 Em uma só voz, livres vamos cantar
<c>G</c>
 Em uma só voz, livres vamos cantar!

<b>[Refrão Final]</b>
<c>D</c>
 Teu, Teu, tudo é Teu!
<c>A</c>
 Teu, Teu, tudo é Teu!
<c>Bm7</c>
 Meu ser e todo meu louvor
<c>G</c>
 Teu, Teu, tudo é Teu!

<c>D</c>
 Tudo o que eu tenho é Teu!
<c>A</c>
 Tudo o que eu tenho é Teu!
<c>Bm7</c>
 Minha vida, meu louvor
<c>G</c>
 Meu coração é Teu, Senhor!

<b>[Final]</b>
<c>D</c>  <c>A</c>  <c>Bm7</c>  <c>G</c>  <c>D</c>`
  }
];

export const INITIAL_SETLISTS: Setlist[] = [
  {
    id: 'culto-completo',
    title: 'Culto de Louvor & Adoração',
    date: new Date().toISOString().split('T')[0],
    minister: 'Equipe de Louvor',
    notes: 'Ordem completa do culto: Repertório inicial (1, 2, 3), Momento da Comunhão e Momento do Ofertório.',
    items: [
      {
        songId: '1',
        transposition: 0,
        transitionNote: 'Repertório 1 - Consagração (Aline Barros). Abertura vibrante com louvor ao Rei.'
      },
      {
        songId: '2',
        transposition: 0,
        transitionNote: 'Repertório 2 - Minhas Lamparinas / Pode Morar Aqui. Clamor por intimidade ("Tem fogo nos olhos").'
      },
      {
        songId: '3',
        transposition: 0,
        transitionNote: 'Repertório 3 - Vai Valer a Pena (Juliano Son). Declaração de fé e esperança eterna.'
      },
      {
        songId: '4',
        transposition: 0,
        transitionNote: 'Comunhão - Nosso Coração Queima (fhop music). Santa Ceia e expectativa da volta de Jesus.'
      },
      {
        songId: '5',
        transposition: 0,
        transitionNote: 'Oferta - Tudo Que Eu Tenho É Teu (Morada). Gratidão, generosidade e entrega dos frutos ao Senhor.'
      }
    ]
  }
];
