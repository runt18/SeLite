/*  Copyright 2014 Peter Kehl
    This file is part of SeLite Auto Check.
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
"use strict";
var SeLiteAutoCheck= {};

( function() {
    Components.utils.import( "chrome://selite-misc/content/selite-misc.js" );

    /** Parent class of all Auto Check detectors. For description of items of parameters required, refused and ignored check the actual implementation subclasses.
     * When debugging failedXYZ() methods, beware that running a single verification that fails (by double-clicking) doesn't log any message about the failure. It only highlights the command (in the editor matrix) in red/pink. Only when you run a test case/suite then any failed verifications log their messages in the log (in red).
     *  @param {object} required Object serving as an array of entries matching any required contents. In default implementation an entry can be any Selenese locator.
     *  @param {object) refused Object serving as an array of entries matching any refused contents. In default implementation an entry can be any Selenese locator.
     *  @param {object) ignored Object serving as an array of entries matching any ignored notices/warnings/errors. The detail of what these entries can be is up to the implementation of failedNotIngored(document) in the actual subclass.
     *  @param {boolean} assert Whether to run the checks as assertions; otherwise they are run as validation only. Optional, false by default.
     * */
    SeLiteAutoCheck.Detector= function Detector( required, refused, ignored, assert ) {
        this.required= required || {};
        this.refused= refused || {};
        this.ignored= ignored || {};
        this.assert= assert || false;
        typeof this.required==='object' || SeLiteMisc.fail( 'parameter required must be an object, if provided' );
        typeof this.refused==='object' || SeLiteMisc.fail( 'parameter refused must be an object, if provided' );
        typeof this.ignored==='object' || SeLiteMisc.fail( 'parameter ignored must be an object, if provided' );
        typeof this.assert==='boolean' || SeLiteMisc.fail( 'parameter assert must be a boolean, if provided' );
    };
    /** Check the document for required part(s).
     *  @param {object} document
     *  @return {(boolean|string)} False on success (i.e. the document didn't fail); string message on failure.
     * */
    SeLiteAutoCheck.Detector.prototype.failedRequired= function failedRequired( document ) {
        for( var key in this.required ) {
            if( eval_locator( this.required[key], document ).length===0 ) {
                return "Locator " +this.required[key]+ " didn't match any element.";
            }
        }
        return false;
    };
    /** Check the element for part(s) that it must not have.
     *  @param {object} document
     *  @return {(boolean|string)} False on success (i.e. the document didn't fail); string message on failure.
     * */
    SeLiteAutoCheck.Detector.prototype.failedRefused= function failedRefused( document ) {
        for( var key in this.refused ) {
            if( eval_locator( this.refused[key], document ).length!==0 ) {
                return "Locator " +this.refused[key]+ " matched some element(s).";
            }
        }
        return false;
    };
    /** Check the element for part(s) that it must not have and that are not to be ignored. Default implementation doesn't check anything.
     *  @param {object} document
     *  @return {(boolean|string)} False on success (i.e. the document didn't fail); string message on failure.
     * */
    SeLiteAutoCheck.Detector.prototype.failedNotIgnored= function failedNotIgnored( document ) { return false; };

    /** Auto Check for PHP (optionally with XDebug).
     * @param {object} required Object of locators.
     * @param {object} refused Object of locators.
     * @param {object} ignored Object of logical XPath conditions - expressions that fit into [] part of XPath. They match warnings/notices/errors that are not to be reported. They can refer to the matched text node as '.'. They should not contain relative references to parent/sibling nodes. They can match an error message (a part after 'Notice', 'Warning', 'Error') or the file path of the leaf file where the error comes from. If you follow this, the matching works whether you use PHP with Xdebug or without it.
     *  @param {boolean} assert See the same parameter of SeLiteAutoCheck.Detector().
    */
    SeLiteAutoCheck.DetectorPHP= function DetectorPHP( required, refused, ignored, assert ) {
        SeLiteAutoCheck.Detector.call( this, required, refused, ignored, assert );
    };
    SeLiteAutoCheck.DetectorPHP.prototype= new SeLiteAutoCheck.Detector();
    SeLiteAutoCheck.DetectorPHP.prototype.constructor= SeLiteAutoCheck.DetectorPHP;

    SeLiteAutoCheck.DetectorPHP.prototype.failedNotIgnored= function failedNotIgnored( document ) {
        var errorElements= eval_xpath( "//table[ contains(@class, 'xdebug-error') ]", document);
        var fromXdebug= errorElements.length!==0;
        if( !fromXdebug ) {
            // Following matches one node per error - the description/message
            errorElements= eval_xpath( "//b[ .='Notice' or .='Warning' or .='Error' ]/following-sibling::node()[1][ starts-with(., ': ') ]", document );
            // I could match both the description and file path by one regex, but matching and handling results would be more complicated:
            // "//b[ .='Notice' or .='Warning' or .='Error' ][ following-sibling::node()[1][starts-with(., ': ') and following-sibling::node()[2][contains(., 'on line')] ] ]/following-sibling::node()[ 1 ]"
        }
        errorElementLoop:
        for( var i=0; i<errorElements.length; i++ ) { //@TODO for..of..
            var errorElement= errorElements[i];
            var errorFileElements= undefined; // element containing the file path where the error was reported (if displayed and if !fromDebug)
            // If fromXdebug, then I don't match the file location separately - it's already within errorElement
            if( !fromXdebug ) {
                //errorFileElements= eval_xpath( "./following-sibling::node()[1]", document, {contextNode: errorElement} );
                errorFileElements= eval_xpath( "/following-sibling::b[1]", document, {contextNode: errorElement} );
            }
            for( var key in this.ignored ) {
                var ignoredXPath= '/self::node()[' +this.ignored[key]+ ']';
                if( eval_xpath( ignoredXPath, document, {contextNode: errorElement} ).length!==0 ) {
                    continue errorElementLoop;
                }
                if( errorFileElements && errorFileElements.length!==0 ) {
                    if( eval_xpath( ignoredXPath, document, {contextNode: errorFileElements[0]} ).length!==0 ) {
                        continue errorElementLoop;
                    }                        
                }
            }
            return 'There was a notice/warning/error that is not on the ignored list: ' +
                (errorElement.wholeText
                    ? errorElement.wholeText
                    : errorElement.textContent
                )+
                (errorFileElements && errorFileElements.length!==0
                    ? ' ' +errorFileElements[0].textContent
                    : ''
                );
        }
        return false;
    };
} ) ();