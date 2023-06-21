// Definir la clase Nodo del árbol de Huffman
class Nodo {
  constructor(caracter, frecuencia) {
    this.caracter = caracter;
    this.frecuencia = frecuencia;
    this.izquierda = null;
    this.derecha = null;
  }
}

// Función para construir el árbol de Huffman
function construirArbol(texto) {
  // Calcular la frecuencia de cada caracter en el texto
  const frecuencias = {};
  for (let i = 0; i < texto.length; i++) {
    const caracter = texto[i];
    if (frecuencias[caracter]) {
      frecuencias[caracter]++;
    } else {
      frecuencias[caracter] = 1;
    }
  }

  // Crear los nodos iniciales para cada caracter
  const nodos = Object.keys(frecuencias).map((caracter) => new Nodo(caracter, frecuencias[caracter]));

  while (nodos.length > 1) {
    // Ordenar los nodos por frecuencia ascendente
    nodos.sort((a, b) => a.frecuencia - b.frecuencia);

    // Tomar los dos nodos con menor frecuencia
    const nodoIzquierdo = nodos.shift();
    const nodoDerecho = nodos.shift();

    // Crear un nuevo nodo padre con la suma de las frecuencias
    const nuevoNodo = new Nodo(null, nodoIzquierdo.frecuencia + nodoDerecho.frecuencia);
    nuevoNodo.izquierda = nodoIzquierdo;
    nuevoNodo.derecha = nodoDerecho;

    // Agregar el nuevo nodo al arreglo de nodos
    nodos.push(nuevoNodo);
  }

  // Devolver el nodo raíz del árbol de Huffman
  return nodos[0];
}

// Función para generar los códigos de Huffman recursivamente
function generarCodigos(nodo, codigoActual, codigos) {
  if (nodo.caracter) {
    // El nodo es una hoja, almacenar el código
    codigos[nodo.caracter] = codigoActual;
  } else {
    // El nodo es interno, seguir recursivamente por la izquierda y derecha
    generarCodigos(nodo.izquierda, codigoActual + "0", codigos);
    generarCodigos(nodo.derecha, codigoActual + "1", codigos);
  }
}

// Función para imprimir el árbol de Huffman
function imprimirArbolHuffman(nodo, prefijo = "", esUltimo = true) {
  const rama = esUltimo ? "└── " : "├── ";
  console.log(prefijo + rama + (nodo.caracter ? nodo.caracter : ""));

  if (nodo.izquierda) {
    const nuevaPrefijo = prefijo + (esUltimo ? "    " : "│   ");
    imprimirArbolHuffman(nodo.izquierda, nuevaPrefijo, !nodo.derecha);
  }

  if (nodo.derecha) {
    const nuevaPrefijo = prefijo + (esUltimo ? "    " : "│   ");
    imprimirArbolHuffman(nodo.derecha, nuevaPrefijo, true);
  }
}

// Función para decodificar el texto codificado de Huffman
function decodificarHuffman(codigo, codigos) {
  let textoDecodificado = "";
  let codigoActual = "";
  for (let i = 0; i < codigo.length; i++) {
    codigoActual += codigo[i];
    for (let caracter in codigos) {
      if (codigos[caracter] === codigoActual) {
        textoDecodificado += caracter;
        codigoActual = "";
        break;
      }
    }
  }
  return textoDecodificado;
}

// Función principal para codificar el texto usando Huffman
function codificarHuffman(texto) {
  // Construir el árbol de Huffman
  const arbol = construirArbol(texto);

  // Generar los códigos de Huffman
  const codigos = {};
  generarCodigos(arbol, "", codigos);

  // Codificar el texto usando los códigos de Huffman
  let codigo = "";
  for (let i = 0; i < texto.length; i++) {
    const caracter = texto[i];
    codigo += codigos[caracter];
  }

  // Imprimir el árbol de Huffman
  console.log("Árbol de Huffman:");
  imprimirArbolHuffman(arbol);

  // Calcular la tasa de compresión
  const tamaño_original = texto.length;
  const tamaño_codificado = codigo.length;
  const tasa_compresion = (1 - tamaño_codificado / tamaño_original) * 100;

  // Devolver el texto codificado, los códigos de Huffman y la tasa de compresión
  return { codigo, codigos, tasa_compresion };
}

// Función para descargar un archivo en el navegador
function descargarArchivo(nombreArchivo, contenido) {
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(new Blob([contenido], { type: "text/plain" }));
  enlace.download = nombreArchivo;
  enlace.click();
}

const fileInput = document.getElementById('file');
const file2Input = document.getElementById('file2');
let codigos; // Variable global para almacenar los códigos de Huffman

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const fileReader = new FileReader();
  fileReader.addEventListener('load', (e) => {
    const texto = e.target.result;
    const resultado = codificarHuffman(texto);
    console.log("Texto original:", texto);
    console.log("Texto codificado:", resultado.codigo);
    console.log("Códigos de Huffman:", resultado.codigos);
    console.log("Tasa de compresión:", resultado.tasa_compresion.toFixed(2) + "%");
    codigos = resultado.codigos; // Almacenar los códigos de Huffman en una variable global
    descargarArchivo("archivo_codificado.txt", resultado.codigo);
  });
  fileReader.readAsText(file);
});

file2Input.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const fileReader = new FileReader();
  fileReader.addEventListener('load', (e) => {
    const textoCodificado = e.target.result;
    const resultado = decodificarHuffman(textoCodificado, codigos); // Usar los códigos de Huffman almacenados
    descargarArchivo("archivo_decodificado.txt", resultado);
  });
  fileReader.readAsText(file);
});
