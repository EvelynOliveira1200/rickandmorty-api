"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Home.module.css";
import CharacterCard from "../../components/CharacterCard";
import Loader from "../../components/Loader";

export default function Home() {
    const [search, setSearch] = useState("");
    const [characters, setCharacters] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const cacheRef = useRef(new Map());
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCharacters = async (name = "", pageNumber = 1) => {
        setLoading(true);
        const cache = cacheRef.current;
        const cacheKey = `${name}_${pageNumber}`;
        const nextPageNumber = pageNumber + 1;
        const nextCacheKey = `${name}_${nextPageNumber}`;

        const cleanCacheIfNeeded = () => {
            while (cache.size >= 5) {
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
                console.log(`🗑️ Cache limpo: A chave "${firstKey}" foi removida para liberar espaço.`);
            }
        };

        console.log("\n============== INÍCIO DA BUSCA ==============");
        console.log(`📊 Estado atual do cache: ${cache.size} páginas armazenadas.`);

        let total = totalPages;

        if (cache.has(cacheKey)) {
            const cached = cache.get(cacheKey);
            setCharacters(cached.results);
            setTotalPages(cached.totalPages);
            total = cached.totalPages;
            setNotFound(false);
            setLoading(false);
            console.log(`✅ Dados carregados do cache para a chave: "${cacheKey}".`);
        } else {
            try {
                const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${name}`);
                cleanCacheIfNeeded();
                cache.set(cacheKey, {
                    results: data.results,
                    totalPages: data.info.pages,
                });
                setCharacters(data.results);
                setTotalPages(data.info.pages);
                total = data.info.pages;
                setNotFound(false);
                console.log(`🌐 Dados buscados da API e armazenados no cache com a chave: "${cacheKey}".`);
            } catch {
                setNotFound(true);
                setCharacters([]);
                console.log(`❌ Erro ao buscar dados da API para a chave: "${cacheKey}".`);
            } finally {
                setLoading(false);
            }
        }

        if (nextPageNumber <= total && !cache.has(nextCacheKey)) {
            try {
                const res = await axios.get(`https://rickandmortyapi.com/api/character/?page=${nextPageNumber}&name=${name}`);
                cleanCacheIfNeeded();
                cache.set(nextCacheKey, {
                    results: res.data.results,
                    totalPages: res.data.info.pages,
                });
                console.log(`🔄 Prefetch realizado com sucesso para a próxima página: "${nextCacheKey}".`);
            } catch (err) {
                console.log(`❌ Falha no prefetch para a chave: "${nextCacheKey}". Erro:`, err);
            }
        } else {
            console.log("ℹ️ Prefetch ignorado: Dados já estão no cache ou o número da página está fora do limite permitido.");
        }

        console.log(`📦 Cache atualizado. Chave atual: "${cacheKey}".`);
        for (const [key, val] of cache.entries()) {
            console.log(`📄 Chave: "${key}" contém ${val.results.length} personagens.`);
        }
        console.log("============== FIM DA BUSCA ==============\n");
    };

    useEffect(() => {
        fetchCharacters("", 1);
    }, []);

    useEffect(() => {
        fetchCharacters(search, page);
    }, [page]);

    const handleCardClick = (name) => {
        toast.info(`Você clicou no personagem: ${name}`, {});
    };

    const handleButtonClick = (message) => {
        toast.info(message, {
            position: "top-right"
        });
    };

    return (
        <div className={styles.container}>
            <ToastContainer position="top-right" autoClose={7500} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
            <h1 className={styles.title}>Personagens | Rick and Morty 🧪</h1>

            <div className={styles.controls}>
                <div className={styles.search}>
                    <input
                        className={styles.searchbar}
                        type="text"
                        placeholder="Pesquise por um personagem"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        className={styles.buttonSearch}
                        onClick={() => {
                            handleButtonClick("Você pesquisou por: " + search);
                            setPage(1);
                            fetchCharacters(search.trim(), 1);
                        }}
                    >
                        Buscar
                    </button>
                    <button
                        className={styles.buttonReset}
                        onClick={() => {
                            setSearch("");
                            setPage(1);
                            handleButtonClick("Você resetou o filtro");
                            fetchCharacters("", 1);
                        }}
                    >
                        Resetar
                    </button>
                </div>

                <div className={styles.navControls}>
                    <button onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1 || notFound}
                        className={styles.buttonNav}>
                        Página Anterior
                    </button>

                    <span className={styles.pageIndicator}>
                        Página {page} de {totalPages}
                    </span>

                    <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages || notFound}
                        className={styles.buttonNav}>
                        Próxima Página
                    </button>
                </div>
            </div>

            {notFound && (
                <h1 className={styles.notFound}>Nenhum personagem identificado. Tente novamente.</h1>
            )}

            {loading && (
                <div className={`${styles.loaderWrapper} ${loading ? "" : styles.hidden}`}>
                    <Loader />
                </div>
            )}

            {!loading && (
                <div className={styles.grid}>
                    {characters.map((character) => (
                        <CharacterCard key={character.id} character={character} onClick={() => handleCardClick(character.name)} />
                    ))}
                </div>
            )}
        </div>
    );
}
