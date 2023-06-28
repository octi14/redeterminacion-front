const rubros = [
  {
    id: 1,
    nombre: 'Carnicerías',
    descripcion: 'Establecimiento comercial dedicado pre eminentemente al fraccionamiento de cortes bovinos, ovinos, porcinos y caprinos en general, así como a sus menudencias y embutidos.',
    ordenanzas: ["12312/22", "6543213/18"],
    links: ["www.google.com.ar", "www.youtube.com"],
    requisitos: ["Lorem ipsum dolor sit amet, consectetur <a href='www.google.com.ar'>adipiscing elit</a>, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."]
  },
  {
    id: 2,
    nombre: 'Pescadería',
    descripcion: 'Establecimientos dedicados a la venta de productos de mar y agua.',
    ordenanzas: [],
    links: [],
    requisitos: ["Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."]
  },
  {
    id: 3,
    nombre: 'Verdulería',
    descripcion: 'Establecimiento dedicado pre eminentemente a la venta de frutas, hortalizas, tubérculos y/o verduras sueltas o envasados, frutas secas, carbón embolsado en material ecológico en estanterías o lugar separado.',
    ordenanzas: [],
    links: [],
    requisitos: ["Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."]
  },
  {
    id: 4,
    nombre: 'Fiambrería',
    descripcion: 'Establecimiento dedicado pre eminentemente a la venta de fiambres preelaborados y quesos.',
    ordenanzas: [],
    links: [],
    requisitos: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."]
  },
  {
    id: 5,
    nombre: 'Panadería, Repostería y/o Pastelería',
    descripcion: 'Local destinado a la venta de pan, masas finas, con factibilidad de consumo en el lugar, sin fabricación',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 6,
    nombre: 'Venta de Productos de Granja',
    descripcion: 'Local destinado a la venta minorista de carnes caprinas, conejos y aves y sus derivados.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 7,
    nombre: 'Despensa',
    descripcion: 'Local para la venta minorista simultánea, dividido en secciones comercialmente independientes, de sustancias alimenticias en general, bebidas envasadas, tocador, bazar y limpieza. Pudiendo tener como anexo compatible los usos de venta de golosinas y despacho de pan. De superficie máxima de exposición y venta 100 m2.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 8,
    nombre: 'Proveeduría',
    descripcion: 'Local para la venta minorista simultánea, dividido en secciones comercialmente independientes, de sustancias alimenticias en general, bebidas envasadas, tocador, bazar y limpieza. Pudiendo tener como anexo compatible los usos de venta de golosinas y despacho de pan. De superficie máxima de exposición y venta 300 m2.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 9,
    nombre: 'Supermercado',
    descripcion: 'Local para la venta minorista simultánea, dividido en secciones comercialmente independientes, de sustancias alimenticias en general, bebidas envasadas, tocador, bazar y limpieza. Pudiendo tener como anexo compatible los usos de venta de golosinas y despacho de pan. De superficie máxima de exposición y venta 900 m2.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 10,
    nombre: 'Dietética/ Herboristeria/ Producto Apto Celíacos',
    descripcion: 'Local para la venta minorista de productos aptos celiacos y dietéticos, hierbas, productos naturales y desecados. Se podrá comercializar productos congelados y envasados',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 11,
    nombre: 'Elaboración y Venta de Alfajores, Chocolates y Dulces',
    descripcion: 'Podrán expender además de los productos mencionados como anexo los siguientes usos compatibles cafetería, venta de licores artesanales y repostería. Puede incluir consumo en el lugar.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 12,
    nombre: 'Elaboración y Venta de Bebidas Alcohólicas Artesanales',
    descripcion: 'Establecimiento destinado a la elaboración y venta de bebidas alcohólicas artesanales como vino, cerveza o licores. Sin consumo en el lugar.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 13,
    nombre: 'Elaboración y Venta de Pan, Repostería y/o Pastelería',
    descripcion: 'Establecimiento destinado a la elaboración y venta de pan y productos de pastelería y reposterías. Puede incluir consumo el lugar.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 14,
    nombre: 'Local de Venta Comidas para Llevar',
    descripcion: 'Establecimientos destinados a la producción, elaboración, exposición y venta de productos comestibles que no podrán ser consumidos en el lugar. Ej. Rotiserías.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 15,
    nombre: 'Local de Venta de Golosinas Envasadas:(Kiosco)',
    descripcion: 'Comercio minorista sin acceso al público, donde se vende golosinas, cigarrillos, bebidas sin alcohol envasadas o enlatadas, y helados envasados al vacío.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 16,
    nombre: 'Heladería',
    descripcion: 'Establecimiento destinado a la venta de helados con o sin fabricación en el mismo local. Podrán tener sillas y mesas en el local de venta. Pudiendo tener como anexo compatible los usos de venta de chocolates, Cafetería y repostería.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 18,
    nombre: 'Venta de Artículos Regionales',
    descripcion: 'Local destinado a la venta de productos alimenticios preenvasados y de realización artesanal como mermeladas, licores tabla de fiambres o embutidos. Puede complementar con fiambrería. Sin consumo en el lugar.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 19,
    nombre: 'Tabaquería, Cigarrería',
    descripcion: 'Local donde se efectúa la venta de productos relacionados con el tabaco.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 20,
    nombre: 'Comercio Minorista Excluido Comestible (Alimenticio) como Uso Principal',
    descripcion: 'Local de venta de productos al consumidor final, excluido productos alimenticios.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 21,
    nombre: 'Local de Venta de Antigüedades, Objetos de Arte',
    descripcion: 'Locales destinados a la venta de muebles, vajillas, relojes, adornos, cuadros con valor de antigüedad y/o arte.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 22,
    nombre: 'Local de Venta de Articulos Deportivos',
    descripcion: 'Locales destinados a la venta de artículos y vestimenta deportiva, armas y/o cuchillos de carácter deportivo.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 23,
    nombre: 'Vivero',
    descripcion: 'Establecimiento destinado a la venta de flores, semillas, árboles y arbustos, plantas en general. Incluye artículos para el jardín.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 24,
    nombre: 'Floreria',
    descripcion: 'Locales destinados a la venta flores y regalos anexos.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 25,
    nombre: 'Local de Venta de Artículos de Decoración',
    descripcion: 'Locales donde se efectúa la venta de cortinas, alfombras, tapices, rieles, telas para tapicería, papeles decorativos, madera, ornamentos de goma, colas y demás accesorios y útiles para la decoración. Comprende el servicio de asesoramiento y colocación.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 26,
    nombre: 'Venta de Artículos para el Hogar',
    descripcion: 'Comercio minorista, sin depósito en el lugar, destinado a la venta de electrodomésticos, muebles y electrónica. Industria blanca.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 27,
    nombre: 'Venta de Muebles',
    descripcion: 'Local destinado a la venta de muebles de madera, mimbre, aceros, plásticos o similar.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 28,
    nombre: 'Bazar/ Regalos',
    descripcion: 'Establecimiento dedicado a la venta de artículos de uso doméstico De almacenamiento y conservación doméstica, instrumentos de cocción, limpieza doméstica, regalos para la decoración.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 29,
    nombre: 'Mercería/ Botoneria',
    descripcion: 'Comercio minorista donde se venden accesorios para la vestimenta.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 30,
    nombre: 'Tienda de Ropa/ de Vestir/ de Blanco/ Zapateria',
    descripcion: 'Comercio minorista destinado a la venta de indumentaria y/o accesorios de la higiene compuestos por fibras textiles vegetales y/o sintéticas y/o de marroquinería y/o cuero.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 31,
    nombre: 'Articulos de Playa',
    descripcion: 'Comercio minorista donde se venden accesorios y complementos para estadía en la playa. Incluye protecciones solares, flotantes, anteojos, elementos de sombra, sillas, heladeras, etc.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 32,
    nombre: 'Santeria, Art. de Culto',
    descripcion: 'Comercio minorista donde se venden productos asociados al culto y/o liturgia.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 33,
    nombre: 'Forrajeria',
    descripcion: 'Comercio minorista donde se vende alimentos, semillas, venenos, herramientas y todo lo comprendido, con acceso al público.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 34,
    nombre: 'Mascoteria',
    descripcion: 'Local donde se efectúa la venta de artículos para mascotas, incluido alimento y mascotas.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 35,
    nombre: 'Óptica y Fotografía',
    descripcion: 'Local de venta de productos ópticos, electrónicos, procesos de revelado, enmarcado. Incluye artículos e instrumentos musicales.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 36,
    nombre: 'Joyería y/o Relojería',
    descripcion: 'Establecimiento dedicado a la venta y/o reparación de joyas y relojes, incluye enmarcados, grabados, encadenados y metalizados.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 37,
    nombre: 'Farmacia',
    descripcion: 'Comercio minorista donde se venden medicamentos, perfumería y todo lo comprendido.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 38,
    nombre: 'Perfumeria',
    descripcion: 'Comercio minorista donde se venden esencias aromáticas, perfumes o similares.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 39,
    nombre: 'Articulos de Limpieza/ Quimica',
    descripcion: 'Comercio minorista donde se venden sanitizantes, líquidos envasados destinados a la asepsia, higiene y tocador. Derivados químicos, fraccionados previamente o no.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 40,
    nombre: 'Ortopedia',
    descripcion: 'Locales destinados a la venta de artículos y vinculados a la ortopedia y otros fines médicos.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 41,
    nombre: 'Local de Venta de Materiales de Construcción p/ Terminaciones (Exposición y Venta)',
    descripcion: 'Local donde se efectúa venta minorista de materiales de construcción con especialidad en revestimientos, sanitarios, carpinterías, electricidad y terminaciones varias, previamente fraccionados, con exhibición de muestras, sin despacho con camiones.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 42,
    nombre: 'Pinturería',
    descripcion: 'Local donde se efectúa la venta de artículos de origen químico como pinturas, esmaltes, solvente, pinceles, etc.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 43,
    nombre: 'Ferretería',
    descripcion: 'Comercio minorista donde se venden herramientas, herrajes, clavos y tornillos, cañerías, repuestos y accesorios en general.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 44,
    nombre: 'Vidriería',
    descripcion: 'Comercio minorista donde se cortan y expenden vidrios y espejos.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 45,
    nombre: 'Cerrajería',
    descripcion: 'Local destinado a la venta y reparación de candados, herrajes, cerraduras, llaves, cajas de seguridad, de tipo mecánico y/o electrónico.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 46,
    nombre: 'Casa de Iluminación/Productos Eléctricos',
    descripcion: 'Comercio dedicado a la exposición y venta de componentes eléctricos del hogar e iluminación.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 47,
    nombre: 'Lavandería',
    descripcion: 'Establecimiento donde se hace recepción y/o lavado y/o limpieza y/o secado y/o planchado de ropa destinado al consumidor final.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 48,
    nombre: 'Librería',
    descripcion: 'Establecimiento dedicado a la venta de libros, papeles, insumos de oficina, tintas, sellos, cotillón, envases, envoltorios.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 49,
    nombre: 'Salón de Estética/Peluquería',
    descripcion: 'Establecimientos donde se presta a las personas servicios de corte y/o lavado y/o peinado del cabello, rasurado de la barba, manicura, aplicaciones de fomentos y masajes faciales y corporales, pedicura, cosmetología y afines (peluquerías).',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 50,
    nombre: 'Galería Comercial',
    descripcion: 'Edificio o parte de él que contiene comercios de diferente oferta comercial, propietarios y/o locatarios, ubicados en locales, quioscos o góndolas que posean vidriera o mostrador emplazados directamente sobre un paso general de circulación, con acceso común desde la vía pública.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 51,
    nombre: 'Bicicleterías',
    descripcion: 'Local destinado a la venta de bicicletas, triciclos y accesorios vinculados.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 52,
    nombre: 'Disquerías, Audio',
    descripcion: 'Local destinado a la venta de grabaciones musicales, bajo cualquier forma, incluye instrumentos musicales. Grabaciones de video.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 53,
    nombre: 'Computación',
    descripcion: 'Local destinado a la venta de insumos y componentes de la industria de la información. Equipos, papeles, accesorios, repuestos, grabaciones y programas, etc.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 54,
    nombre: 'Productos Artesanales',
    descripcion: 'Local destinado a la venta elementos elaborados bajo técnicas no industriales, sin repetición o cadena de producción. De elaboración manual o individual.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 55,
    nombre: 'Repuestos del Automotor',
    descripcion: 'Venta de repuestos para el automotor.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 56,
    nombre: 'Calesita/Carrusel',
    descripcion: 'Juego mecánico constituido por una plataforma giratoria con asientos inmóviles y móviles, de diversas formas y colores, simultáneos al movimiento de la plataforma. Incluye otros juegos electromecánicos infantiles.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 57,
    nombre: 'Juegos Electrónicos y/o Electromecánicos',
    descripcion: 'Salón de juegos de naturaleza digital y juegos de carácter electromecánico para toda edad.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 58,
    nombre: 'Comercios Mayoristas en General',
    descripcion: 'Establecimientos comerciales destinados al almacenamiento y/o exposición y/o venta al por mayor con depósitos y/o distribución de productos para atender a la demanda comercial de la cadena de distribución y/o al consumidor final. Incluye establecimientos con áreas de maniobra y equipos de abastecimiento especiales. Incluye en modo complementario venta minorista. Incluye la venta de elementos y/o productos de gran porte y/o volumen, así como elementos que por su explosividad requieren calificación especial.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 59,
    nombre: 'Corralones de Materiales',
    descripcion: 'Establecimientos dedicados a la venta de componentes y materiales de construcción, con superficie de acopio cubierta y/o descubierta, con maniobra de camiones en carga y descarga.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 60,
    nombre: 'Venta de Gas Envasado',
    descripcion: 'Establecimiento destinado a la venta de garrafas y/o combustibles gaseosos. Deberán verificar distancia mínima a cualquier establecimiento educativo de 100 metros.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 61,
    nombre: 'Venta de Combustibles/Lubricantes',
    descripcion: 'Establecimiento destinado al despacho de combustibles líquidos y aceites. Deberán verificar distancia mínima a cualquier establecimiento educativo de 100 metros.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 62,
    nombre: 'Aserraderos',
    descripcion: 'Establecimiento destinado al fraccionamiento y venta de maderas a granel.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 63,
    nombre: 'Depósitos Secos',
    descripcion: 'Local o ambiente cubierto y/o descubierto destinado al almacenamiento genérico de mercaderías sin acceso de consumidores. Puede incluir productos de diferente clasificación en el nomenclador. No incluye productos perecederos.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 64,
    nombre: 'Depósitos Húmedos y/o Fríos',
    descripcion: 'Local o ambiente cubierto (refrigerado o no) destinado al almacenamiento de alimentos perecederos. No admite el ingreso de público consumidor.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 65,
    nombre: 'Distribuidoras de Bebidas',
    descripcion: 'Establecimiento destinado al almacenamiento, distribución y venta de bebidas previamente fraccionadas con elaboración externa.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 66,
    nombre: 'Distribuidoras de Alimentos',
    descripcion: 'Establecimiento destinado al almacenamiento, distribución y venta de alimentos previamente fraccionados con elaboración externa.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 67,
    nombre: 'Papeleras',
    descripcion: 'Local destinado a la venta de envases y envoltorios comerciales.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 68,
    nombre: 'Venta de Vehículos',
    descripcion: 'Establecimiento destinado a la exhibición y venta de vehículos automotores, motocicletas, bicicletas, náutica, agrícolas o similares.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 69,
    nombre: 'Educación Secundaria',
    descripcion: 'Definición según la Ley 26.206.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 70,
    nombre: 'Educación Superior',
    descripcion: 'Definición según la Ley 26.206.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 71,
    nombre: 'Educación Especial',
    descripcion: 'Definidos en Resolución 311/16 Consejo Federal de Educación.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 72,
    nombre: 'Instituto de Investigación',
    descripcion: 'Establecimiento donde se realizan estudios de carácter científico y/o técnico con o sin laboratorio (físico, químico, biológico, etc.).',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 73,
    nombre: 'Taller Protegido de Producción y/o Terapéutico',
    descripcion: 'Entidad estatal o privada bajo dependencia de asociaciones con personería jurídica y reconocidas como de bien público, que tenga por finalidad la producción de bienes o servicios, cuya planta esté integrada por trabajadores discapacitados preparados y entrenados para el trabajo, en edad laboral, y afectados de una incapacidad tal que les dificulte obtener y conservar un empleo competitivo, conforme a lo dispuesto por la Ley Nacional N° 26.816, su reglamentación y modificatorias.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 74,
    nombre: 'Laboratorio de Análisis Clínicos',
    descripcion: 'Establecimientos que tienen por finalidad realizar análisis de muestras biológicas. Incluye también establecimientos destinados a la guarda de personas con atención médica especializada.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 75,
    nombre: 'Residencia (con internación) - Discapacidad',
    descripcion: 'Establecimiento destinado a cubrir los requerimientos de vivienda de las personas con discapacidad con suficiente y adecuado nivel de autonomía e independencia para abastecer sus necesidades básicas, o que requieran un mínimo de acompañamiento para ello.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 76,
    nombre: 'Residencia de Salud Mental',
    descripcion: 'Establecimiento de salud/salud mental, destinado a población con padecimiento mental que requiere mayor cuidado y que, debido a su autonomía limitada y/o su condición de vulnerabilidad psico-social, requiere la provisión de cuidados básicos y esenciales y diversos niveles de apoyo, en el marco de un programa de rehabilitación.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 77,
    nombre: 'Residencia para Personas Mayores',
    descripcion: 'Establecimiento privado residencial o no, que tiene como fin brindar servicios de alojamiento, alimentación, higiene, recreación y/o atención médica y psicológica no sanitaria a personas mayores de sesenta (60) años, en forma permanente o transitoria, a título oneroso o gratuito.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 78,
    nombre: 'Veterinaria',
    descripcion: 'Local destinado a la atención médica de animales domésticos. Puede tener como anexo compatible el uso de venta de accesorios y alimentos para dichos animales.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 79,
    nombre: 'Culturales',
    descripcion: 'Establecimientos destinados al fomento y goce del conocimiento y la cultura.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 80,
    nombre: 'Biblioteca',
    descripcion: 'Establecimiento dedicado al almacenamiento, consulta y difusión de libros, revistas, periódicos, discos, grabaciones, etc.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 81,
    nombre: 'Museo',
    descripcion: 'Establecimiento donde se coleccionan y exhiben al público elementos históricos, de arte, técnica o ciencia. Constituyendo o no el edificio en sí un bien del patrimonio artístico o histórico.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 82,
    nombre: 'Cine, Teatro',
    descripcion: 'Establecimiento cerrado donde se proyectan películas y/o se practican obras teatrales. Lugar de reuniones caracterizado por poseer un espacio que puede albergar espectadores que observan la función desarrollada en un escenario, tarima, podio, plataforma o elemento similar.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 83,
    nombre: 'Centro de Exposiciones, Galería de Arte',
    descripcion: 'Espacio para la exhibición y promoción del arte, en especial del arte visual, y principalmente pintura y escultura, de forma similar a un museo, caracterizado por la alternancia de las obras expuestas en el tiempo.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 84,
    nombre: 'Salón de Conferencias',
    descripcion: 'Local donde pueden llevarse a cabo conferencias científicas, empresariales, etc. De morfología y funcionamiento análogo al cine o teatro.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 85,
    nombre: 'Autocine',
    descripcion: 'Explanada donde se ubican automóviles cuyos ocupantes asisten a la proyección de películas.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 86,
    nombre: 'Acuario',
    descripcion: 'Espacio abierto o cubierto donde se exhiben ambientes subacuáticos de agua dulce, marina o salobre con fines educativos y de conservación.',
    ordenanzas: ["123123/23","123123/98","4332/23", "3324/45"],
    links: ["www.google.com.ar","google.com.ar","www.google.com","google.com"],
    requisitos: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."]
  },
  {
    id: 87,
    nombre: 'Religiosos',
    descripcion: 'Establecimientos destinados a la organización de personas con el propósito de adoración, estudio y difusión teológica. Reuniones de carácter reflexivo, de estímulo espiritual.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 88,
    nombre: 'Social, Recreativo y/o Deportivo',
    descripcion: 'Equipamientos destinados al encuentro social y/o deportivo, así como a la práctica, enseñanza o exhibición de deportes con o sin asistencia de espectadores. Incluye clubes, sociedades de fomento, agrupaciones tradicionalistas, así como asociaciones y centros recreativos de entidades públicas y privadas, gimnasios, piscinas y canchas de tenis, paddle, básquet, vóley.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 89,
    nombre: 'Club de Barrio',
    descripcion: 'Establecimiento de alcance y complejidad barrial destinado al encuentro social, deportivo y lúdico.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 90,
    nombre: 'Peña',
    descripcion: 'Espacio mixto, socio-cultural y comercial, donde se desarrollan actividades artísticas y/o lúdicas como canto, narración oral, pintura, telar, plástica, aprendizaje y práctica de danzas típicas argentinas expresadas por artistas propios o concurrentes, teatro criollo, títeres, donde se elaboran y/o expenden comidas y bebidas típicas regionales del país.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 91,
    nombre: 'Circuitos Deportivos, Canchas de Práctica y Ejercicio',
    descripcion: 'Establecimientos de carácter deportivo con extensas superficies descubiertas destinadas a pistas de competición y/o prácticas para destinos varios, atletismo, golf, motociclismo, etc.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 92,
    nombre: 'Natatorio',
    descripcion: 'Establecimiento cubierto o descubierto equipado con natatorio para la práctica de la natación.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 93,
    nombre: 'Gimnasio',
    descripcion: 'Establecimiento cerrado para la práctica de ejercicios y/o disciplinas varias, gimnasia, artes marciales, esgrima, o similares.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 94,
    nombre: 'Estadio Deportivo Cubierto',
    descripcion: 'Salón cubierto para la práctica de deportes con o sin cancha, con o sin gradas.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 95,
    nombre: 'Parque Termal',
    descripcion: 'Establecimiento con instalaciones cubiertas y descubiertas con piscinas de variada temperatura de origen termal, con instalaciones complementarias de servicios, salas de masajes, talleres, etc. Puede incluir terapias en base a aguas marinas.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 96,
    nombre: 'Ecoparque',
    descripcion: 'Establecimiento con instalaciones cubiertas y descubiertas provistas de atracciones naturales, jaulas y cercos para animales, jardines botánicos, lagunas artificiales, salas complementarias de cuidados y talleres, etc.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 97,
    nombre: 'Parque Temático',
    descripcion: 'Establecimiento con instalaciones cubiertas y descubiertas provistas de atracciones mecánicas y electromecánicas de carácter lúdico, con focalización temática en esa oferta de servicios.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 98,
    nombre: 'Parque Acuático',
    descripcion: 'Establecimiento con instalaciones cubiertas y descubiertas afectadas a actividades náuticas de baja escala, baños y juegos en base a agua.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 99,
    nombre: 'Servicios Administrativos',
    descripcion: 'Comprende sedes de administración pública, organismos y/o entidades públicas o privadas destinadas a la prestación de servicios públicos, bancarios o financieros, compañías de seguros, agencias de cambio, etc., así como oficinas en general, estudios profesionales, agencias de viajes y turismo, inmobiliarias, etc.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 100,
    nombre: 'Oficina Pública con o sin Acceso de Público',
    descripcion: 'Local o edificio de la administración pública nacional, provincial, municipal, incluyendo entidades descentralizadas, empresas o sociedades del Estado, en el cual se efectúan tareas técnicas administrativas, productivas o científicas. Suponen afluencia de público. Incluye depósito y corralones dependientes de la administración pública.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 101,
    nombre: 'Justicia',
    descripcion: 'Establecimientos afectados a Fiscalías, juzgados, tribunales y demás dependencias dependientes del poder judicial de cualquier jurisdicción.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 102,
    nombre: 'Inmobiliaria',
    descripcion: 'Local destinado a la oferta de alquiler o venta de inmuebles.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 103,
    nombre: 'Oficina Consultora',
    descripcion: 'Uno o más locales en los cuales se desarrolla un servicio profesional prestado por empresas o profesionales en forma individual con experiencia o conocimiento específico en un área, asesorando personas, empresas, grupos de empresas, países u organizaciones en general.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 104,
    nombre: 'Estudio Profesional',
    descripcion: 'Establecimiento donde se desarrolla la actividad profesional correspondiente.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 105,
    nombre: 'Oficina Postal, Cobro de Impuestos y Servicios',
    descripcion: 'Establecimientos postales y/o autorizados para el cobro de impuestos o servicios.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 106,
    nombre: 'Oficina Comercial de Servicios',
    descripcion: 'Establecimientos que administran servicios públicos. Incluyen áreas de atención al público consumidor usuario, así como a los galpones destinados al equipamiento y servicio.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 107,
    nombre: 'Agencia de Información y Noticias',
    descripcion: 'Local donde se recogen noticias y se transmiten a la central desde donde, después de tratarla, se envía (radio, diario, revista, etc.)',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 108,
    nombre: 'Agencias Comerciales y Turismo',
    descripcion: 'Local donde se desarrolla una actividad comercial delegada a un intermediario. El local no incluye depósito ni expende mercaderías.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 109,
    nombre: 'Bancos y/o Entidades Financieras',
    descripcion: 'Instituciones de crédito autorizadas por el BCRA.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 110,
    nombre: 'Estudio de Radio y Telefonía',
    descripcion: 'Establecimientos mediáticos dedicados a la difusión de contenidos radiales. Puede incluir antenas de bajo porte.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 111,
    nombre: 'Gastronómicos',
    descripcion: 'Establecimientos dedicados a la actividad gastronómica y de refrigerios en general. Incluye a los establecimientos y categoría definidos en el Decreto 6838/1974.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 112,
    nombre: 'Restaurante',
    descripcion: 'Establecimientos destinados al servicio de platos fríos o calientes en salón comedor propio, elaborados de variada composición, en una cocina ubicada en el mismo lugar, en sus diferentes variantes y menús: Restaurantes, parrillas, Múnich, pizzerías, pescados, pastas, hamburgueserías, etc.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 113,
    nombre: 'Panchería/Hamburguesería',
    descripcion: 'Establecimientos dedicados al servicio de un plato único o de un menú muy acotado, para servicio en salón propio y/o al paso.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 114,
    nombre: 'Cafetería/Bar',
    descripcion: 'Establecimiento donde se sirven aperitivos y comidas, generalmente platos combinados, pero no menús o cartas. Una cafetería comparte algunas características con un bar y otras con un restaurante. Principalmente se caracteriza por realizar el servicio en barra, y las posibilidades de consumir alimento son básicas. El servicio es rápido. Incluye expendio de bebidas alcohólicas para consumo en el lugar.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 115,
    nombre: 'Café-Concert',
    descripcion: 'Local donde además de una consumición (bebida y comida) el público presencia espectáculos musicales, teatrales o mixtos.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 116,
    nombre: 'Discoteca',
    descripcion: 'Local público por el cual, a cambio de un pago de acceso, con horario regularmente nocturno, se escucha música grabada o en vivo, baila y/o se interactúa con otras personas y se consumen bebidas.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 117,
    nombre: 'Salón de Fiesta o Diversión',
    descripcion: 'Establecimiento destinado a la realización de eventos, recreación, cumpleaños, casamientos, ocio, relación social y actividades asociadas con asistencia de espectadores, donde en general no se cobra un derecho de acceso y el evento resulta programado con anticipación y sin regularidad horaria y/o diaria.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 118,
    nombre: 'Fúnebres',
    descripcion: 'Comprende establecimientos destinados al funcionamiento de servicios funerarios, casas velatorias y actividades relacionadas.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 119,
    nombre: 'Seguridad',
    descripcion: 'Comprende actividades destinadas a la defensa y seguridad del Estado y protección a ciudadanos y bienes. Incluye comisarías, destacamentos y otras dependencias policiales, cuarteles de bomberos o defensa civil.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 120,
    nombre: 'Servicios del Automotor y Náutica',
    descripcion: 'Comprende actividades destinadas al mantenimiento, reparación y atención del parque automotor y náutico público y privado, incluyendo talleres mecánicos y lavaderos.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 121,
    nombre: 'Gomería',
    descripcion: 'Local donde se realizan reparaciones sencillas, básicamente de neumáticos, donde los vehículos no quedan en depósito en el lugar.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 122,
    nombre: 'Taller de Chapa y Pinturas',
    descripcion: 'Establecimientos afectados a las tareas de reparación de carrocerías y repintado.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 124,
    nombre: 'Taller de Mecánica',
    descripcion: 'Establecimiento dedicado a la reparación de la mecánica automotor.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 125,
    nombre: 'Lavadero Automático o Semiautomático de Automóviles',
    descripcion: 'Establecimientos dedicados al lavado y/o aspirado de carrocería e interiores.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 126,
    nombre: 'Garaje',
    descripcion: 'Edificio o parte de él destinado a la guarda de vehículos automotores.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 127,
    nombre: 'Playa de Estacionamiento',
    descripcion: 'Parcela urbana o parte de ella afectada a la guarda de vehículos automotores.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 128,
    nombre: 'Estación de Servicio',
    descripcion: 'Establecimiento donde se expenden combustibles (nafta, gasoil, GNC) y aditivos para el automotor mediante surtidos emplazados en playa de maniobra. Deberán verificar distancia mínima a cualquier establecimiento educativo de 100 ms.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 129,
    nombre: 'Transporte',
    descripcion: 'Establecimientos afectados al transporte público de personas y/o mercaderías. Comprende playas de maniobra, estacionamientos, atención y depósito, salas de espera y embarque.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 130,
    nombre: 'Expreso de Carga Liviana (Taxi Flet)',
    descripcion: 'Local donde se prestan servicios de transporte de carga liviana, que incluye paquetería y encomienda.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 131,
    nombre: 'Expreso de Cargas Generales',
    descripcion: 'Servicio afectado al transporte de productos de gran porte, por lo general interjurisdiccional, con depósito.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 132,
    nombre: 'Agencia de Taxi y/o Remise',
    descripcion: 'Local destinado a la atención al público y recepción de pedidos de servicios referidos al transporte de personas a pedido con destino no preestablecido.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 133,
    nombre: 'Salida de Excursiones',
    descripcion: 'Actividad referida al transporte con destino específico pre pautado de carácter turístico.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 134,
    nombre: 'Terminal de Ómnibus',
    descripcion: 'Establecimientos afectados al transporte de personas dentro y fuera de la jurisdicción. Serán de corta, media y/o larga distancia.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 135,
    nombre: 'Centro de Concentración Logística',
    descripcion: 'Predios donde se brinden servicios de alquiler y uso de espacios para carga, descarga, distribución, redistribución y almacenamiento de mercadería transportada.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 136,
    nombre: 'Terminal Aeropuaria',
    descripcion: 'Establecimiento afectado al transporte de personas y/o mercadería en modo aéreo. Incluye pistas, hangares, estacionamiento, salones y depósitos.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 137,
    nombre: 'Infraestructuras',
    descripcion: 'Comprende instalaciones relacionadas a sistemas, producción, almacenamiento, tratamiento o distribución de fluidos y energía, de comunicación y de tratamiento de residuos.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 138,
    nombre: 'Planta de Tratamiento de RSU',
    descripcion: 'Establecimientos afectados a procesos relacionados con la gestión de residuos sólidos urbanos (RSU), clasificación, almacenamiento y transporte posterior a sitio de disposición final y/o de recuperación y reconversión.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 139,
    nombre: 'Punto Limpio',
    descripcion: 'Establecimiento para el acopio temporal de residuos de la poda y/o el movimiento de suelos previo posterior tratamiento y/o destino final.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 140,
    nombre: 'Planta de Tratamiento de Efluentes Cloacales',
    descripcion: 'Establecimiento para el final y saneamiento de efluentes cloacales para su vuelco final posterior.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 141,
    nombre: 'Planta Productora y Transmisora de Radio y TV',
    descripcion: 'Establecimiento productor de contenidos con instalación de antenas, estudios, depósitos y oficinas comerciales.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 142,
    nombre: 'Establecimientos Ictícolas',
    descripcion: 'Cría y procesamiento de pescados de agua dulce.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 143,
    nombre: 'Huertas',
    descripcion: 'Siembra y cosecha de verduras, legumbres y hortalizas, así como frutales.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 144,
    nombre: 'Establecimientos Apícolas',
    descripcion: 'Cosecha, tratamiento y fraccionamiento de miel.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 145,
    nombre: 'Granjas Avícolas y/o Cunícolas',
    descripcion: 'Cría y faena de aves de corral.',
    ordenanzas: [],
    links: [],
    requisitos: []
  },
  {
    id: 146,
    nombre: 'Hotelería',
    descripcion: 'Lorem ipsum dolor et...',
    ordenanzas: [],
    links: [],
    requisitos: []
  }
  ];
  
  export default rubros;