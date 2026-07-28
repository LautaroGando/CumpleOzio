export type MissionType = 'PHOTO' | 'RIDDLE' | 'TIMER' | 'MESSAGE' | 'GPS' | 'BUTTON_HOLD'

export interface Mission {
  id: string
  title: string
  description: string
  type: MissionType
  
  // Specific fields for different mission types
  riddleAnswer?: string // for RIDDLE
  timerSeconds?: number // for TIMER
  requiredLocation?: { lat: number; lng: number, radiusMeters: number } // for GPS
  messageText?: string // for MESSAGE
  buttonHoldSeconds?: number // for BUTTON_HOLD
  photoPrompt?: string // for PHOTO

  successMessage: string
}

export interface Chapter {
  id: string
  order: number
  title: string
  description: string
  dayLabel: string
  timeLabel: string
  
  // The map point to unlock after this chapter's missions are done
  destinationName: string
  destinationCoordinates: { x: number; y: number } // percentages for illustrative map (0-100)
  
  missions: Mission[]
  isFinal?: boolean
}

export const STORY_CHAPTERS: Chapter[] = [
  {
    id: 'chap_1',
    order: 1,
    title: 'El Comienzo',
    description: 'Nuestra aventura comienza con un primer misterio.',
    dayLabel: 'Viernes',
    timeLabel: '20:00',
    destinationName: 'Rumbo a la aventura',
    destinationCoordinates: { x: 20, y: 80 },
    missions: [
      {
        id: 'm_1_1',
        title: 'El Objeto Oculto',
        description: 'Hay algo escondido dentro del auto. Búscalo, saca una foto y súbela para continuar con la sorpresa.',
        type: 'PHOTO',
        photoPrompt: 'Saca una foto de la campera escondida.',
        successMessage: '¡BIENVENIDA A VILLA VENTANA! 🎉'
      }
    ]
  },
  {
    id: 'chap_2',
    order: 2,
    title: 'Desayuno en el Camino',
    description: 'El sol de la mañana nos acompaña hacia un destino desconocido.',
    dayLabel: 'Sábado',
    timeLabel: '08:00',
    destinationName: 'Cerro Ventana',
    destinationCoordinates: { x: 40, y: 50 },
    missions: [
      {
        id: 'm_2_1',
        title: 'El Enigma de la Piedra',
        description: 'La naturaleza creó este lugar sin ayuda del hombre. ¿Qué puede atravesar una montaña sin ser un túnel?',
        type: 'RIDDLE',
        riddleAnswer: 'Una ventana',
        successMessage: '¡Correcto! Nuestro próximo destino nos espera.'
      },
      {
        id: 'm_2_2',
        title: 'Recuerdo del Desayuno',
        description: 'Sácale una foto a nuestro desayuno para guardarlo de recuerdo.',
        type: 'PHOTO',
        photoPrompt: 'Una foto del desayuno',
        successMessage: '¡Guardada para el álbum!'
      }
    ]
  },
  {
    id: 'chap_3',
    order: 3,
    title: 'Antes del Trekking',
    description: 'La montaña nos llama.',
    dayLabel: 'Sábado',
    timeLabel: '10:00',
    destinationName: 'Sendero del Cerro',
    destinationCoordinates: { x: 45, y: 40 },
    missions: [
      {
        id: 'm_3_1',
        title: 'Formas Curiosas',
        description: 'Encuentra una piedra con una forma curiosa antes de empezar a subir y tómale una foto.',
        type: 'PHOTO',
        photoPrompt: 'Foto de la piedra curiosa',
        successMessage: 'Esa piedra será nuestro amuleto. ¡A subir!'
      }
    ]
  },
  {
    id: 'chap_4',
    order: 4,
    title: 'En la Cima',
    description: 'El mundo se ve distinto desde aquí arriba.',
    dayLabel: 'Sábado',
    timeLabel: '12:00',
    destinationName: 'Cumbre del Cerro Ventana',
    destinationCoordinates: { x: 50, y: 30 },
    missions: [
      {
        id: 'm_4_1',
        title: 'Un Minuto de Paz',
        description: 'Siéntense juntos, miren el paisaje y no hablen durante un minuto. Solo escuchen.',
        type: 'TIMER',
        timerSeconds: 60,
        successMessage: 'Hay silencios que dicen más que mil palabras. Qué lindo es compartir esto con vos.'
      },
      {
        id: 'm_4_2',
        title: 'Selfie de Altura',
        description: 'Saca una foto de los dos en la cima para recordar que llegamos hasta acá.',
        type: 'PHOTO',
        photoPrompt: 'Selfie en la cumbre',
        successMessage: 'Un recuerdo más alto que las nubes.'
      }
    ]
  },
  {
    id: 'chap_5',
    order: 5,
    title: 'El Descenso',
    description: 'Bajando con el corazón lleno.',
    dayLabel: 'Sábado',
    timeLabel: '13:30',
    destinationName: 'Restaurante Oculto',
    destinationCoordinates: { x: 60, y: 35 },
    missions: [
      {
        id: 'm_5_1',
        title: 'Un Recuerdo del Camino',
        description: 'Busca una hoja linda mientras bajamos y sácale una foto.',
        type: 'PHOTO',
        photoPrompt: 'Foto de la hoja',
        successMessage: '¡Hermosa hoja! Y ahora sí, nos ganamos un buen almuerzo.'
      }
    ]
  },
  {
    id: 'chap_6',
    order: 6,
    title: 'Después del Almuerzo',
    description: 'Aún quedan secretos por descubrir.',
    dayLabel: 'Sábado',
    timeLabel: '15:30',
    destinationName: 'Garganta Olvidada',
    destinationCoordinates: { x: 70, y: 25 },
    missions: [
      {
        id: 'm_6_1',
        title: 'El Agua Escondida',
        description: 'Busquemos el lugar donde el agua se esconde entre las piedras.',
        type: 'GPS',
        requiredLocation: { lat: -38.0772, lng: -62.0169, radiusMeters: 200 },
        successMessage: 'Llegamos a la Garganta Olvidada.'
      },
      {
        id: 'm_6_2',
        title: 'Los Ojos Cerrados',
        description: 'Cierra los ojos. Escucha el sonido del agua durante 20 segundos. Sin sacar fotos.',
        type: 'TIMER',
        timerSeconds: 20,
        successMessage: 'A veces los mejores recuerdos no necesitan una cámara.'
      },
      {
        id: 'm_6_3',
        title: 'El Agua',
        description: 'Ahora sí, sácale una foto al agua fluyendo entre las piedras.',
        type: 'PHOTO',
        photoPrompt: 'Foto del agua',
        successMessage: 'Frescura guardada.'
      }
    ]
  },
  {
    id: 'chap_7',
    order: 7,
    title: 'La Tarde',
    description: 'El sol empieza a bajar lentamente.',
    dayLabel: 'Sábado',
    timeLabel: '17:30',
    destinationName: 'Abra de la Ventana',
    destinationCoordinates: { x: 80, y: 40 },
    missions: [
      {
        id: 'm_7_1',
        title: 'Momento Mate',
        description: 'Busquemos un lugar lindo. Abramos el mate. Y disfrutemos este momento.',
        type: 'MESSAGE',
        successMessage: 'El mejor momento del día.'
      },
      {
        id: 'm_7_2',
        title: 'La Foto Favorita',
        description: 'Toma la foto favorita del viaje hasta ahora con la luz del atardecer.',
        type: 'PHOTO',
        photoPrompt: 'La foto favorita del viaje',
        successMessage: 'Un recuerdo dorado para siempre.'
      }
    ]
  },
  {
    id: 'chap_8',
    order: 8,
    title: 'La Cena',
    description: 'La noche nos regala su encanto.',
    dayLabel: 'Sábado',
    timeLabel: '21:30',
    destinationName: 'Restaurante Nocturno',
    destinationCoordinates: { x: 65, y: 65 },
    missions: [
      {
        id: 'm_8_1',
        title: 'Un Plato para el Otro',
        description: 'Esta noche yo elijo lo que vas a comer, y vos elegís lo mío. ¿Aceptas el reto?',
        type: 'BUTTON_HOLD',
        buttonHoldSeconds: 3,
        successMessage: '¡Reto aceptado! A disfrutar de la cena.'
      },
      {
        id: 'm_8_2',
        title: 'Una Noche Especial',
        description: 'Una carta romántica te espera...',
        type: 'MESSAGE', 
        messageText: 'Querida Ozio,\n\nVerte sonreír hoy ha sido mi parte favorita del viaje. No importan los paisajes increíbles ni las montañas altas, mi mejor vista siempre vas a ser vos.\n\nGracias por acompañarme en esta aventura y en la vida.\n\nTe amo.\n\n— Tu amor',
        successMessage: 'La magia de la noche es toda tuya.'
      },
      {
        id: 'm_8_3',
        title: 'Brindis',
        description: 'Toma una foto de nuestro brindis.',
        type: 'PHOTO',
        photoPrompt: 'Foto del brindis',
        successMessage: '¡Salud!'
      }
    ]
  },
  {
    id: 'chap_9',
    order: 9,
    title: 'Un Nuevo Día',
    description: 'La mañana nos espera con nuevas sorpresas.',
    dayLabel: 'Domingo',
    timeLabel: '09:00',
    destinationName: 'Piletones Naturales',
    destinationCoordinates: { x: 30, y: 30 },
    missions: [
      {
        id: 'm_9_1',
        title: 'Obra de la Naturaleza',
        description: 'La naturaleza tardó miles de años en crear este lugar. Vayamos hacia allá.',
        type: 'GPS',
        requiredLocation: { lat: -38.0, lng: -62.0, radiusMeters: 500 },
        successMessage: 'Llegamos a los Piletones Naturales.'
      },
      {
        id: 'm_9_2',
        title: 'La Piedra Elegida',
        description: 'Elige una piedra. Guárdala en tu bolsillo.',
        type: 'MESSAGE',
        successMessage: 'No por la piedra. Sino por el recuerdo.'
      },
      {
        id: 'm_9_3',
        title: 'Un Reflejo',
        description: 'Saca una foto del agua reflejando el cielo.',
        type: 'PHOTO',
        photoPrompt: 'Foto del reflejo en el agua',
        successMessage: 'Perfecto.'
      }
    ]
  },
  {
    id: 'chap_10',
    order: 10,
    title: 'El Último Almuerzo',
    description: 'Sierra de la Ventana nos recibe.',
    dayLabel: 'Domingo',
    timeLabel: '14:00',
    destinationName: 'Sierra de la Ventana',
    destinationCoordinates: { x: 15, y: 40 },
    missions: [
      {
        id: 'm_10_1',
        title: 'Perderse para Encontrarse',
        description: 'Caminar diez minutos sin rumbo por el pueblo. No usar el celular.',
        type: 'TIMER',
        timerSeconds: 600, // 10 mins
        successMessage: 'Perderse con vos es mi pasatiempo favorito.'
      },
      {
        id: 'm_10_2',
        title: 'Rincón Pintoresco',
        description: 'Saca una foto del lugar más lindo que hayas visto en este paseo.',
        type: 'PHOTO',
        photoPrompt: 'Foto de un lugar pintoresco',
        successMessage: 'Capturaste la esencia del lugar.'
      }
    ]
  },
  {
    id: 'chap_11',
    order: 11,
    title: 'El Regreso',
    description: 'Cada kilómetro de vuelta lleva consigo los recuerdos de lo que fuimos.',
    dayLabel: 'Domingo',
    timeLabel: '16:00',
    destinationName: 'Camino a Casa',
    destinationCoordinates: { x: 10, y: 70 },
    missions: [
      {
        id: 'm_11_1',
        title: 'Fin de la Sorpresa',
        description: 'Esta sorpresa está por terminar, pero nuestra historia sigue.',
        type: 'MESSAGE',
        successMessage: '¡Todo completado!'
      },
      {
        id: 'm_11_2',
        title: 'La Última Foto',
        description: 'Sácanos la última foto de hoy, como cierre.',
        type: 'PHOTO',
        photoPrompt: 'Selfie final',
        successMessage: '¡Gracias por compartir esto conmigo!'
      }
    ],
    isFinal: true
  }
]
