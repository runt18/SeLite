#!/bin/bash
#change dir to where this script is located:
cd "$( dirname "${BASH_SOURCE[0]}" )"

# Based on https://developer.mozilla.org/en/Setting_up_extension_development_environment and http://kb.mozillazine.org/Profile_folder_-_Firefox
HOME_FOLDER=~

if [ "$(uname)" == "Darwin" ]; then
   # According to http://kb.mozillazine.org/Profile_folder_-_Firefox  there are two places for Firefox profile folder on Mac OS:
   # ~/Library/Mozilla/Firefox/Profiles/<profile folder> or ~/Library/Application Support/Firefox/Profiles/<profile folder> 
   # But on Mac OS 10.5.8 and 10.9.1 I could see the second folder only. If you can test both, please update this/send this to me.
   FIREFOX_FOLDER="$( echo "$HOME_FOLDER/Library/Application Support/Firefox/Profiles" )"
   FIREFOX_BINARY=/Applications/Firefox.app/Contents/MacOS/firefox
else
   FIREFOX_FOLDER="$( echo "$HOME_FOLDER/.mozilla/firefox" )"
   FIREFOX_BINARY=firefox
fi

PROFILE_FOLDER="$( echo "$FIREFOX_FOLDER/"*.SeLiteExtensionSequencerTest )"
# I couldn't have this for the following if condition: [ ! -e "$FIREFOX_FOLDER/*.SeLiteExtensionSequencerTest" ]
# If you know why that failed to detect the profile folder, please contact me.
if [ ! -e "$PROFILE_FOLDER" ]; then
    $FIREFOX_BINARY -no-remote -CreateProfile SeLiteExtensionSequencerTest
    
    PROFILE_FOLDER="$( echo "$FIREFOX_FOLDER/"*.SeLiteExtensionSequencerTest )"
    if [ ! -e "$PROFILE_FOLDER" ]; then
        echo Could not create Firefox profile SeLiteExtensionSequencerTest
        exit
    fi
fi

EXTENSION_FOLDER=$PROFILE_FOLDER/extensions

# If you haven't got any extensions in Firefox profile yet, there is no 'extensions' folder. So create it.
if [ ! -e "$EXTENSION_FOLDER" ]
then
  mkdir "$EXTENSION_FOLDER"
fi

cd ../src
pwd > "$EXTENSION_FOLDER"/extension-sequencer@selite.googlecode.com
cd - >/dev/null

rm -rf /tmp/selenium-ide.xpi
wget -O /tmp/selenium.xpi --quiet http://release.seleniumhq.org/selenium-ide/2.8.0/selenium-ide-2.8.0.xpi
unzip -q /tmp/selenium.xpi selenium-ide.xpi -d /tmp
cp /tmp/selenium-ide.xpi "$EXTENSION_FOLDER"/\{a6fd85ed-e919-4a43-a5af-8da18bda539f\}.xpi

# Even though extension-loader.js can use SeLiteMisc.withStackInMessage() to shorten the stack trace (if SeLiteMisc is present), we don't need to install SeLite Miscellaneous here, because run_tests.sh will remove any stack trace anyway.

cd extensions/rail
pwd >"$EXTENSION_FOLDER"/test-rail@selite.googlecode.com
cd ../train
pwd >"$EXTENSION_FOLDER"/test-train@selite.googlecode.com
cd ../journey
pwd >"$EXTENSION_FOLDER"/test-journey@selite.googlecode.com

echo Now starting firefox -P SeLiteExtensionSequencerTest. You may need to accept the test add-ons.

$FIREFOX_BINARY -no-remote -CreateProfile SeLiteExtensionSequencerTest