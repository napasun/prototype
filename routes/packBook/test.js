var sqlite3 = require('sqlite3').verbose();

const bookDBPath = 'db/books.db';

let db = new sqlite3.Database(bookDBPath);
const translate = require('./translate');
const query = require('./query');
const papago = require('./papago');
const parser = require("./parser");

// query.selectContentByIsbnAndContentIndex(db, (content) => {
//     console.log(content);
// }, "9781849696968", 0)

query.selectBookReservationByFinish(db, (rows) => {
    rows.forEach(element => {
        query.selectContentByIsbnAndContentIndex(db, (contents) => {
            contents.forEach((content) => {
                parser.HtmlToWiki(content.content, (data) => {
                    insertContentTranslate(db, [content.isbn, content.menuNum, content.contentIndex, content.title, data], ()=> {})
                    console.log(data)
                });
            }); 
        }, element.isbn, /*element.save*/49)
    });
});

db.close();

/**
 * CREATE TABLE "book" ( `isbn` TEXT NOT NULL, `title` TEXT NOT NULL, `publicationDate` TEXT, `imgUrl` TEXT, `category` TEXT, `description` TEXT, `mainType` TEXT, PRIMARY KEY(`isbn`) )
 * CREATE TABLE "bookReservation" ( `idx` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `isbn` TEXT NOT NULL, `finish` TEXT NOT NULL DEFAULT 'false', `save` INTEGER NOT NULL DEFAULT 0, `orderNum` INTEGER )
 * CREATE TABLE "bookTranslate" ( `isbn` TEXT )
 * CREATE TABLE "content" ( `isbn` TEXT NOT NULL, `menuNum` TEXT, `contentIndex` INTEGER NOT NULL, `title` TEXT, `content` TEXT, PRIMARY KEY(`isbn`,`contentIndex`) )
 * CREATE TABLE `contentTranslate` ( `isbn` TEXT, `menuNum` TEXT, `contentIndex` INTEGER, `title` TEXT, `content` TEXT, PRIMARY KEY(`isbn`,`contentIndex`) )
 * CREATE TABLE `errorLog` ( `idx` INTEGER PRIMARY KEY AUTOINCREMENT, `isbn` TEXT NOT NULL, `contentIdx` TEXT NOT NULL, `regDate` TEXT NOT NULL )
 * CREATE TABLE sqlite_sequence(name,seq)
 */
// query.insertBookReservation(db, (err) => {
//     if (err)
//         console.log(err);
// }, [9781849696968, false, 0, 0]);