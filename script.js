const URL = "./model/";

let model;

const imageUpload = document.getElementById("imageUpload");
const preview = document.getElementById("preview");
const predictButton = document.getElementById("predictButton");
const resultado = document.getElementById("resultado");

async function cargarModelo() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    resultado.innerText = "Cargando modelo...";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        resultado.innerText = "Modelo cargado. Sube una imagen.";
    } catch (error) {
        console.error(error);
        resultado.innerText = "Error al cargar el modelo.";
    }
}

imageUpload.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
        resultado.innerText = "Imagen lista para analizar.";
    };

    reader.readAsDataURL(file);
});

predictButton.addEventListener("click", async function () {
    if (!model) {
        resultado.innerText = "El modelo todavía no está cargado.";
        return;
    }

    if (!preview.src) {
        resultado.innerText = "Primero selecciona una imagen.";
        return;
    }

    try {
        // Mostrar estado de carga
        predictButton.disabled = true;
        predictButton.innerText = "Analizando...";
        resultado.innerHTML = "Analizando imagen, espera un momento...";

        // Darle tiempo al navegador para actualizar la interfaz
        await new Promise(resolve => setTimeout(resolve, 100));

        const prediction = await model.predict(preview);

        prediction.sort((a, b) => b.probability - a.probability);

        const mejorResultado = prediction[0];
        const porcentaje = (mejorResultado.probability * 100).toFixed(2);

        resultado.innerHTML = `
            Resultado: <strong>${mejorResultado.className}</strong>
            <br>
            Confianza: <strong>${porcentaje}%</strong>
        `;

        console.log(prediction);

    } catch (error) {
        console.error(error);
        resultado.innerText = "Ocurrió un error al analizar la imagen.";
    } finally {
        predictButton.disabled = false;
        predictButton.innerText = "Analizar imagen";
    }
});

cargarModelo();