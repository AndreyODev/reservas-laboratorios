const API = "http://127.0.0.1:8000/api/reservas";
const $ = (id) => document.getElementById(id);
let cache = [];
function dados() {
	return {
		laboratorio: $("laboratorio").value,
		responsavel: $("responsavel").value,
		data: $("data").value,
		turno: $("turno").value,
		finalidade: $("finalidade").value,
		status: $("status").value,
	};
}
function mensagem(t, ok = true) {
	$("msg").textContent = t;
	$("msg").style.color = ok ? "#16803a" : "#c23321";
}
async function listar() {
	const q = new URLSearchParams();
	if ($("fstatus").value) q.set("status", $("fstatus").value);
	if ($("busca").value) q.set("laboratorio", $("busca").value);
	const r = await fetch(`${API}?${q}`);
	cache = await r.json();
	$("lista").innerHTML = cache
		.map(
			(x) =>
				`<tr><td>${x.laboratorio}</td><td>${x.data}</td><td>${x.turno}</td><td>${x.responsavel}</td><td>${x.status}</td><td><button onclick="editar(${x.id})">Editar</button> <button onclick="excluir(${x.id})">Excluir</button></td></tr>`,
		)
		.join("");
}
window.editar = (id) => {
	const x = cache.find((r) => r.id === id);
	for (const k of ["id", "laboratorio", "responsavel", "data", "turno", "finalidade", "status"]) $(k).value = x[k];
	window.scrollTo(0, 0);
};
window.excluir = async (id) => {
	const r = await fetch(`${API}/${id}`, { method: "DELETE" });
	mensagem(r.status === 204 ? "Reserva excluída." : "Falha ao excluir.", r.status === 204);
	listar();
};
$("form").addEventListener("submit", async (e) => {
	e.preventDefault();
	const id = $("id").value;
	const r = await fetch(id ? `${API}/${id}` : API, {
		method: id ? "PUT" : "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(dados()),
	});
	if (!r.ok) {
		const er = await r.json();
		mensagem(`${r.status}: ${JSON.stringify(er.detail)}`, false);
		return;
	}
	mensagem(id ? "Reserva atualizada." : "Reserva criada.");
	e.target.reset();
	$("id").value = "";
	listar();
});
$("cancelar").onclick = () => {
	$("form").reset();
	$("id").value = "";
};
$("filtrar").onclick = listar;
listar();
