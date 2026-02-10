"use client";

import { useEffect, useState } from "react";

type Product = {
	id: number;
	name: string;
	description: string;
	price: number;
};

export default function ProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editName, setEditName] = useState("");
	const [editDescription, setEditDescription] = useState("");
	const [editPrice, setEditPrice] = useState("");

	// Form state
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");

	async function loadProducts() {
		setLoading(true);
		const res = await fetch("/api/products");
		const data = await res.json();
		setProducts(data);
		setLoading(false);
	}

	useEffect(() => {
		loadProducts();
	}, []);

	async function handleCreate(e: React.FormEvent) {
		e.preventDefault();

		const res = await fetch("/api/products", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name,
				description,
				price: Number(price),
			}),
		});

		if (!res.ok) {
			const err = await res.json();
			alert(err?.error ?? "Error creando producto");
			return;
		}

		// Limpia el form
		setName("");
		setDescription("");
		setPrice("");

		// Recarga lista
		await loadProducts();
	}

	return (
		<main style={{ padding: 24 }}>
			<h1>Productos</h1>

			<form onSubmit={handleCreate} style={{ marginBottom: 16 }}>
				<div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
					<input
						placeholder="Nombre"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<input
						placeholder="Descripción"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<input
						placeholder="Precio"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
					/>
					<button type="submit">Crear</button>
				</div>
				<small>
					Tip: escribe el precio como número, por ejemplo: <b>599.99</b>
				</small>
			</form>

			{loading ? (
				<p>Cargando...</p>
			) : (
				<ul>
					{products.map((p) => (
						<li key={p.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
							{editingId === p.id ? (
								<>
									<input
										value={editName}
										onChange={(e) => setEditName(e.target.value)}
										placeholder="Nombre"
									/>
									<input
										value={editDescription}
										onChange={(e) => setEditDescription(e.target.value)}
										placeholder="Descripción"
									/>
									<input
										value={editPrice}
										onChange={(e) => setEditPrice(e.target.value)}
										placeholder="Precio"
									/>

									<button
										onClick={async () => {
											const res = await fetch(`/api/products/${p.id}`, {
												method: "PUT",
												headers: { "Content-Type": "application/json" },
												body: JSON.stringify({
													name: editName,
													description: editDescription,
													price: Number(editPrice),
												}),
											});

											if (!res.ok) {
												const err = await res.json();
												alert(err?.error ?? "Error actualizando producto");
												return;
											}

											setEditingId(null);
											await loadProducts();
										}}
									>
										Guardar
									</button>

									<button
										onClick={() => {
											setEditingId(null);
										}}
									>
										Cancelar
									</button>
								</>
							) : (
								<>
									<span>
										<b>{p.name}</b> — {p.description} — ${p.price}
									</span>

									<button
										onClick={() => {
											setEditingId(p.id);
											setEditName(p.name);
											setEditDescription(p.description);
											setEditPrice(String(p.price));
										}}
									>
										Editar
									</button>

									<button
										onClick={async () => {
											const ok = confirm(`¿Seguro que quieres borrar: ${p.name}?`);
											if (!ok) return;

											const res = await fetch(`/api/products/${p.id}`, {
												method: "DELETE",
											});

											if (!res.ok) {
												const err = await res.json();
												alert(err?.error ?? "Error borrando producto");
												return;
											}

											await loadProducts();
										}}
									>
										Borrar
									</button>
								</>
							)}
						</li>
					))}
				</ul>
			)}
		</main>
	);
}
