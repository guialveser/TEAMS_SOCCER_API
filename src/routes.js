const express = require("express");
const routes = express.Router();
const DB = require("./teams");

routes.get("/teams", (req, res) => {
	res.status(200).json(DB.teams);
});

routes.get("/team/:nome", (req, res) => {
	const nome = req.params.nome;
	const team = DB.teams.find((c) => c.nome == nome);
	if (team != undefined) {
		res.status(200).json(team);
	} else {
		res.status(404).json({ msg: "Time não existe." });
	}
});

routes.post("/newTeam", (req, res) => {
	const {
		nome,
		cidade,
		serie,
		titulos,
		folhaPagamento
	} = req.body;

	var seriePermitida = permissaoSerie(serie);
	if(!seriePermitida){
		res.status(200).json({ msg: "Série não permitida."})
		return;
	}

	if (nome && cidade && titulos && folhaPagamento != undefined) {
		const id = DB.teams.length + 1;
		DB.teams.push({
			id,
			nome,
			cidade,
			serie,
			titulos,
			folhaPagamento
		});
		res.status(200).json({ msg: "Time adicionado." });
	} else {
		res.status(400).json({ msg: "Dados obrigatórios incompletos." });
	}
});

routes.delete("/team/:id", (req, res) => {
	if (isNaN(req.params.id)) {
		res.sendStatus(400);
	} else {
		const id = parseInt(req.params.id);
		const index = DB.teams.findIndex((c) => c.id == id);
		if (index == -1) {
			res.status(404).json({ msg: "Time não existe." });
		} else {
			DB.teams.splice(index, 1);
			res.status(200).json({ msg: "Time excluído." });
		}
	}
});

routes.put("/team/:id", (req, res) => {
	if (isNaN(req.params.id)) {
		res.sendStatus(400);
	} else {
		const id = parseInt(req.params.id);
		const team = DB.teams.find((c) => c.id == id);
		if (team != undefined) {
			const {
				nome,
				cidade,
				serie,
				titulos,
				folhaPagamento,
			} = req.body;

			if(serie != undefined) {
				var seriePermitida = permissaoSerie(serie);
				if(!seriePermitida){
					res.status(200).json({ msg: "Série não permitida."})
					return;
				}
			}

			if (nome != undefined) team.nome = nome;
			if (cidade != undefined) team.cidade = cidade;
			if (serie != undefined) team.serie = serie;
			if (titulos != undefined) team.titulos = titulos;
			if (folhaPagamento != undefined) team.folhaPagamento = folhaPagamento;
			res.status(200).json(team);
		} else {
			res.status(404).json({ msg: "Time não existe." });
		}
	}
});

//VALIDADOR

function permissaoSerie(serie){
	var seriePermitida = false;
	if(serie != undefined){
		if(serie.toLowerCase() == "a") {
			seriePermitida = true;
		}
		if(serie.toLowerCase() == "b") {
			seriePermitida = true;
		}
		if(serie.toLowerCase() == "c") {
			seriePermitida = true;
		}
	} else {
		seriePermitida = true;
	}
	return seriePermitida;
}

module.exports = routes;
