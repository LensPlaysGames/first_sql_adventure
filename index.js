let sql = require("sqlite3");
let db_path = "./xxtestxx.db";
let db = new sql.Database(db_path, sql.OPEN_READWRITE, (err) => {
    if (err) {
        if (err.code == "SQLITE_CANTOPEN") {
            createDatabase()
            return;
        }
        console.log(`SQLITE3: Error opening database -- ${err}`);
        exit(1);
    }
    let query = `
    SELECT items.item_id, items.item_index, items.item_creator_id, items.item_name, items.item_url, creator_addresses.creator_address
    FROM ITEMS
    INNER JOIN creator_addresses ON items.item_creator_id = creator_addresses.item_creator_id`
    db.all(query, (err, rows) => {
        if (err) {
            console.log(`SQLITE3: Error querying database -- ${err}`);
            exit(1);
        }
        console.log("item_id:idx\tcreator_id\titem_name\titem_url\tcreator_address")
        rows.forEach(row => {
            console.log(`${row.item_id}:${row.item_index}\t${row.item_creator_id}\t\t${row.item_name}\t${row.item_url}\t${row.creator_address}`);
        });
    });

    print_all_items_given_owner(1072)

    db.close()
});

function print_all_items_given_owner(owner) {
    if (typeof(owner) !== "number" || !Number.isInteger(owner)) return;
    let query = `
    SELECT items.item_index, items.item_owner_id, items.item_name, items.item_url
    FROM ITEMS
    WHERE items.item_owner_id = ${owner}`
    db.all(query, (err, rows) => {
        if (err) {
            console.log("SQLITE3: Error querying database -- " + err);
            exit(1);
        }
        console.log(`Owned by ${owner}`)
        console.log("item_name:idx\titem_url")
        rows.forEach(row => {
            console.log(`  ${row.item_name}:${row.item_index}\t${row.item_url}`);
        });
    });
}

function createDatabase() {
    db = new sql.Database(db_path, (err) => {
        if (err) {
            console.log(`SQLITE3: Error creating database at ${db_path}` + err);
            exit(1);
        }
    });
    // item_index :: unique per item instance within game. i.e. 10000
    // people may own the same item, but each person will own an item with
    // a unique item_index.
    db.exec(`
    CREATE TABLE items (
        item_id INT PRIMARY KEY NOT NULL,
        item_creator_id INT NOT NULL,
        item_owner_id INT NOT NULL,
        item_name TEXT NOT NULL,
        item_index INT NOT NULL,
        item_url TEXT NOT NULL
    );
    INSERT INTO items (item_id, item_creator_id, item_owner_id, item_name, item_index, item_url)
        VALUES (1, 1, 1072, 'Thunderous Bolt', 1, 'https://www.gameone.server.io/items/thunderousbolt'),
               (2, 1, 2489, 'Fireball', 1, 'https://www.gameone.server.io/items/fireball'),
               (3, 1, 738, 'Icy Storm', 1, 'https://www.gameone.server.io/items/icystorm'),
               (4, 3, 642, 'Cantankerous Brew', 1, 'https://www.gamethree.net/item4'),
               (5, 1, 1072, 'Thunderous Bolt', 2, 'https://www.gameone.server.io/items/thunderousbolt'),
               (6, 3, 1072, 'Thick Branch', 1, 'https://www.gamethree.net/item5');

    CREATE TABLE creator_addresses (
        item_creator_id INT PRIMARY KEY NOT NULL,
        creator_address TEXT UNIQUE NOT NULL
    );

    INSERT INTO creator_addresses (item_creator_id, creator_address)
        values (1, '0xdeadbeef'),
               (2, '0xcafed00d'),
               (3, '0xf00d6969');
    `);
}
