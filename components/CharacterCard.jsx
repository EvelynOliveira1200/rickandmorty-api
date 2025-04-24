import styles from "/styles/CharacterCard.module.css"

export default function CharacterCard({ characters, onClick }) {
    return (
        <div className={styles.card} onClick={onClick}>
            <img
                src={characters.image}
                alt={characters.name}
                className={styles.img} />

            <div className={styles.info}>
                <h1 className={styles.title}>{characters.name}</h1>
                <p className={styles.text}><span className={styles.span}> Status: </span>{characters.status}</p>
                <p className={styles.text}><span className={styles.span}> Espécie: </span> {characters.species}</p>
                <p className={styles.text}><span className={styles.span}> Tipo: </span>{characters.type || "Sem Tipo"}</p>
                <p className={styles.text}><span className={styles.span}>Genêro: </span>{characters.gender}</p>
            </div>

        </div>
    )
}