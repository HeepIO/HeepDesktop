import fs from 'fs'
import path from 'path'

var iconContent = {};

export var SetDeviceIconFromString = (deviceID, deviceName, deviceIconName) => {
  var suggestedIcon = deviceIconName;

  if (deviceIconName == 'none') {
    suggestedIcon = suggestIconForDevice(deviceName);
    console.log('Suggesting a default icon: ', suggestedIcon);
    deviceIconName = suggestedIcon;
  }

  // if (!(suggestedIcon in iconContent)) {
  //   SaveIconFromFile(suggestedIcon);
  // }

  iconContent[deviceID] = deviceIconName;

}

export var GetIconContent = () => {
  return iconContent
}

export var suggestIconForDevice = (deviceName) => {
  var suggestedIcon = 'none';

  var defaultIcons = getDefaultIcons();
  var keywordReference = generateIconKeywords(defaultIcons);

  for (var keyword in keywordReference) {
    var lowercaseName = deviceName.toLowerCase();
    if (lowercaseName.search(keyword) > -1){
      suggestedIcon = keywordReference[keyword];
    }
  }

  // if (!(suggestedIcon in iconContent)) {
  //   SaveIconFromFile(suggestedIcon);
  // }

  return suggestedIcon
}

var SaveIconFromFile = (deviceIconName) => {
  var filepath = path.join(__dirname, '../assets/svg/', deviceIconName + '.svg');
  fs.readFile(filepath, (err, data) => {
    if (err) {
      console.error('SVG failed: ', filepath);
    } else {
      iconContent[deviceIconName] = data.toString();
    }
  })
}


export var generateIconKeywords = (names) => {
  var keywords = {};

  for (var i = 0; i < names.length; i++){
    var words = names[i].split('-');
    for (var thisWord = 0; thisWord < words.length; thisWord++){
      var keyword = words[thisWord]
      keywords[keyword.toLowerCase()] = names[i];
    }
  }

  return keywords
}

export var getDefaultIcons = () => {
  var files = fs.readdirSync('./src/serverside/assets/');
  var svgs = [];

  for (var i = 0; i < files.length; i++){
    var splitFilename = files[i].split('.');
    if (splitFilename[1] == 'svg'){
      svgs.push(splitFilename[0]);
    }
  }

  return svgs
}

export var nameCustomIcon = (deviceID) => {
  return deviceID.toString() + '.' + 'custom'
}

export var setCustomIcon = (deviceID, data) => {
  var customName = nameCustomIcon(deviceID);
  iconContent[deviceID] = customName;
  iconContent[customName] = data.toString('ascii');
}