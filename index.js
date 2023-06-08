let sql = require("sqlite3");
let db_path = "./xxtestxx.db";
let db = new sql.Database(db_path, sql.OPEN_READWRITE, (err) => {
    if (!err) return;
    if (err.code == "SQLITE_CANTOPEN") {
        createDatabase()
        return;
    }
    console.log("SQLITE3: Error opening database -- " + err);
    exit(1);
});
db.all(`select hero_name, is_xman, was_snapped from hero h
   inner join hero_power hp on h.hero_id = hp.hero_id
   where hero_power = ?`, "Total Nerd", (err, rows) => {
       rows.forEach(row => {
           console.log(row.hero_name + "\t" +row.is_xman + "\t" +row.was_snapped);
       });
   });

db.close()

function createDatabase() {
    db = new sql.Database(db_path, (err) => {
        if (err) {
            console.log(`SQLITE3: Error creating database at ${db_path}` + err);
            exit(1);
        }
    });
    db.exec(`
    create table hero (
        hero_id int primary key not null,
        hero_name text not null,
        is_xman text not null,
        was_snapped text not null
    );
    insert into hero (hero_id, hero_name, is_xman, was_snapped)
        values (1, 'Spiderman', 'N', 'Y'),
               (2, 'Tony Stark', 'N', 'N'),
               (3, 'Jean Grey', 'Y', 'N');

    create table hero_power (
        hero_id int not null,
        hero_power text not null
    );

    insert into hero_power (hero_id, hero_power)
        values (1, 'Web Slinging'),
               (1, 'Super Strength'),
               (1, 'Total Nerd'),
               (2, 'Total Nerd'),
               (3, 'Telepathic Manipulation'),
               (3, 'Astral Projection');
    `);
}
