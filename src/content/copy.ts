/**
 * Todo el texto de la web vive acá. Editá libremente sin tocar componentes.
 * Los arrays de respuestas se recorren en orden y vuelven a empezar.
 */
export const copy = {
  meta: {
    title: 'feliz cumple, facu',
  },

  common: {
    hintButtonLabel: 'el hongo',
    hintClose: 'ya fue',
    /** menú que se abre al tocar el hongo */
    mushroom: {
      title: '¿y ahora qué?',
      hint: 'pista',
      hintDesc: 'una ayudita para esta pantalla',
      consume: 'consumir',
      consumeDesc: 'no preguntes',
      restart: 'volver a empezar',
      restartDesc: 'desde la primera pantalla',
      restartConfirm: '¿seguro? perdés todo',
      back: 'volver',
      /** al bajar el viaje, el fondo se apastela y aparece una de estas, al azar */
      tripTitle: 'este trip ha arrojado enseñanza',
      tripDismiss: 'volver a la realidad',
      quotes: [
        'El yo era un disfraz que te olvidaste puesto.',
        'Nada empieza ni termina: todo estaba pasando al mismo tiempo y vos mirabas de a una cosa.',
        'El miedo era la puerta, no la pared.',
        'No estás dentro del universo; el universo está pasando a través tuyo.',
        'La realidad no se rompió. Se le cayó la pintura.',
        'Lo que llamás "vos" es apenas la parte que aprendió a hablar.',
        'El tiempo no pasa. Pasás vos, y muy despacio.',
        'Cuando dejás de buscar el centro, descubrís que estabas parado ahí.',
        'El silencio no es la ausencia de sonido: es lo que queda cuando dejás de explicarte.',
        'No hay adentro ni afuera. Hay una sola cosa fingiendo ser muchas.',
        'Morirte de risa y morirte de miedo son el mismo movimiento visto de dos lados.',
        'La respuesta era tan obvia que hacía falta perderse para poder verla.',
        'Todo lo que mirás con atención suficiente empieza a devolverte la mirada.',
        'Lo eterno no dura para siempre: dura ahora.',
        'El camino no lleva a ningún lado porque nunca te fuiste.',
        'Lo que creías que eras estaba ocupando el lugar de lo que sos.',
        'Todo es exactamente lo que parece, una vez que dejás de necesitar que sea otra cosa.',
        'El universo no tiene sentido. Tiene algo mejor: tiene gracia.',
        'Soltar no es perder. Es dejar de cargar algo que nunca fue tuyo.',
        'Buscabas una salida y era una puerta que abría para adentro.',
      ],
      /** citas de autor: quedaron fuera del viaje, se pueden reciclar */
      attributedQuotes: [
        { text: 'Si las puertas de la percepción se purificaran, todo se mostraría tal cual es: infinito', author: 'William Blake' },
        { text: 'El cerebro es un mecanismo de reducción diseñado para evitar que seamos aplastados por la realidad', author: 'Aldous Huxley' },
        { text: 'No vemos las cosas como son, las vemos como somos', author: 'Immanuel Kant' },
        { text: 'Todo lo que llamamos real está hecho de cosas que no pueden ser consideradas reales', author: 'Niels Bohr' },
        { text: 'El universo no está hecho de cosas, sino de redes de vibración que nuestra mente congela en objetos', author: 'Alan Watts' },
        { text: 'Nuestros ojos físicos perciben apenas una ínfima fracción de la luz; todo lo que vemos es un truco diseñado para no volvernos locos', author: 'Albert Hofmann' },
        { text: 'El juego no se trata de convertirse en alguien, se trata de convertirse en nadie', author: 'Ram Dass' },
        { text: 'Tú eres el universo mirándose a sí mismo, jugando a que no es el universo', author: 'Alan Watts' },
        { text: 'El abismo no tiene fondo porque tú eres el abismo que se está cayendo dentro de sí mismo', author: 'Anónimo' },
        { text: 'El ojo con el que veo a Dios es el mismo ojo con el que Dios me ve', author: 'Meister Eckhart' },
        { text: 'Despertar es darse cuenta de que el pensador y el pensamiento son exactamente la misma sustancia', author: 'Jiddu Krishnamurti' },
        { text: 'El hombre es el único animal que no soporta ser lo que es', author: 'Albert Camus' },
        { text: 'No somos seres humanos atravesando una experiencia espiritual; somos seres espirituales viviendo una experiencia humana', author: 'Pierre Teilhard de Chardin' },
        { text: 'Los psicodélicos son ilegales porque disuelven las estructuras de opinión y los modelos culturales de comportamiento', author: 'Terence McKenna' },
        { text: 'La muerte es el despojo de todo lo que no eres; el secreto es morir antes de morir, y descubrir que no hay muerte', author: 'Eckhart Tolle' },
        { text: 'Lanzate al abismo absoluto y vas a descubrir que el fondo es, en realidad, un colchón de plumas', author: 'Terence McKenna' },
        { text: 'Ningún hombre se baña dos veces en el mismo río, pues ni el río ni el hombre son los mismos', author: 'Heráclito' },
        { text: 'Buscamos el infinito afuera sin notar que el espacio que contiene a las estrellas es idéntico al espacio que sostiene a tus pensamientos', author: 'Nisargadatta Maharaj' },
        { text: 'La mente que se estira por una nueva experiencia jamás vuelve a sus dimensiones originales', author: 'Oliver Wendell Holmes' },
        { text: 'El misterio no es qué pasa cuando morimos, sino qué pasa con el infinito cuando decidimos nacer', author: 'Anónimo' },
      ],
    },
    muteToActivate: 'poner música',
    muteToSilence: 'silenciar música',
    /** burbuja de cómic que aparece al resolver cada pantalla, antes de pasar */
    solved: {
      name: 'pasaste, máquina',
      harley: 'arrancó la bestia',
      cassette: 'rebobinaste toda tu vida',
      moon: 'le moviste la luna, loco',
    },
  },

  name: {
    prompt: '¿cómo te llamás?',
    placeholder: 'escribí tu nombre',
    submit: 'dale',
    /** comparación normalizada: sin acentos, sin mayúsculas, sin espacios de más */
    accepted: ['facundo', 'facu'],
    wrong: ['¿ya no te sabés tu nombre, bestia? andá a dormir y volvé'],
    successTitle: '¡bien papá! sabés tu nombre',
    successBody: 'primer acertijo servido en bandeja. no te acostumbres.',
    successCta: 'arrancamos!',
    hint: '¿ya no sabés ni cómo te llamás?',
  },

  harley: {
    hint: 'todo es energía',
    enterTitle: 'ARRANCALA BESTIA',
    enterCta: 'dale',
    toolWrench: 'llave',
    toolCharger: 'cargador',
    dragHint: 'tirá algo sobre la moto',
    kickLabel: 'patada',
    kickReady: 'ahora sí. pateala.',
    wrenchTitle: 'pa qué metés mano si no sabés',
    wrenchCta: 'uh, perdón',
    chargeTitle: 'cargando la bestia',
    chargeBody: 'todo es energía. bancá tres segundos.',
    chargeCta: 'continuar',
  },

  cassette: {
    title: 'rebobiná',
    instruction: 'metele la lapicera en un agujero',
    penLabel: 'lapicera',
    rewinding: 'rebobinando...',
    quizIntro: 'a ver qué tanto sabés',
    quizProgress: (n: number, total: number) => `${n} de ${total}`,
    quizFailTitle: 'qué flojo estás',
    quizFailBody: 'de nuevo, y esta vez pensá.',
    quizFailCta: 'reintentar',
    /** en esta pantalla "consumir" es el atajo: resuelve sin responder el quiz */
    hint: 'la lapicera va en el agujero. lo demás es escuchar.',
    bands: ['The Beatles', 'The Rolling Stones', 'Led Zeppelin', 'Pink Floyd'],
    questions: [
      { song: 'Dear Prudence', answer: 'The Beatles' },
      { song: 'Gimme Shelter', answer: 'The Rolling Stones' },
      { song: 'Ramble On', answer: 'Led Zeppelin' },
      { song: 'Us and Them', answer: 'Pink Floyd' },
      { song: 'Tumbling Dice', answer: 'The Rolling Stones' },
    ],
  },

  moon: {
    title: 'alpha moon',
    subtitle: 'está esperando algo',
    hintDialogTitle: 'voy a modificar el tiempo',
    hintDialogBody: 'elegí en qué fase querés que esté la luna.',
    hintDialogCta: 'dale',
    phaseLabels: [
      'luna nueva',
      'creciente',
      'cuarto creciente',
      'gibosa creciente',
      'luna llena',
      'gibosa menguante',
      'cuarto menguante',
      'menguante',
    ],
    wrongPhase: 'no pasa nada. probá otra.',
  },

  final: {
    title: 'el regalo',
    message:
      'acá va el mensaje final. editá este texto en src/content/copy.ts cuando sepas qué le vas a regalar.',
    imageSlotAlt: 'el regalo (placeholder)',
  },
} as const
