"use strict";

Components.utils.import( "chrome://selite-db-objects/content/Db.js" ); // this loads 'SeLiteData' object into Selenium Core scope, so that it can be used by Selenese
Components.utils.import( "chrome://selite-db-objects/content/DbStorage.js" );
Components.utils.import( "chrome://selite-db-objects/content/DbObjects.js" );
Components.utils.import( "chrome://selite-db-objects/content/DbFunctions.js" );

/** This is not called getRecord, because then autogenerated storeRecord would be confusing/counter-intuitive: it could imply that it's storing something in the DB, while it would be retrieving a record from the DB and storing it in a stored variable.
 * */
Selenium.prototype.getReadRecord= function getReadRecord( info ) {
    /** @type {SeLiteData.Table} */
    var table;
    /** @type SeLiteData.RecordSetFormula*/
    var formula;
    LOG.debug( 'getReadRecord info: ' +typeof info+ ': ' +SeLiteMisc.objectToString(info, 2));
    if( 'table' in info ) {
        table= info.table;
        table instanceof SeLiteData.Table || SeLiteMisc.fail( 'info.table must be an instance of SeLiteData.Table');
        formula= table.formula();
    }
    else if( 'formula' in info ) {
        formula= info.formula;
        formula instanceof SeLiteData.RecordSetFormula || SeLiteMisc.fail( 'info.formula must be an instance of SeLiteData.RecordSetFormula');
        table= formula.table;
    }
    else {
        SeLiteMisc.fail('getReadRecord() expects info.table or info.formula to be present.');
    }
    /**@type {object}*/var matchingPairs= SeLiteMisc.objectClone(info, table.columns );
    delete matchingPairs.info;
    delete matchingPairs.formula;
    // Following check depends on requirement that only one of info.table or info.formula is present
    Object.keys(matchingPairs).length===Object.keys(info).length-1 || SeLiteMisc.fail( 'There are some field(s) in info.matchingPairs that are not present in table/formula definition.' );

    var records= formula.select( matchingPairs );
    LOG.debug( 'getReadRecord: ' +records );
    var record= null;
    for( var key in records ) { // Return the only record, if any:
        if( record!==null ) {
            SeLiteMisc.fail( 'There is more than one record.' );
        }
        record= records[key];
    }
    LOG.debug( 'record: ' +SeLiteMisc.objectToString(record, 2) );
    return record;
};

/** @param {object} recordObject
 *  @param {SeLiteData.Table} table
 * */
Selenium.prototype.doInsertRecord= function doInsertRecord( recordObject, table) {
    var record= new SeLiteData.Record(recordObject);
    table.insert(record);
    if( typeof table.primary==='string' && record[table.primary]!==undefined ) {
        recordObject[ table.primary ]= storedVars.insertedRecordKey= record[table.primary];
    }
};