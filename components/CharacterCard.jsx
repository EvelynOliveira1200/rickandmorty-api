import styles from "/styles/CharacterCard.module.css"
import Image from "next/image";

export default function CharacterCard({ character, onClick }) {
    return (
        <div className={styles.card} onClick={onClick}>
            <Image
                src={character.image}
                alt={character.name}
                className={styles.img}
                width={300}
                height={300}
            />

            <div className={styles.info}>
                <h1 className={styles.title}>{character.name}</h1>
                <p className={styles.text}><span className={styles.span}> Status: </span>{character.status}</p>
                <p className={styles.text}><span className={styles.span}> Espécie: </span> {character.species}</p>
                <p className={styles.text}><span className={styles.span}> Tipo: </span>{character.type || "Sem Tipo"}</p>
                <p className={styles.text}><span className={styles.span}>Genêro: </span>{character.gender}</p>
            </div>

        </div>
    )
}