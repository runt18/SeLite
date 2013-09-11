/*
 * Copyright 2013 Peter Kehl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";

function SeLiteCoreLoader() {}

/** Object serving as an associative array {
 *  string pluginId => object {
 *     string 'url' => plugin url (usually chrome://...)
 *     string 'requisitePluginIds' => array (possibly empty) of strings which are plugin ids of requisite plugins
 *  }
 * */
SeLiteCoreLoader.plugins= {};

/** Register a Firefox plugin which is a Selenium IDE core extension. It will be
 *  initiated by SeLiteCoreLoader later, in a proper sequence - after any dependencies.
 *  @param pluginId String, unique id of the Firefox plugin (usually in a format of an email address)
 *  @param url String url that will be passed to Selenium's API.addPluginProvidedUserExtension(url) for initialisation.
 *  It can be an empty string, if the plugin doesn't get initialised by SeLiteCoreLoader
 *  - then SeLiteCoreLoader won't call API.addPluginProvidedUserExtension(url) neither API.addPlugin(pluginId).
 *  Pass an empty string for plugins which you want to list as dependencies of other extensions
 *  that *do* get initialised by SeLiteCoreLoader. See SeLite DB Objects and its dependency SQLite Connection Manager.
 *  @param requisitePluginIds Array of string pluginIds of all direct dependencies - plugins that
 *  have to be loaded before given pluginId. All those plugins must be installed in Firefox
 *  and they must also call SeLiteCoreLoader.registerPlugin() - otherwise pluginId won't get loaded.
 *  requisitePluginIds can be an empty array or not specified.
 *  @param optionalRequisitePluginIds Array of string pluginIds of optional direct dependencies.
 *  If they are installed, then pluginId will be initialised after any of them.
 *  Otherwise they are ignored and no error is reported. optionalRequisitePluginIds
 *  can be an empty array or not specified.
**/
SeLiteCoreLoader.registerPlugin= function( pluginId, url, requisitePluginIds, optionalRequisitePluginIds ) {
    if( pluginId in SeLiteCoreLoader.plugins ) {
        throw new Error("Plugin " +pluginId+ " was already registered with SeLite Core loader.");
    }
    url= url || '';
    requisitePluginIds= requisitePluginIds || [];
    optionalRequisitePluginIds= optionalRequisitePluginIds || [];
    var mergedPluginIds= requisitePluginIds.concat( optionalRequisitePluginIds );
    for( var i=0; i<mergedPluginIds.length; i++ ) {
        if( mergedPluginIds.indexOf(mergedPluginIds[i])!=i ) {
            throw new Error( "SeLite Core Loader: plugin " +pluginId+ " lists a dependancy package " +mergedPluginIds[i]+ " two or more times." );
        }
    }
    SeLiteCoreLoader.plugins[pluginId]= {
        url: url,
        requisitePluginIds: requisitePluginIds,
        optionalRequisitePluginIds: optionalRequisitePluginIds
    };
};

/** @return array of plugin IDs, sorted so that ones with no dependencies are first,
 *  and then any plugins only depending on any previous plugins. I.e. in an order
 *  that they can be safely loaded.
 * */
SeLiteCoreLoader.sortedPluginIds= function() {
    // Partial copy of SeLiteCoreLoader.plugins. Used by this function, which will remove requisite plugin ids
    // from pluginUnprocessedRequisites[xxx][], as they get processed.
    var pluginUnprocessedRequisites= {}; // { dependant plugin id => [unprocessed requisite plugin id...] }
    for( var dependantId in SeLiteCoreLoader.plugins ) {
        pluginUnprocessedRequisites[dependantId]=
            SeLiteCoreLoader.plugins[dependantId].requisitePluginIds.slice(0); // protective copy
        for( var optionalPluginId of SeLiteCoreLoader.plugins[dependantId].optionalRequisitePluginIds ) {
            if( optionalPluginId in SeLiteCoreLoader.plugins ) {
                // optionalPluginId is among the ones that I'm initialising, therefore I treat it like a mandatory requisite
                pluginUnprocessedRequisites[dependantId].push( optionalPluginId );
                //throw new Error('Optional ' +optionalPluginId+ ' is present.');
            }
        }
    }
      //throw new Error('pluginUnprocessedRequisites[db-storage]: ' +pluginUnprocessedRequisites['db-storage@selite.googlecode.com']);

    var unprocessedIds= Object.keys(SeLiteCoreLoader.plugins);
    //throw new Error(''+unprocessedIds);
    var result= []; // [pluginId...] in the order from one with no dependencies, to the dependant ones
    
    // I believe this has computational cost O(N^2), which is fine with me.
    for( var i=0; i<unprocessedIds.length; i++ ) {
        var pluginId=unprocessedIds[i];
        if( !pluginUnprocessedRequisites[pluginId].length ) {
            result.push( pluginId );
            delete pluginUnprocessedRequisites[pluginId];
            unprocessedIds.splice(i, 1); // remove pluginId  from unprocessedIds[]
            
            // Remove pluginId from dependencies of the rest of unprocessed plugins - from pluginUnprocessedRequisites[xxx][]
            for( var dependantId in pluginUnprocessedRequisites ) {
                var requisites= pluginUnprocessedRequisites[dependantId];
                var index= requisites.indexOf(pluginId);
                if( index>=0 ) {
                    requisites.splice( index, 1 );
                }
            }
            
            i= -1; // restart the loop
            continue;
        }
    }
    if( unprocessedIds.length ) {
        var msg= '';
        for( var pluginId of unprocessedIds ) {
            if( msg!=='' ) {
                msg+= ', ';
            }
            msg+= pluginId+ ' dependant on unprocessed plugin(s) [' +pluginUnprocessedRequisites[pluginId]+ ']';
        }
        msg= "Something bad in SeLiteCoreLoader.sort(), "
            + "or there is a cyclic dependency between plugin(s), "
            + "or you haven't installed at least one dependency. Buggy plugin(s): " +msg+ '.' + 'Result: ' +result;
        throw new Error( msg );
    }
    return result;
};
        
var EXPORTED_SYMBOLS= ['SeLiteCoreLoader'];