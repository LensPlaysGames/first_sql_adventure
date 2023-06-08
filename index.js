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

db.all(`select item_id, item_creator_id, item_name, item_url from items i`, (err, rows) => {
    if (err) {
        console.log("SQLITE3: Error querying database -- " + err);
        exit(1);
    }
    console.log("item_id\tcreator_id\titem_name\titem_url")
    rows.forEach(row => {
        console.log(row.item_id + "\t" + row.item_creator_id + "\t\t" + row.item_name + "\t" +row.item_url);
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
    create table items (
        item_id int primary key not null,
        item_creator_id int not null,
        item_owner_id int not null,
        item_name text not null,
        item_url text not null
    );
    insert into items (item_id, item_creator_id, item_owner_id, item_name, item_url)
        values (1, 1, 1072, 'Thunderous Bolt', 'https://www.gameone.server.io/items/thunderousbolt'),
               (2, 1, 738, 'Fireball', 'https://www.gameone.server.io/items/fireball'),
               (3, 1, 2489, 'Icy Storm', 'https://www.gameone.server.io/items/icystorm');

    create table creator_addresses (
        item_creator_id int primary key not null,
        creator_address text unique not null
    );

    insert into creator_addresses (item_creator_id, creator_address)
        values (1, '0xdeadbeef'),
               (2, '0xcafed00d'),
               (3, '0xf00d6969');
    `);
}
