//Importa os frameworks, bibliotecas, etc, necessários
const express = require("express");
const app = express();

const routes = require("./routes");
const port = 12345;

//Informa qual biblioteca usar para o parsing do conteúdo
//True = qs (suporta nested objects)
//False = querystring
app.use(express.urlencoded({ extended: false }));
//Parser para json
app.use(express.json());

app.use(routes);

app.listen(port, () => {
	console.log("API rodando na porta " + port);
});
