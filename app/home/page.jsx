"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import CharacterCard from "../../components/CharacterCard"
import styles from "./Home.module.css"

export default function Home() {
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        axios.get("https://rickandmortyapi.com/api/character/")
            .then((response) => {
                setCharacters(response.data.results);
            })
            .catch((error) => {
                console.log("Erro ao buscar os personagens: ", error);
            })
    },
        []);

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {characters.map((characters => <CharacterCard key={characters.id} characters={characters} />))}
            </div>
        </div>
    )
}