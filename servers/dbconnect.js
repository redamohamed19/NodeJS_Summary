var util = require('util');
var fs = require('fs');
var path = require('path');
var sqlite3 = require('sqlite3');
const DB_PATH = path.join(__dirname, 'my.db');
const DB_SQL_PATH = path.join(__dirname, 'mydb.sql');
var args = require('minimist')(process.argv.slice(2), {
  string: ['other']
});
main().catch(console.error);

//******************************** */

var SQL3;
async function main() {
  if (!args.other) {
    error("Missing '--other=..'");
    return;
  }

  // define some SQLite3 database helpers
  var myDB = new sqlite3.Database(DB_PATH);
  SQL3 = {
    run(...args) {
      return new Promise(function c(resolve, reject) {
        myDB.run(...args, function onResult(err) {
          if (err) reject(err);
          else resolve(this);
        });
      });
    },
    get: util.promisify(myDB.get.bind(myDB)),
    all: util.promisify(myDB.all.bind(myDB)),
    exec: util.promisify(myDB.exec.bind(myDB))
  };

  var initSQL = fs.readFileSync(DB_SQL_PATH, 'utf-8');
  await SQL3.exec(initSQL);

  var other = args.other;
  var something = Math.trunc(Math.random() * 1e9);

  // ***********
  var otherID = await insertOrLookupOther(other);
  if (otherID) {
    let result = await insertSomething(otherID, something);
    console.log('succes');
    if (result) {
      console.log('succes');
      return;
    }
  }
}
async function insertSomething(otherID, something) {
  var result = await SQL3.run(
    'insert into something(otherID,data) values(?,?)',
    otherID,
    something
  );
  if (result) {
    return true;
  } else {
    return false;
  }
}
async function insertOrLookupOther(other) {
  var result = await SQL3.get('SELECT id from other where data = ?', other);
  if (result && result.id) {
    return result.id;
  } else {
    result = SQL3.run('INSERT INTO other (data) values (?)', other);
  }
  if (result && result.lastID) {
    return result.lastID;
  }
}
function error(err) {
  if (err) {
    console.error(err.toString());
    console.log('');
  }
}
