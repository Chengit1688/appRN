import SQLite from 'react-native-sqlite-storage'

// SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "appdb";
const database_version = "1.0";
const database_displayname = "SQLite APP Database";
const database_size = 200000;

let instance;
async function init(filePath) {

  return new Promise(async(resolve, reject) => {

    await SQLite.echoTest().catch(error => {
      throw new Error("echoTest failed-----"+error);
    })

    const db = await SQLite.openDatabase({name: filePath}).catch(err => {
      throw new Error('SQLITE openDatabase failed---- ', err)
    })

    db.exec = async (query) => {
      return await new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(query, [], function(tx, res) {
            //console.debug('query-------',query, res)
            //console.debug("insertId: " + res.insertId + " -- probably 1");
            //console.debug("rowsAffected: " + res.rowsAffected + " -- should be 1");
            const arr = []
            for(var x = 0; x < res?.rows?.length; x++) {
              arr.push(res.rows.item(x))
            }
            resolve(arr)
          },
          function(tx, error) {
            console.debug('INSERT error-----: ' + error.message);
            reject(error)
          });
        }, function(error) {
          console.debug('transaction error------: ' + error.message);
          reject(error)
        }, function() {
          //console.debug('transaction ok');
        });
      }).catch(err => {
        throw new Error(err.message)
      })
    }

    const proxyDb = new Proxy(db, {})

    // You might want to try `PRAGMA page_size=8192;` too!
    proxyDb.exec(`
      PRAGMA page_size=8192;
      PRAGMA journal_mode=MEMORY;
    `);

    resolve(proxyDb)
  })
}


export async function getInstance(filePath) {
  if (instance) {
    return instance;
  }
  if (!filePath) {
    throw new Error('must speciefic database file');
  }
  instance = new Promise((resolve, reject) => {
    const db = init(filePath);
    db.then(res => resolve(res)).catch(err => reject(err));
  });
  return instance;
}

export async function resetInstance() {
  if (!instance) {
    return;
  }
  const db = await instance;

  db.close(function () {
    console.debug("DB closed!");
    instance = undefined;
  }, function (error) {
      console.debug("Error closing DB:" + error.message);
      throw new Error(error)
  });
}

