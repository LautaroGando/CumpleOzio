export type DestinationData = {
  order: number
  name: string
  description: string
  icon: string
  date: string
  dayLabel: string
  timeLabel: string
  isSpecial?: boolean
  isFinal?: boolean
}

export const DESTINATIONS_SEED: DestinationData[] = [
  {
    order: 1,
    name: 'El inicio del viaje',
    description:
      'Cada gran historia comienza con un primer paso. Esta noche, dejamos atrás la rutina y nos lanzamos juntos hacia la aventura.',
    icon: 'car',
    date: 'Viernes 20:00',
    dayLabel: 'Viernes',
    timeLabel: '20:00',
  },
  {
    order: 2,
    name: 'Desayuno en Villa Ventana',
    description:
      'La mañana huele a café recién hecho y a promesas. El primer desayuno del viaje, con el sol apenas asomándose entre los árboles.',
    icon: 'cup',
    date: 'Sábado 08:00',
    dayLabel: 'Sábado',
    timeLabel: '08:00',
  },
  {
    order: 3,
    name: 'Cerro Ventana',
    description:
      'Desde las alturas, el mundo se ve diferente. Cada paso que damos juntos nos acerca un poco más al cielo.',
    icon: 'mountain',
    date: 'Sábado 10:00',
    dayLabel: 'Sábado',
    timeLabel: '10:00',
  },
  {
    order: 4,
    name: 'Almuerzo',
    description:
      'Una pausa para reponer fuerzas y saborear el momento. La mejor compañía convierte cualquier comida en un banquete.',
    icon: 'plate',
    date: 'Sábado 14:00',
    dayLabel: 'Sábado',
    timeLabel: '14:00',
  },
  {
    order: 5,
    name: 'Paseo panorámico',
    description:
      'Miradores, bosques y paisajes que roban el aliento. La naturaleza nos regala su espectáculo más íntimo.',
    icon: 'tree',
    date: 'Sábado 16:00',
    dayLabel: 'Sábado',
    timeLabel: '16:00',
  },
  {
    order: 6,
    name: 'Merienda',
    description:
      'El mejor momento del día: sentarse, respirar y compartir algo dulce mientras la tarde se tiñe de dorado.',
    icon: 'cake',
    date: 'Sábado 18:00',
    dayLabel: 'Sábado',
    timeLabel: '18:00',
  },
  {
    order: 7,
    name: 'Recorrer el centro',
    description:
      'Las calles del pueblo guardan historias. Las farolas encienden una luz especial cuando las recorremos juntos.',
    icon: 'lantern',
    date: 'Sábado 19:00',
    dayLabel: 'Sábado',
    timeLabel: '19:00',
  },
  {
    order: 8,
    name: 'Cena',
    description:
      'Una noche perfecta merece el cierre perfecto. Copas, miradas y la magia de saber que este momento siempre existirá.',
    icon: 'wine',
    date: 'Sábado 22:00',
    dayLabel: 'Sábado',
    timeLabel: '22:00',
  },
  {
    order: 9,
    name: 'Desayuno',
    description:
      'El último desayuno del viaje sabe diferente. Cada sorbo de café lleva consigo el sabor de todo lo vivido.',
    icon: 'croissant',
    date: 'Domingo 09:00',
    dayLabel: 'Domingo',
    timeLabel: '09:00',
  },
  {
    order: 10,
    name: 'Paseo',
    description:
      'Un último paseo para guardarlo todo: los aromas, los sonidos, la textura del aire. Los recuerdos más hermosos no tienen apuro.',
    icon: 'tree',
    date: 'Domingo 11:00',
    dayLabel: 'Domingo',
    timeLabel: '11:00',
  },
  {
    order: 11,
    name: 'Almuerzo',
    description:
      'La mesa compartida es el lugar donde las historias se cuentan y los vínculos se fortalecen.',
    icon: 'plate',
    date: 'Domingo 14:00',
    dayLabel: 'Domingo',
    timeLabel: '14:00',
  },
  {
    order: 12,
    name: 'El camino de regreso',
    description:
      'El viaje termina... pero nuestra historia continúa. Cada kilómetro de vuelta lleva consigo los recuerdos de lo que fuimos juntos en estos días.',
    icon: 'heart',
    date: 'Domingo 16:00',
    dayLabel: 'Domingo',
    timeLabel: '16:00',
  },
  {
    order: 13,
    name: 'La gran sorpresa ✨',
    description:
      '¡Feliz cumpleaños, Ozio! Este momento fue pensado especialmente para vos. Que este año que comienza esté lleno de todo lo que merecés.',
    icon: 'gift',
    date: 'Lunes 00:00',
    dayLabel: 'Lunes',
    timeLabel: '00:00',
    isSpecial: true,
  },
  {
    order: 14,
    name: 'Celebración con los que más querés',
    description:
      'La vida se celebra mejor rodeados de amor. Cada persona aquí esta noche tiene un pedacito de vos en su corazón.',
    icon: 'star',
    date: 'Lunes 19:00',
    dayLabel: 'Lunes',
    timeLabel: '19:00',
    isFinal: true,
  },
]

export const LETTER_DEFAULT = `Bueno, llegó el día, no de tu cumpleaños, llegó tu PREcumpleaños, en el que se vienen más momentos maravillosos junto a mí, tutu, el amor de mi vida.

Lo bueno de que tu cumple caiga un lunes es que tenés un súper finde de sorpresas, hay que ver lo bueno, ¿no? Jiji.

Bueno, mi amor, te quería decir que estoy súper agradecido con la vida de que seas mi compañera y poder dar cada paso a tu lado. Ya son 7 años en los que vamos creciendo, y estamos a solo 1 mes de cumplir nuestra primer GRAN meta juntos, que es mudarnos a nuestro hogar, dulce hogar, en el que vamos a pasar mucho tiempo de calidad, mimándonos, COCINÁNDOTE (gorda), mirando pelis, jugando jueguitos, tomando matecitos y hacernos mucha, mucha compañía.

Espero poder hacer tu vida más cálida y, de a poco, sacarte todo el estrés que lleva mi tutu. ¡MASAJES GRATIS! (O NO, JIJI).

Vas a ser mi bebé, mi consentida y, sobre todo, el amor para toda mi vida.

Muy, pero muy, feliz PREfeliz cumpleaños, mi amorcito.

TE AMO ❤️`
